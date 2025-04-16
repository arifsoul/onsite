import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const BASE_URL = 'https://openrouter.ai/api/v1';

export const generateCode = async (prompt) => {
  if (!API_KEY) {
    throw new Error('OpenRouter API key is missing. Please set VITE_OPENROUTER_API_KEY in .env.');
  }

  if (!prompt || prompt.trim() === '') {
    throw new Error('Prompt cannot be empty.');
  }

  try {
    console.log('🌐 Sending request to API...');
    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: 'deepseek/deepseek-r1',
        messages: [
          {
            role: 'system',
            content:
              `You are an AI that generates professional-grade frontend code for any type of website, with a strong emphasis on mobile responsiveness, based on user descriptions. Return structured JSON with fields: html, css, js, and components array listing sub-components (e.g., ["Header", "Hero", "ContentSection", "Features", "Testimonials", "CallToAction", "ContactForm", "BlogFeed", "ProductGrid", "Footer"]). 
              Example: {
              "html": "<!DOCTYPE html><html lang=\\"en\\"><head><meta charset=\\"UTF-8\\"><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"></head><body>...</body></html>",
              "css": ":root { --primary-color: #007bff; } .class { ... } @media (max-width: 768px) { ... }",
              "js": "function init() { ... }",
              "components": ["Header", "Hero", "ContentSection", "Features", "Testimonials", "CallToAction", "ContactForm", "BlogFeed", "ProductGrid", "Footer"]
              }. 
              Include advanced, reusable components such as: Header (with sticky navigation, mobile hamburger menu, and touch-friendly dropdowns), 
              Hero (with dynamic backgrounds like video or parallax, optimized for mobile), ContentSection (with flexible layouts for text, images, 
              or tabs, stacking on mobile), Features (for services or products with hover effects on desktop and tap support on mobile), 
              Testimonials (with touch-enabled carousel or grid layouts), CallToAction (with responsive buttons or modals), 
              ContactForm (with mobile-friendly input fields, validation, and submission handling), BlogFeed (with pagination or infinite scroll, 
              optimized for mobile loading), ProductGrid (with mobile-friendly filtering and sorting for e-commerce), 
              and Footer (with collapsible social links and newsletter signup on mobile). 
              Use vanilla JavaScript, CSS, and HTML without frameworks. Ensure semantic HTML5, accessibility (ARIA roles, keyboard and screen reader support, touch events), and SEO best practices (meta tags, structured data). 
              Generate fully responsive designs using modern CSS (flexbox, grid, media queries, relative units like vw/vh/rem/em) with CSS custom properties for theming, prioritizing mobile-first design (base styles for mobile, 
              enhanced for larger screens). Include robust JavaScript for interactivity, such as smooth scrolling, dynamic content loading, form validation, lazy loading for images, and touch event handling for mobile (e.g., swipe for carousels). 
              Ensure components are modular, well-documented, and adaptable for diverse website types, including corporate sites, e-commerce platforms, blogs, portfolios, or landing pages. Handle edge cases like browser compatibility, 
              performance optimization (e.g., minimal reflows, optimized assets, mobile-specific image sizes), and mobile usability (e.g., avoiding hover-only interactions, ensuring tap targets are at least 48px). Test layouts for common mobile breakpoints (e.g., 320px, 375px, 768px).`,
          },
          { role: 'user', content: prompt },
        ],
        stream: false,
        temperature: 0.7,
        max_tokens: 4096,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
          'HTTP-Referer': 'http://localhost',
          'X-Title': 'Frontend Code Generator',
        },
      }
    );

    const result = response.data.choices[0]?.message?.content;
    if (!result) {
      throw new Error('Invalid response from OpenRouter API: No content found.');
    }

    
    console.log('🧹 Cleaning API response...');
    let cleanedResult = result.trim();

    if (cleanedResult.startsWith('```json')) {
      cleanedResult = cleanedResult.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    console.log('✅ Cleaned response ready for parsing.');

    const parseJsonAsync = async (data) => {
      return new Promise((resolve, reject) => {
        console.log('📜 Parsing JSON...');
        try {
          const parsed = JSON.parse(data);
          console.log('🎉 JSON parsed successfully!');
          resolve(parsed);
        } catch (error) {
          console.error('❌ JSON parsing failed!');
          reject(error);
        }
      });
    };

    let parsedResult;
    try {
      parsedResult = await parseJsonAsync(cleanedResult);
    } catch (parseError) {
      console.error('Failed to parse cleaned API response as JSON:', cleanedResult);
      throw new Error('Failed to parse cleaned API response as JSON.');
    }

    if (!parsedResult.html || !parsedResult.css || !parsedResult.js) {
      throw new Error('API response missing required fields (html, css, js).');
    }

    return {
      data: {
        html: parsedResult.html,
        css: parsedResult.css,
        js: parsedResult.js,
        components: parsedResult.components || [],
      },
    };
  } catch (error) {
    console.error('OpenRouter API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 429) {
      throw new Error('OpenRouter API quota exceeded. Try again later.');
    }
    throw new Error(
      error.response?.data?.error?.message ||
        error.message ||
        'Failed to generate code. Please check API key and network.'
    );
  }
};
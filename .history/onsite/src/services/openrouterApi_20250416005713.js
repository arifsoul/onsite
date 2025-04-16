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
              `You are an AI that generates professional-grade frontend code for any type of website, with a strong emphasis on mobile responsiveness, seamless integration between HTML, CSS, and JavaScript, and visually appealing designs. Return structured JSON with fields: html, css, js, and components array listing sub-components (e.g., ["Header", "Hero", "ContentSection", "Features", "Testimonials", "CallToAction", "ContactForm", "BlogFeed", "ProductGrid", "Footer"]). Example: {
              "html": "<!DOCTYPE html><html lang=\\"en\\"><head><meta charset=\\"UTF-8\\"><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"></head><body>...</body></html>",
              "css": ":root { --primary-color: #007bff; } .class { ... } @media (max-width: 768px) { ... }",
              "js": "function init() { ... }",
              "components": ["Header", "Hero", "ContentSection", "Features", "Testimonials", "CallToAction", "ContactForm", "BlogFeed", "ProductGrid", "Footer"]
            }.

            ### Core Requirements:
            - **Non-Blank Backgrounds**: Every page must have a visually appealing background (e.g., solid color, linear/radial gradient, or optimized image with fallback for mobile). Use CSS custom properties (e.g., --background-color) for theming. Ensure backgrounds are performant (e.g., compressed images, lazy-loaded for mobile) and adapt to mobile breakpoints (320px, 375px, 768px).
            - **Seamless Integration**: Ensure HTML, CSS, and JavaScript are tightly integrated:
              - HTML elements must have corresponding CSS styles (via classes or IDs) and JavaScript functionality (e.g., event listeners for buttons, forms, or carousels).
              - Use consistent naming conventions for classes/IDs across HTML, CSS, and JS to ensure no orphaned styles or scripts.
              - Test integration by ensuring every interactive element (e.g., buttons, menus, forms) has associated CSS (e.g., hover/tap states) and JS (e.g., click/touch events).
            - **Visual Design**: Include smooth transitions, animations (e.g., fade-ins, slide-ins), and micro-interactions (e.g., button hover/tap effects) that work on both desktop and mobile. Use CSS for animations where possible to optimize performance.
            - **Modular Components**: Generate reusable, well-documented components such as:
              - **Header**: Sticky navigation with mobile hamburger menu, touch-friendly dropdowns, and smooth scroll links.
              - **Hero**: Dynamic background (e.g., gradient, video, or parallax) with mobile-optimized fallback (e.g., static image).
              - **ContentSection**: Flexible layouts (text, images, tabs) that stack on mobile with responsive typography.
              - **Features**: Service/product cards with desktop hover effects and mobile tap support.
              - **Testimonials**: Touch-enabled carousel or grid with swipe gestures for mobile.
              - **CallToAction**: Responsive buttons or modals with clear tap targets (min 48px).
              - **ContactForm**: Mobile-friendly inputs, real-time validation, and submission handling with success/error states.
              - **BlogFeed**: Pagination or infinite scroll, optimized for mobile with lazy-loaded images.
              - **ProductGrid**: Mobile-friendly filtering/sorting for e-commerce with touch support.
              - **Footer**: Collapsible social links and newsletter signup on mobile.
            - **Technology Stack**: Use vanilla JavaScript, CSS, and HTML without frameworks. Leverage modern CSS (flexbox, grid, media queries, relative units like vw/vh/rem/em) and CSS custom properties for theming. Prioritize mobile-first design (base styles for mobile, enhanced for larger screens).
            - **Interactivity**: Include robust JavaScript for:
              - Smooth scrolling for navigation links.
              - Dynamic content loading (e.g., blog posts or product grids).
              - Form validation with real-time feedback.
              - Lazy loading for images and other assets.
              - Touch event handling for mobile (e.g., swipe for carousels, tap for menus).
            - **Accessibility and SEO**: Use semantic HTML5, ARIA roles, keyboard navigation, and screen reader support. Include SEO best practices (meta tags, structured data, alt text for images).
            - **Performance and Compatibility**: Optimize for performance (minimal reflows, compressed assets, mobile-specific image sizes). Ensure browser compatibility (Chrome, Firefox, Safari, Edge). Avoid hover-only interactions on mobile; ensure tap targets are at least 48px.
            - **Testing**: Simulate component integration to ensure:
              - CSS styles are applied to all HTML elements.
              - JavaScript event listeners are attached to relevant elements.
              - No blank or unstyled sections (e.g., body or sections must have background styles).
              - Mobile layouts are tested at common breakpoints (320px, 375px, 768px).
            - **Edge Cases**: Handle slow network conditions (e.g., fallback for failed image loads), low-resolution displays, and touch-only devices.

            Generate fully responsive, visually engaging, and interactive designs that are adaptable for diverse website types (corporate sites, e-commerce, blogs, portfolios, landing pages). Ensure every component is modular, well-documented, and tested for functionality and visual consistency.`,
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
    let cleanedResult = extractJsonFromResponse(result);
    console.log('✅ Cleaned response ready for parsing.');

    const parseJsonAsync = async (data) => {
      return new Promise((resolve, reject) => {
        console.log('📜 Parsing JSON...');
        try {
          const parsed = JSON.parse(data);
          console.log('🎉 JSON parsed successfully!');
          resolve(parsed);
        } catch (error) {
          console.error('❌ JSON parsing failed!', error);
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

// Function to extract JSON content from the response
function extractJsonFromResponse(response) {
  const jsonStart = response.indexOf('```json');
  const jsonEnd = response.lastIndexOf('```');
  
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    let jsonContent = response.substring(jsonStart + 7, jsonEnd).trim();
    jsonContent = jsonContent.replace(/^\n+|\n+$/g, ''); // Remove leading/trailing newlines
    return jsonContent;
  } else {
    throw new Error('No JSON content found in the API response.');
  }
}
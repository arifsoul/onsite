import dotenv from 'dotenv';
import readline from 'readline';
import fetch from 'node-fetch'; // Required for Node.js HTTP requests

// Load environment variables
dotenv.config();

const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const LOCAL_BASE_URL = 'http://localhost:11434/v1';
const USE_LOCAL_MODEL = true; // Boolean flag to switch between local and OpenRouter API

/**
 * Generates frontend code for a website based on the provided prompt.
 * @param {string} prompt - The user prompt describing the website.
 * @returns {Promise<{data: {html: string, css: string, js: string, components: string[]}}>} - Generated code.
 */
const generateCode = async (prompt) => {
  if (!prompt || prompt.trim() === '') {
    throw new Error('Prompt cannot be empty.');
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  let baseUrl, model;
  if (USE_LOCAL_MODEL) {
    baseUrl = LOCAL_BASE_URL;
    model = 'deepseek-r1:7b';
    console.log('🌐 Using local Ollama API (deepseek-r1:7b)...');
  } else {
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key is missing. Set VITE_OPENROUTER_API_KEY in .env.');
    }
    baseUrl = OPENROUTER_BASE_URL;
    model = 'deepseek/deepseek-r1:free';
    headers['Authorization'] = `Bearer ${OPENROUTER_API_KEY}`;
    headers['HTTP-Referer'] = 'http://localhost';
    headers['X-Title'] = 'Frontend Code Generator';
    console.log('🌐 Using OpenRouter API (deepseek/deepseek-r1:free)...');
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: `
              You are an AI that generates professional-grade frontend code for any type of website, with a strong emphasis on mobile responsiveness, seamless integration between HTML, CSS, and JavaScript, and visually appealing designs. Your output must be a single JSON object wrapped in \`\`\`json and \`\`\`, with no additional text before or after. Example:
              \`\`\`json
              {
                "html": "<!DOCTYPE html><html lang=\\"en\\"><head><meta charset=\\"UTF-8\\"><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"></head><body>...</body></html>",
                "css": ":root { --primary-color: #007bff; } .class { ... } @media (max-width: 768px) { ... }",
                "js": "document.addEventListener('DOMContentLoaded', () => { const element = document.querySelector('.class'); if (element) { element.addEventListener('click', () => { ... }); } });",
                "components": ["Header", "Hero", "ContentSection", "Features", "Testimonials", "CallToAction", "ContactForm", "BlogFeed", "ProductGrid", "Footer"]
              }
              \`\`\`

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

              ### Enhanced JavaScript Requirements:
              - **Safe Event Listeners**: Always check for the existence of DOM elements before attaching event listeners to prevent null reference errors. Example:
                \`\`\`javascript
                document.addEventListener('DOMContentLoaded', () => {
                  const element = document.querySelector('.some-element');
                  if (element) {
                    element.addEventListener('click', () => {
                      // Event handler
                    });
                  } else {
                    console.error('Element .some-element not found');
                  }
                });
                \`\`\`
              - **DOM Readiness**: Wrap all JavaScript code that interacts with the DOM in a 'DOMContentLoaded' event listener to ensure the DOM is fully loaded before execution.
              - **Error Handling**: Include try-catch blocks for critical operations (e.g., fetching data, manipulating DOM) and log errors to the console for debugging.

              ### Enhanced Formatting Requirements:
              - **Code Structure and Readability**:
                - **HTML**: Use consistent 2-space indentation. Include comments to separate sections (e.g., <!-- Header -->). Ensure proper nesting and closing of tags. Use lowercase for tags and attributes.
                - **CSS**: Use 2-space indentation. Group related styles by component (e.g., /* Header Styles */). Use a single space after colons and before braces. Organize properties alphabetically within each rule. Include comments for media queries (e.g., /* Mobile Breakpoint: 768px */). Use shorthand properties where applicable (e.g., margin instead of margin-top, margin-right, etc.).
                - **JavaScript**: Use 2-space indentation. Include JSDoc comments for functions (e.g., /** @function init Initializes the page */). Use camelCase for variables and functions. Group related functions by component (e.g., // Header Functions). Ensure consistent use of single quotes for strings. Break long lines at 80 characters.
              - **File Organization**:
                - Within the JSON output, ensure each field (html, css, js) is minified only for transport but readable when viewed (e.g., proper line breaks and indentation in the generated code).
                - Include a comment at the top of each section indicating its purpose (e.g., /* Global CSS for responsive design */).
              - **Consistency**:
                - Use a consistent naming convention (e.g., BEM for CSS: .header__nav--active).
                - Ensure all class names and IDs match exactly across HTML, CSS, and JS to prevent mismatches.
                - Use relative units (rem, em, vw, vh) for responsive sizing and absolute units (px) only for fixed dimensions (e.g., borders).

              ### Code Validation Requirements:
              - **Syntax Validation**:
                - Validate HTML for proper syntax, closing tags, and no deprecated elements (e.g., <center> or <font>).
                - Validate CSS for correct syntax, supported properties, and no duplicate rules. Ensure media queries are properly formatted and target common breakpoints (320px, 375px, 768px, 1024px).
                - Validate JavaScript for syntax errors, unused variables, and adherence to ES6+ standards. Ensure no console errors or uncaught exceptions.
              - **Integration Validation**:
                - Verify that every HTML element with a class or ID has corresponding CSS styles and, if interactive, JavaScript event listeners.
                - Ensure no orphaned styles (CSS rules not applied to any HTML element) or scripts (JavaScript referencing non-existent elements).
                - Check that all interactive elements (e.g., buttons, forms, menus) have both CSS states (e.g., :hover, :focus, :active) and JavaScript functionality (e.g., onclick, onsubmit).
              - **Responsiveness Validation**:
                - Simulate rendering at common breakpoints (320px, 375px, 768px, 1024px) to ensure layouts stack correctly, text remains legible, and images scale appropriately.
                - Verify that touch targets (e.g., buttons, links) are at least 48px and have sufficient padding for mobile devices.
                - Ensure animations and transitions are performant (e.g., use transform and opacity for animations instead of top/left).
              - **Accessibility Validation**:
                - Check for semantic HTML (e.g., <nav>, <main>, <footer>) and ARIA roles (e.g., aria-label for icons).
                - Ensure keyboard navigation (e.g., tab order, focus states) and screen reader compatibility (e.g., alt text for images).
              - **Performance Validation**:
                - Verify that images are optimized (e.g., use WebP with fallback to JPEG) and lazy-loaded.
                - Ensure no excessive DOM manipulations or reflows in JavaScript.
                - Check that CSS animations use GPU-accelerated properties (e.g., transform, opacity).
              - **Output Validation**:
                - Before returning the JSON, simulate execution of the generated code to confirm:
                  - No runtime errors in JavaScript (e.g., null reference errors).
                  - All styles are applied as intended (e.g., no unstyled elements).
                  - Interactivity works (e.g., clicking a button triggers the expected behavior).
                  - Mobile layouts are functional and visually consistent.
                - If validation fails, include a note in the JSON output (e.g., "validation_errors": ["Missing event listener for .submit-button"]) and attempt to fix the issue before returning.

              Generate fully responsive, visually engaging, and interactive designs that are adaptable for diverse website types (corporate sites, e-commerce, blogs, portfolios, landing pages). Ensure every component is modular, well-documented, and rigorously validated for functionality, visual consistency, and error-free execution.

              **Important**: Return only the JSON object wrapped in \`\`\`json and \`\`\`, with no additional text, comments, or explanations before or after.
            `,
          },
          { role: 'user', content: prompt },
        ],
        stream: false,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Invalid response from API: No content found.');
    }

    console.log('🧹 Cleaning API response...');
    let cleanedResult = content.trim();

    // Remove ```json wrapper if present
    if (cleanedResult.startsWith('```json')) {
      cleanedResult = cleanedResult.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    }

    // Parse JSON
    const parseJsonAsync = async (data) => {
      console.log('📜 Parsing JSON...');
      try {
        const parsed = JSON.parse(data);
        console.log('🎉 JSON parsed successfully!');
        return parsed;
      } catch (error) {
        console.error('❌ JSON parsing failed:', error.message);
        throw new Error('Failed to parse API response as JSON.');
      }
    };

    let parsedResult;
    try {
      parsedResult = await parseJsonAsync(cleanedResult);
    } catch (parseError) {
      console.error('Failed to parse cleaned API response:', cleanedResult);
      throw parseError;
    }

    // Validate required fields
    if (!parsedResult.html || !parsedResult.css || !parsedResult.js || !parsedResult.components) {
      throw new Error('API response missing required fields (html, css, js, components).');
    }
    if (!parsedResult.html.trim() || !parsedResult.css.trim() || !parsedResult.js.trim()) {
      throw new Error('API response contains empty html, css, or js fields.');
    }
    if (!Array.isArray(parsedResult.components)) {
      throw new Error('Components field must be an array.');
    }

    return {
      data: {
        html: parsedResult.html,
        css: parsedResult.css,
        js: parsedResult.js,
        components: parsedResult.components,
      },
    };
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
    });
    if (error.message.includes('429')) {
      throw new Error('API quota exceeded. Try again later.');
    }
    // Return fallback content
    return {
      data: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Engineer Portfolio</title>
</head>
<body>
  <header class="header">
    <nav class="header__nav">
      <a href="#hero" class="header__nav-link">Home</a>
      <a href="#projects" class="header__nav-link">Projects</a>
      <a href="#contact" class="header__nav-link">Contact</a>
    </nav>
  </header>
  <section id="hero" class="hero">
    <h1>AI Engineer Portfolio</h1>
    <p>Specializing in Machine Learning</p>
    <a href="#contact" class="hero__cta">Get in Touch</a>
  </section>
  <section id="projects" class="projects">
    <h2>Projects</h2>
    <div class="projects__grid">
      <div class="projects__card">Project 1: Neural Network</div>
      <div class="projects__card">Project 2: NLP Model</div>
    </div>
  </section>
  <section id="contact" class="contact">
    <h2>Contact Me</h2>
    <form class="contact__form">
      <input type="text" class="contact__input" placeholder="Name" required>
      <input type="email" class="contact__input" placeholder="Email" required>
      <textarea class="contact__input" placeholder="Message" required></textarea>
      <button type="submit" class="contact__submit">Send</button>
    </form>
  </section>
  <footer class="footer">
    <p>© 2025 AI Engineer</p>
  </footer>
</body>
</html>`,
        css: `:root {
  --primary-color: #007bff;
  --background-color: #f4f4f4;
}
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: var(--background-color);
}
.header {
  background: var(--primary-color);
  padding: 1rem;
  position: sticky;
  top: 0;
}
.header__nav {
  display: flex;
  gap: 1rem;
}
.header__nav-link {
  color: white;
  text-decoration: none;
}
.hero {
  background: linear-gradient(135deg, var(--primary-color), #00d4ff);
  color: white;
  text-align: center;
  padding: 2rem;
}
.hero__cta {
  background: white;
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 4px;
}
.projects {
  padding: 2rem;
}
.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
.projects__card {
  background: white;
  padding: 1rem;
  border-radius: 4px;
}
.contact {
  padding: 2rem;
  background: white;
}
.contact__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}
.contact__input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.contact__submit {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
}
.footer {
  text-align: center;
  padding: 1rem;
  background: var(--primary-color);
  color: white;
}
@media (max-width: 768px) {
  .header__nav {
    flex-direction: column;
  }
  .projects__grid {
    grid-template-columns: 1fr;
  }
}`,
        js: `document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact__form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('input[placeholder="Name"]').value;
      const email = form.querySelector('input[placeholder="Email"]').value;
      const message = form.querySelector('textarea').value;
      if (name && email && message) {
        alert('Form submitted successfully!');
        form.reset();
      } else {
        alert('Please fill out all fields.');
      }
    });
  } else {
    console.error('Form .contact__form not found');
  }
});`,
        components: ['Header', 'Hero', 'Projects', 'ContactForm', 'Footer'],
      },
    };
  }
};

// Create readline interface for real-time prompt input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Prompts the user for input and generates code based on the prompt.
 */
const promptUser = () => {
  rl.question('Enter your prompt (or type "exit" to quit): ', async (prompt) => {
    if (prompt.toLowerCase() === 'exit') {
      console.log('👋 Exiting...');
      rl.close();
      return;
    }

    try {
      console.log('🚀 Generating code...');
      const result = await generateCode(prompt);
      console.log('✅ Generated Portfolio Code:');
      console.log('HTML:\n', result.data.html);
      console.log('CSS:\n', result.data.css);
      console.log('JS:\n', result.data.js);
      console.log('Components:', result.data.components);
    } catch (err) {
      console.error('❌ Error:', err.message);
    }

    promptUser();
  });
};

// Start the prompt loop
console.log('Welcome to Portfolio Code Generator CLI');
console.log(`Using ${USE_LOCAL_MODEL ? 'Local Ollama (deepseek-r1:7b)' : 'OpenRouter API'}`);
promptUser();
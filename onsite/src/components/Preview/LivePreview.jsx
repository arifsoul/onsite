import { useState, useEffect, useCallback, useRef } from 'react';
import { useCode } from '../../context/CodeContext';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { ViewPlugin } from '@codemirror/view';
import './LivePreview.css';

// Initial content with elegant dark theme and interactive animations
const initialHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Onsite AI Frontend Generator</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gradient-to-r from-gray-800 to-gray-900">
    <section class="hero min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div class="hero-content text-center">
        <h1 class="hero-title text-4xl md:text-5xl font-bold text-blue-400 mb-4">Craft the Future with AI</h1>
        <p class="hero-subtitle text-lg md:text-xl text-gray-300 mb-6">Transform ideas into seamless code</p>
        <button class="hero-cta bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-transform duration-300">Get Started</button>
      </div>
    </section>
  </body>
</html>
`.trim();

const initialCss = `
:root {
  --primary: #5b9aff;
  --background: #121212;
  --text: #e0e0e0;
  --accent: #bb86fc;
  --card-bg: #1e1e1e;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, sans-serif;
  background: var(--background);
  color: var(--text);
  overflow-x: hidden;
}

.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #121212 0%, #1e1e1e 100%);
  padding: 2rem;
}

.hero-content {
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s ease-out forwards;
  transition: transform 0.5s ease;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  color: var(--primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin: 1rem 0;
  color: var(--text);
  opacity: 0.8;
}

.hero-cta {
  background: var(--accent);
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: #fff;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hero-cta:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(187, 134, 252, 0.4);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  .hero-subtitle {
    font-size: 1rem;
  }
}
`.trim();

const initialJs = `
/** @function init Initializes the page */
document.addEventListener('DOMContentLoaded', () => {
  try {
    const ctaButton = document.querySelector('.hero-cta');
    if (ctaButton) {
      console.log('CTA button found, attaching click listener');
      ctaButton.addEventListener('click', () => {
        console.log('CTA button clicked');
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
          heroContent.style.transition = 'transform 0.5s ease';
          heroContent.style.transform = 'scale(1.1)';
          setTimeout(() => {
            heroContent.style.transform = 'scale(1)';
          }, 300);
        } else {
          console.error('Hero content not found');
        }
      });
    } else {
      console.error('CTA button not found');
    }
  } catch (error) {
    console.error('Error in iframe JavaScript:', error);
  }
});
`.trim();

// Elegant text-only reasoning header
const reasoningAsciiArt = `
..:: AI Reason ::..
`.trim();

// Function to decode escaped text robustly
const decodeEscapedText = (text) => {
  if (!text) return text;
  let decoded = text;
  const maxIterations = 5;
  for (let i = 0; i < maxIterations; i++) {
    const next = decoded
      .replace(/\\n/g, '\n') // Handle newlines
      .replace(/\\"/g, '"')  // Handle escaped quotes
      .replace(/\\\\/g, '\\') // Handle escaped backslashes
      .replace(/\\#/g, '#'); // Handle escaped hash for selectors
    if (next === decoded) break;
    decoded = next;
  }
  // Additional cleanup for CSS selectors
  decoded = decoded.replace(/"([^"]*?)\\"/g, '"$1"'); // Remove stray escaped quotes
  return decoded;
};

// CodeMirror auto-scroll plugin
const autoScrollPlugin = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.view = view;
    }

    update(update) {
      if (update.docChanged) {
        const editor = this.view.dom;
        editor.scrollTop = editor.scrollHeight;
      }
    }
  }
);

const LivePreview = () => {
  const { generatedCode, setGeneratedCode } = useCode();
  const [activeCodeTab, setActiveCodeTab] = useState('html');
  const [isCodeVisible, setIsCodeVisible] = useState(true);
  const [localCode, setLocalCode] = useState({
    html: initialHtml,
    css: initialCss,
    js: initialJs,
    reasoning: '',
  });
  const reasoningRef = useRef(null);
  const prevCodeRef = useRef();

  useEffect(() => {
    if (reasoningRef.current) {
      reasoningRef.current.scrollTop = reasoningRef.current.scrollHeight;
    }
  }, [localCode.reasoning]);

  // Sync localCode with generatedCode and switch tabs
  useEffect(() => {
    const { html, css, js, reasoning } = generatedCode;
    const prevCode = prevCodeRef.current;
    
    // Check if generatedCode has meaningful content
    const hasGeneratedContent = html || css || js || reasoning;

    if (hasGeneratedContent && prevCode) {
        // Determine which tab to activate by comparing current vs previous code
        if (html && html !== prevCode.html) {
            setActiveCodeTab('html');
        } else if (css && css !== prevCode.css) {
            setActiveCodeTab('css');
        } else if (js && js !== prevCode.js) {
            setActiveCodeTab('js');
        }
    }

    // Update the local state for rendering in the iframe and editors
    // Only update if there is new content from the generator
    if(hasGeneratedContent) {
        setLocalCode({
            html: html || initialHtml,
            css: css || initialCss,
            js: js || initialJs,
            reasoning: reasoning || '',
        });
    }

    // Update the ref for the next comparison
    prevCodeRef.current = generatedCode;
  }, [generatedCode]);
  
  // Debounce function to limit state updates
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Handler for code changes from manual editing
  const handleCodeChange = useCallback(
    debounce((field, value) => {
      // When user edits manually, update the shared state
      setGeneratedCode((prev) => ({ ...prev, [field]: value }));
    }, 300),
    [setGeneratedCode]
  );

  const updateCode = (field) => (value) => {
    setLocalCode((prev) => ({ ...prev, [field]: value }));
    handleCodeChange(field, value);
  };

  // Function to copy code to clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      alert('Content copied to clipboard!');
    });
  };

  // Toggle code visibility
  const toggleCodeVisibility = () => {
    setIsCodeVisible((prev) => !prev);
  };

  // Combine code for iframe display
  const iframeCode = `
    <html>
      <head>
        <style>${localCode.css}</style>
         <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        ${localCode.html}
        <script>${localCode.js}</script>
      </body>
    </html>
  `.trim();

  const hasContent = localCode.html.trim() || localCode.css.trim() || localCode.js.trim();

  // Select language for CodeMirror based on active tab
  const getEditorLanguage = () => {
    switch (activeCodeTab) {
      case 'html':
        return html();
      case 'css':
        return css();
      case 'js':
        return javascript();
      default:
        return html();
    }
  };

  return (
    <div className="preview-container">
      <div className="preview-tabs">
        <button
          className={isCodeVisible ? 'active' : ''}
          onClick={toggleCodeVisibility}
          title={isCodeVisible ? 'Hide Code' : 'Show Code'}
        >
          <i className={isCodeVisible ? 'fa-regular fa-window-minimize' : 'fa-sharp fa-solid fa-code'}></i>
        </button>
      </div>

      <div className={`preview-iframe-container ${hasContent ? 'expanded' : 'collapsed'}`}>
        <iframe
          className="preview-iframe"
          srcDoc={iframeCode}
          title="Live Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      <div className="code-preview" style={{ display: isCodeVisible ? 'block' : 'none' }}>
        <div className="code-tabs">
          {[
            { lang: 'html', icon: 'fab fa-html5' },
            { lang: 'css', icon: 'fab fa-css3-alt' },
            { lang: 'js', icon: 'fab fa-js' },
          ].map(({ lang, icon }) => (
            <button
              key={lang}
              className={activeCodeTab === lang ? 'active' : ''}
              onClick={() => setActiveCodeTab(lang)}
              title={lang.toUpperCase()}
            >
              <i className={icon}></i>
            </button>
          ))}
        </div>
        <div className="code-content">
          <div className="code-header">
            <button
              className="copy-button"
              onClick={() => copyToClipboard(localCode[activeCodeTab])}
              title={`Copy ${activeCodeTab.toUpperCase()}`}
            >
              <i className="fas fa-copy"></i>
            </button>
          </div>
          <CodeMirror
            value={localCode[activeCodeTab]}
            height="300px"
            extensions={[getEditorLanguage(), autoScrollPlugin]}
            onChange={(value) => updateCode(activeCodeTab)(value)}
            theme="dark"
          />
        </div>
      </div>

      <div className="reasoning-container">
        <h3>Reasoning</h3>
        <div className="reasoning-content">
          {localCode.reasoning ? (
            <pre className={`reasoning-text ${localCode.reasoning.includes('Error') ? 'error' : ''}`} ref={reasoningRef}>
              {reasoningAsciiArt + '\n\n' + localCode.reasoning}
            </pre>
          ) : (
            <pre className="reasoning-initial" ref={reasoningRef}>
              {reasoningAsciiArt + '\n\nNo reasoning available yet.'}
            </pre>
          )}
          {localCode.reasoning && (
            <button
              className="copy-button"
              onClick={() => copyToClipboard(localCode.reasoning)}
              title="Copy Reasoning"
            >
              <i className="fas fa-copy"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
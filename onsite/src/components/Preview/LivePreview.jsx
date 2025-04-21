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
    <!-- Hero Section -->
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

  // Auto-scroll to bottom of reasoning container
  useEffect(() => {
    if (reasoningRef.current) {
      reasoningRef.current.scrollTop = reasoningRef.current.scrollHeight;
    }
  }, [localCode.reasoning]);

  // Sync localCode with generatedCode and process AI response
  useEffect(() => {
    if (!generatedCode) return;

    // Helper to check if code has changed
    const hasCodeChanged = (newCode, currentCode) =>
      JSON.stringify(newCode) !== JSON.stringify(currentCode);

    let newLocalCode = { ...localCode };
    let displayReasoning = generatedCode.reasoning || '';
    // Remove ANSI escape codes and decode text
    displayReasoning = decodeEscapedText(displayReasoning.replace(/\x1B\[[0-9;]*m/g, '').trim());

    // Log AI-generated content
    console.group('AI-Generated Update');
    if (generatedCode.html) console.log('Generated HTML:', generatedCode.html);
    if (generatedCode.css) console.log('Generated CSS:', generatedCode.css);
    if (generatedCode.js) console.log('Generated JS:', generatedCode.js);
    if (generatedCode.reasoning) console.log('Raw Reasoning:', displayReasoning);
    console.groupEnd();

    // Detect ```json block
    const jsonBlockRegex = /```json\n([\s\S]*?)(?:\n```|$)/;
    const jsonMatch = generatedCode.reasoning && generatedCode.reasoning.match(jsonBlockRegex);
    if (jsonMatch) {
      setIsCodeVisible(true);
      const jsonContentRaw = jsonMatch[1].trim();
      console.log('Detected JSON block:', jsonContentRaw);

      // Extract reasoning text outside JSON block
      displayReasoning = decodeEscapedText(
        generatedCode.reasoning
          .replace(jsonBlockRegex, '')
          .replace(/\x1B\[[0-9;]*m/g, '')
          .replace(/<\/?think>/g, '')
          .trim()
      );
      newLocalCode.reasoning = displayReasoning;

      // Extract generated-html, generated-css, generated-js
      let updatedTab = null;
      const htmlMatch = jsonContentRaw.match(/"generated-html":\s*"(.*?)"(?=\s*(?:,|\n|}$))/s);
      if (htmlMatch && htmlMatch[1].trim()) {
        newLocalCode.html = decodeEscapedText(htmlMatch[1]);
        updatedTab = 'html';
        console.log('Writing HTML to CodeMirror:', newLocalCode.html);
      }

      const cssMatch = jsonContentRaw.match(/"generated-css":\s*"(.*?)"(?=\s*(?:,|\n|}$))/s);
      if (cssMatch && cssMatch[1].trim()) {
        newLocalCode.css = decodeEscapedText(cssMatch[1]);
        updatedTab = 'css';
        console.log('Writing CSS to CodeMirror:', newLocalCode.css);
      }

      const jsMatch = jsonContentRaw.match(/"generated-js":\s*"(.*?)"(?=\s*(?:,|\n|}$))/s);
      if (jsMatch && jsMatch[1].trim()) {
        newLocalCode.js = decodeEscapedText(jsMatch[1]);
        updatedTab = 'js';
        console.log('Writing JS to CodeMirror:', newLocalCode.js);
      }

      if (updatedTab) {
        setActiveCodeTab(updatedTab);
      } else {
        console.warn('No valid code found in JSON block');
      }
    } else if (generatedCode.html && generatedCode.html !== localCode.html) {
      newLocalCode.html = decodeEscapedText(generatedCode.html);
      setIsCodeVisible(true);
      setActiveCodeTab('html');
      console.log('Writing HTML to CodeMirror:', newLocalCode.html);
    } else if (generatedCode.css && generatedCode.css !== localCode.css) {
      newLocalCode.css = decodeEscapedText(generatedCode.css);
      setIsCodeVisible(true);
      setActiveCodeTab('css');
      console.log('Writing CSS to CodeMirror:', newLocalCode.css);
    } else if (generatedCode.js && generatedCode.js !== localCode.js) {
      newLocalCode.js = decodeEscapedText(generatedCode.js);
      setIsCodeVisible(true);
      setActiveCodeTab('js');
      console.log('Writing JS to CodeMirror:', newLocalCode.js);
    } else if (generatedCode.reasoning && displayReasoning !== localCode.reasoning) {
      newLocalCode.reasoning = displayReasoning;
      setIsCodeVisible(false);
      console.log('Updated Reasoning:', newLocalCode.reasoning);
    } else if (!generatedCode.reasoning && localCode.reasoning) {
      newLocalCode.reasoning = '';
      setIsCodeVisible(true);
      console.log('Cleared Reasoning');
    }

    // Update state if there are changes
    if (hasCodeChanged(newLocalCode, localCode)) {
      setLocalCode(newLocalCode);
      setGeneratedCode((prev) => ({ ...prev, ...newLocalCode }));
    }
  }, [generatedCode, localCode, setGeneratedCode]);

  // Debounce function to limit state updates
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Handler for code changes
  const handleCodeChange = useCallback(
    debounce((field, value) => {
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
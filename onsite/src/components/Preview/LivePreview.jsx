import { useState, useEffect, useCallback, useRef } from 'react';
import { useCode } from '../../context/CodeContext';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import './LivePreview.css';

// Initial content with elegant dark theme and interactive animations
const initialHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Onsite AI Frontend Generator</title>
</head>
<body>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">Craft the Future with AI</h1>
      <p class="hero-subtitle">Transform ideas into seamless code</p>
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
document.addEventListener('DOMContentLoaded', () => {
  const ctaButton = document.querySelector('.hero-cta');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      const heroContent = document.querySelector('.hero-content');
      heroContent.style.transition = 'transform 0.5s ease';
      heroContent.style.transform = 'scale(1.1)';
      setTimeout(() => {
        heroContent.style.transform = 'scale(1)';
      }, 300);
    });
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

  // Sync localCode with generatedCode and handle streaming updates
  useEffect(() => {
    if (!generatedCode) return;

    // Helper to check if code has changed
    const hasCodeChanged = (newCode, currentCode) =>
      JSON.stringify(newCode) !== JSON.stringify(currentCode);

    let newLocalCode = { ...localCode };
    let displayReasoning = generatedCode.reasoning || '';
    // Remove ANSI escape codes and decode text
    displayReasoning = decodeEscapedText(displayReasoning.replace(/\x1B\[[0-9;]*m/g, '').trim());

    const jsonStartIndex = generatedCode.reasoning ? generatedCode.reasoning.indexOf('```json') : -1;
    if (jsonStartIndex !== -1) {
      setIsCodeVisible(true);
      try {
        const jsonContentRaw = generatedCode.reasoning.slice(jsonStartIndex + 7).trim();
        // Extract reasoning text before JSON
        displayReasoning = decodeEscapedText(
          generatedCode.reasoning
            .slice(0, jsonStartIndex)
            .replace(/\x1B$$ [0-9;]*m/g, '')
            .replace(/<\/?think>/g, '')
            .trim()
        );
        newLocalCode.reasoning = displayReasoning;

        // Clean JSON content
        const cleanedJson = decodeEscapedText(
          jsonContentRaw
            .replace(/\x1B\[[0-9;]*m/g, '')
            .replace(/,\s*}$/, '}')
            .replace(/,\s* $$/, ']')
        );

        let jsonContent;
        try {
          jsonContent = JSON.parse(cleanedJson);
        } catch (e) {
          try {
            jsonContent = JSON.parse(`{${cleanedJson}}`);
          } catch (e2) {
            const partialJson = {};
            const keyValueMatches = cleanedJson.match(/"([^"]+)":\s*"(.*?)(?:"(?:,|\n|$)|$)/g) || [];
            keyValueMatches.forEach((match) => {
              const [, key, value] = match.match(/"([^"]+)":\s*"(.*?)(?:"(?:,|\n|$)|$)/);
              partialJson[key] = decodeEscapedText(value);
            });
            jsonContent = partialJson;
          }
        }

        if (jsonContent['generated-html'] && jsonContent['generated-html'] !== localCode.html) {
          newLocalCode.html = decodeEscapedText(jsonContent['generated-html']);
          setActiveCodeTab('html');
        }
        if (jsonContent['generated-css'] && jsonContent['generated-css'] !== localCode.css) {
          newLocalCode.css = decodeEscapedText(jsonContent['generated-css']);
          setActiveCodeTab('css');
        }
        if (jsonContent['generated-js'] && jsonContent['generated-js'] !== localCode.js) {
          newLocalCode.js = decodeEscapedText(jsonContent['generated-js']);
          setActiveCodeTab('js');
        }
      } catch (e) {
        console.error('Error processing JSON in reasoning:', e);
        newLocalCode.reasoning = displayReasoning;
      }
    } else if (generatedCode.html && generatedCode.html !== localCode.html) {
      newLocalCode.html = decodeEscapedText(generatedCode.html);
      setIsCodeVisible(true);
      setActiveCodeTab('html');
    } else if (generatedCode.css && generatedCode.css !== localCode.css) {
      newLocalCode.css = decodeEscapedText(generatedCode.css);
      setIsCodeVisible(true);
      setActiveCodeTab('css');
    } else if (generatedCode.js && generatedCode.js !== localCode.js) {
      newLocalCode.js = decodeEscapedText(generatedCode.js);
      setIsCodeVisible(true);
      setActiveCodeTab('js');
    } else if (generatedCode.reasoning && displayReasoning !== localCode.reasoning) {
      newLocalCode.reasoning = displayReasoning;
      setIsCodeVisible(false);
    } else if (!generatedCode.reasoning && localCode.reasoning) {
      newLocalCode.reasoning = '';
      setIsCodeVisible(true);
    }

    // Only update state if there are changes
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
          sandbox="allow-scripts"
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
            extensions={[getEditorLanguage()]}
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
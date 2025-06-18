import { useState, useContext, useRef } from 'react';
import { CodeContext } from '../../context/CodeContext';
import { generateCode } from '../../services/generatorAPI.js';
import './AIGenerator.css';

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setGeneratedCode, setComponents, setPromptHistory } = useContext(CodeContext);
  const abortControllerRef = useRef(null);

  // Validate and fix generated code
  const validateAndFixCode = (html, css, js) => {
    try {
      // Validate HTML structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Check for basic HTML structure
      if (!doc.documentElement || !doc.head || !doc.body) {
        throw new Error('Invalid HTML structure - missing required elements');
      }

      // Extract all CSS classes from HTML safely
      const htmlClasses = Array.from(doc.querySelectorAll('[class]'))
        .filter((el) => typeof el.className === 'string')
        .flatMap((el) => el.className.split(' ').filter((c) => c.trim()));

      // Extract CSS classes from styles
      const cssClasses = [];
      const cssRegex = /\.([a-zA-Z0-9_-]+)\s*{/g;
      let cssMatch;
      while ((cssMatch = cssRegex.exec(css)) !== null) {
        cssClasses.push(cssMatch[1]);
      }

      // Find unused CSS classes
      const unusedClasses = cssClasses.filter((c) => !htmlClasses.includes(c));
      if (unusedClasses.length > 0 && process.env.NODE_ENV === 'development') {
        console.warn('Unused CSS classes:', unusedClasses);
        // Remove unused classes
        let fixedCss = css;
        unusedClasses.forEach((cls) => {
          const classRegex = new RegExp(`\\.${cls}\\s*{[^}]*}`, 'g');
          fixedCss = fixedCss.replace(classRegex, '');
        });
        css = fixedCss;
      }

      // Extract JS selectors and validate against HTML
      const selectorRegex = /document\.querySelector(All)?\s*\(['"](.+?)['"]\)/g;
      const selectors = [];
      let fixedJs = js;
      let jsMatch;
      while ((jsMatch = selectorRegex.exec(js)) !== null) {
        let selector = jsMatch[2];
        // Fix escaped quotes and hash in selectors
        selector = selector.replace(/\\"/g, '"').replace(/\\#/g, '#');
        selectors.push(selector);
        // Replace invalid selector in JS
        fixedJs = fixedJs.replace(jsMatch[2], selector);
      }

      const missingSelectors = selectors.filter((selector) => {
        try {
          doc.querySelector(selector);
          return false;
        } catch (e) {
          console.warn(`Invalid selector: ${selector}`);
          return true;
        }
      });

      if (missingSelectors.length > 0) {
        console.warn('Missing or invalid selectors in HTML:', missingSelectors);
        setError(`Warning: JavaScript references invalid/missing elements: ${missingSelectors.join(', ')}`);
      }

      // Generate safe JS with error handling
      const safeJs = `
        document.addEventListener('DOMContentLoaded', () => {
          try {
            ${selectors.length > 0 ? selectors.map((selector) => `
              const ${selector.replace(/[^a-zA-Z0-9]/g, '_')}El = document.querySelector('${selector}');
              if (!${selector.replace(/[^a-zA-Z0-9]/g, '_')}El) {
                console.error('Element not found: ${selector}');
                return;
              }
            `).join('\n') : '// No selectors to validate'}
            ${fixedJs.trim() || '// No JavaScript provided'}
          } catch (error) {
            console.error('Runtime error:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'runtime-error';
            errorDiv.textContent = 'Error in interactive features: ' + error.message;
            document.body.prepend(errorDiv);
          }
        });
      `;

      return { html, css, js: safeJs };
    } catch (err) {
      console.error('Error validating/fixing code:', err);
      setError(`Validation error: ${err.message}`);
      return {
        html,
        css,
        js: `
          document.addEventListener('DOMContentLoaded', () => {
            console.error('JavaScript validation failed: ${err.message}');
          });
        `,
      };
    }
  };

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }

    setPromptHistory((prev) => [...prev, { sender: 'user', message: prompt.trim() }]);
    setPrompt('');
    setIsLoading(true);
    setError(null);
    setGeneratedCode({ html: '', css: '', js: '', reasoning: '' });
    setComponents([]);
    abortControllerRef.current = new AbortController();

    let accumulatedData = { html: '', css: '', js: '', reasoning: '', components: [] };
    let fullResponseText = '';

    const handleStreamChunk = (chunk) => {
        fullResponseText += chunk;

        const cleanText = (text) => text.replace(/\x1B\[[0-9;]*m/g, '');

        // Extract reasoning (text before ```json)
        const reasoningMatch = fullResponseText.match(/([\s\S]*?)```json/);
        accumulatedData.reasoning = reasoningMatch ? cleanText(reasoningMatch[1]) : cleanText(fullResponseText);

        const jsonBlockMatch = fullResponseText.match(/```json([\s\S]*)/);
        if (jsonBlockMatch && jsonBlockMatch[1]) {
            let jsonStr = jsonBlockMatch[1];
            // Clean up end of block if it exists
            if (jsonStr.includes('```')) {
                jsonStr = jsonStr.split('```')[0];
            }

            const decode = (text) => text ? text.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\') : '';
            
            // Use regex on the growing buffer to get the latest code
            const htmlMatch = jsonStr.match(/"generated-html"\s*:\s*"((?:\\.|[^"\\])*)/);
            accumulatedData.html = decode(htmlMatch ? htmlMatch[1] : '');

            const cssMatch = jsonStr.match(/"generated-css"\s*:\s*"((?:\\.|[^"\\])*)/);
            accumulatedData.css = decode(cssMatch ? cssMatch[1] : '');

            const jsMatch = jsonStr.match(/"generated-js"\s*:\s*"((?:\\.|[^"\\])*)/);
            accumulatedData.js = decode(jsMatch ? jsMatch[1] : '');
        }

        setGeneratedCode({ ...accumulatedData });
    };

    try {
      await generateCode(
        `${prompt}\n\nEnsure all CSS classes are used in the HTML and match exactly. Avoid generating unused styles. Do not include external script tags like Tailwind CDN or script.js.`,
        true,
        false,
        handleStreamChunk,
        abortControllerRef.current.signal
      );

      // Final processing after stream ends
      const jsonMatch = fullResponseText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
            const parsedJson = JSON.parse(jsonMatch[1]);
            const { 'generated-html': html = '', 'generated-css': css = '', 'generated-js': js = '' } = parsedJson;
            const { html: fixedHtml, css: fixedCss, js: safeJs } = validateAndFixCode(html, css, js);
            
            accumulatedData.html = fixedHtml;
            accumulatedData.css = fixedCss;
            accumulatedData.js = safeJs;

        } catch (error) {
             console.error('Final JSON parsing error:', error);
             setError("Failed to parse the final code from AI. Using regex-extracted code as fallback.");
        }
      }
      
      setGeneratedCode({ ...accumulatedData });
      if (accumulatedData.reasoning.trim()) {
        setPromptHistory((prev) => [...prev, { sender: 'ai', message: accumulatedData.reasoning.trim() }]);
      }

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request aborted by user.');
            setError('Code generation stopped.');
            accumulatedData.reasoning += '\nGeneration stopped by user.';
        } else {
            console.error('Code Generation Error:', error);
            setError(`Failed to generate code: ${error.message}.`);
            accumulatedData.reasoning += `\nError: ${error.message}`;
        }
        setGeneratedCode({ ...accumulatedData });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };
  
  const debouncedGenerate = debounce(handleGenerate, 500);

  const handleInterrupt = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      debouncedGenerate(e);
    }
  };

  return (
    <div className="ai-generator">
      <div className="prompt-container">
        <div className="input-wrapper">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the component you want to create (e.g., 'A responsive navbar with a hamburger menu. Ensure CSS classes match HTML elements exactly.')"
            className="prompt-input"
            disabled={isLoading}
          />
          <button
            onClick={isLoading ? handleInterrupt : debouncedGenerate}
            disabled={isLoading && !abortControllerRef.current}
            className="send-button"
            aria-label={isLoading ? 'Stop generation' : 'Generate component'}
          >
            {isLoading ? (
              <svg className="stop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="4" y="4" width="16" height="16" strokeWidth="2" />
              </svg>
            ) : (
              <svg className="paper-plane" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AIGenerator;
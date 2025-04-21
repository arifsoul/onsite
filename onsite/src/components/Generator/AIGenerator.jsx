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

    // Append prompt to history
    setPromptHistory((prev) => [...prev, { sender: 'user', message: prompt.trim() }]);
    setPrompt('');
    setIsLoading(true);
    setError(null);
    setGeneratedCode({ html: '', css: '', js: '', reasoning: '' });
    setComponents([]);

    let accumulatedData = { html: '', css: '', js: '', reasoning: '', components: [] };
    let currentField = null;
    let jsonBuffer = '';
    let isJsonMode = false;

    const handleStreamChunk = (chunk) => {
      try {
        // Check for JSON start
        if (!isJsonMode && chunk.includes('```json')) {
          isJsonMode = true;
          const jsonStartIndex = chunk.indexOf('```json');
          if (jsonStartIndex > 0) {
            accumulatedData.reasoning += chunk.slice(0, jsonStartIndex).replace(/\x1B\[[0-9;]*m/g, '');
          }
          jsonBuffer = chunk.slice(jsonStartIndex + 7);
          setGeneratedCode({ ...accumulatedData });
          return;
        }

        if (isJsonMode) {
          jsonBuffer += chunk;
          const cleanedJson = jsonBuffer
            .replace(/\x1B\[[0-9;]*m/g, '')
            .replace(/,\s*}$/, '}')
            .replace(/,\s*\]/, ']');

          let parsedChunk;
          try {
            parsedChunk = JSON.parse(cleanedJson);
          } catch {
            try {
              parsedChunk = JSON.parse(`{${cleanedJson}}`);
            } catch {
              parsedChunk = {};
              const keyValueMatches = cleanedJson.match(/"([^"]+)":\s*"(.*?)(?:"(?:,|\n|$)|$)/g) || [];
              keyValueMatches.forEach((match) => {
                const [, key, value] = match.match(/"([^"]+)":\s*"(.*?)(?:"(?:,|\n|$)|$)/);
                parsedChunk[key] = value;
              });
            }
          }

          if (parsedChunk['generated-html']) {
            currentField = 'html';
            accumulatedData.html = parsedChunk['generated-html'];
          }
          if (parsedChunk['generated-css']) {
            currentField = 'css';
            accumulatedData.css = parsedChunk['generated-css'];
          }
          if (parsedChunk['generated-js']) {
            currentField = 'js';
            accumulatedData.js = parsedChunk['generated-js'];
          }
          if (parsedChunk.components) {
            accumulatedData.components = parsedChunk.components;
          }
          if (parsedChunk.reasoning) {
            accumulatedData.reasoning += parsedChunk.reasoning;
          }
        } else {
          if (currentField) {
            accumulatedData[currentField] += chunk.replace(/\x1B\[[0-9;]*m/g, '');
          } else {
            accumulatedData.reasoning += chunk.replace(/\x1B\[[0-9;]*m/g, '');
          }
        }

        setGeneratedCode({ ...accumulatedData });
      } catch (error) {
        console.error('Error processing stream chunk:', error);
        accumulatedData.reasoning += `\nError processing chunk: ${error.message}`;
        setGeneratedCode({ ...accumulatedData });
      }
    };

    try {
      const maxRetries = 3;
      let response;
      abortControllerRef.current = new AbortController();
      for (let i = 0; i < maxRetries; i++) {
        try {
          response = await generateCode(
            `${prompt}\n\nEnsure all CSS classes are used in the HTML and match exactly. Avoid generating unused styles. Do not include external script tags like Tailwind CDN or script.js.`,
            true,
            false,
            handleStreamChunk,
            abortControllerRef.current.signal
          );
          break;
        } catch (error) {
          if (error.name === 'AbortError') {
            console.log('Request aborted by user.');
            setError('Code generation stopped.');
            accumulatedData.reasoning += '\nGeneration stopped by user.';
            setGeneratedCode({ ...accumulatedData });
            setComponents(accumulatedData.components);
            setIsLoading(false);
            abortControllerRef.current = null;
            return;
          }
          if (i === maxRetries - 1) throw error;
          console.warn(`Retry ${i + 1}/${maxRetries} due to error: ${error.message}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      try {
        const { html = '', css = '', js = '', components = [], reasoning = '' } = accumulatedData;

        if (!html && !css && !js) {
          throw new Error('Invalid response from API - no code fields generated');
        }

        const { html: fixedHtml, css: fixedCss, js: safeJs } = validateAndFixCode(html, css, js);

        setGeneratedCode({
          html: fixedHtml.replace(/<\/?template[^>]*>/g, ''),
          css: fixedCss.replace(/\/\*.*?\*\//g, ''),
          js: safeJs,
          reasoning,
        });
        setComponents(components);
        if (reasoning.trim()) {
          setPromptHistory((prev) => [...prev, { sender: 'ai', message: reasoning.trim() }]);
        }
      } catch (error) {
        console.error('Processing Error:', error);
        setGeneratedCode({
          html: accumulatedData.html || '<div class="error">Error generating code. Partial results preserved.</div>',
          css: accumulatedData.css || '.error { color: red; padding: 20px; text-align: center; }',
          js: accumulatedData.js || 'console.error("Code generation failed");',
          reasoning: accumulatedData.reasoning || '',
        });
        setComponents(accumulatedData.components);
        setError(`Failed to process generated code: ${error.message}. Try simplifying your prompt.`);
        setPromptHistory((prev) => [...prev, { sender: 'ai', message: accumulatedData.reasoning || error.message }]);
      }
    } catch (error) {
      console.error('Code Generation Error:', error);
      setGeneratedCode({
        html: accumulatedData.html || '<div class="error">Error generating code. Partial results preserved.</div>',
        css: accumulatedData.css || '.error { color: red; padding: 20px; text-align: center; }',
        js: accumulatedData.js || 'console.error("Code generation failed");',
        reasoning: accumulatedData.reasoning || '',
      });
      setComponents(accumulatedData.components);
      setError(`Failed to generate code: ${error.message}. Check your network connection or simplify your prompt.`);
      setPromptHistory((prev) => [...prev, { sender: 'ai', message: accumulatedData.reasoning || error.message }]);
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
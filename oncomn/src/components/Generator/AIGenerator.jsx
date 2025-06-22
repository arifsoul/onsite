import React, { useState, useRef, useCallback } from 'react';
import { useCode } from '../../context/CodeContext';
import { generateCode } from '../../services/generatorAPI.js';
import './AIGenerator.css';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const AIGenerator = () => {
  // Use generatedCode.prompt as the source of truth for the input field
  const { generatedCode, setGeneratedCode, isLoading, setIsLoading } = useCode();
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const debouncedUpdateCode = useCallback(
    debounce((updater) => setGeneratedCode(updater), 50),
    [setGeneratedCode]
  );

  const handlePromptChange = (e) => {
    const newPrompt = e.target.value;
    // Update the prompt in the central state so it can be auto-saved
    setGeneratedCode(prev => ({...prev, prompt: newPrompt}));
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    const currentPrompt = generatedCode.prompt;
    if (!currentPrompt || !currentPrompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedCode(prev => ({ ...prev, html: '', css: '', js: '', reasoning: '⏳ Starting generation...' }));
    
    abortControllerRef.current = new AbortController();
    
    let fullResponseText = '';
    let jsonBuffer = '';
    let inJsonBlock = false;

    try {
      await generateCode(
        currentPrompt, true, false,
        (chunk) => {
          if (abortControllerRef.current?.signal.aborted) return;
          fullResponseText += chunk;
          if (!inJsonBlock) {
            const jsonStartIndex = fullResponseText.indexOf('```json');
            if (jsonStartIndex !== -1) {
              inJsonBlock = true;
              const reasoningPart = fullResponseText.substring(0, jsonStartIndex);
              jsonBuffer = fullResponseText.substring(jsonStartIndex + 7);
              setGeneratedCode(prev => ({ ...prev, reasoning: reasoningPart.replace(/\x1B\[[0-9;]*m/g, '') }));
            } else {
              setGeneratedCode(prev => ({ ...prev, reasoning: fullResponseText.replace(/\x1B\[[0-9;]*m/g, '') }));
            }
          } else {
            jsonBuffer += chunk;
          }
          if (inJsonBlock) {
            const cleanJsonBuffer = jsonBuffer.replace(/```$/, '').trim();
            const extractValue = (key) => {
              const regex = new RegExp(`"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`);
              const match = cleanJsonBuffer.match(regex);
              return match ? match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t') : null;
            };
            const html = extractValue('generated-html');
            const css = extractValue('generated-css');
            const js = extractValue('generated-js');
            debouncedUpdateCode(prev => ({
              ...prev,
              html: html !== null ? html : prev.html,
              css: css !== null ? css : prev.css,
              js: js !== null ? js : prev.js,
            }));
          }
        }, 
        abortControllerRef.current.signal
      );
      setGeneratedCode(prev => ({...prev, reasoning: prev.reasoning + '\n\n✅ Generation Complete!'}));
    } catch (error) {
      if (error.name !== 'AbortError') {
        const errorMessage = `An error occurred: ${error.message}`;
        setError(errorMessage);
        setGeneratedCode(prev => ({...prev, reasoning: errorMessage}));
      } else {
        const abortMessage = 'Generation cancelled by user.';
        setError(abortMessage);
        setGeneratedCode(prev => ({...prev, reasoning: abortMessage}));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterrupt = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate(e);
    }
  };

  return (
    <div className="ai-generator-wrapper">
      <div className="prompt-container">
        <textarea
          value={generatedCode.prompt || ''}
          onChange={handlePromptChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe the component you want to build..."
          className="prompt-input"
          disabled={isLoading}
        />
        <button onClick={isLoading ? handleInterrupt : handleGenerate} className="send-button" aria-label={isLoading ? 'Interrupt' : 'Send'}>
          {isLoading ? <div className="spinner"></div> : (
            <svg className="paper-plane" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AIGenerator;
import React, { useState, useRef, useCallback } from 'react';
import { useCode } from '../../context/CodeContext';
import { generateCode } from '../../services/generatorAPI.js';
// Kita tidak lagi butuh formatCode di file ini
// import { formatCode } from '../../utils/formatter'; 
import './AIGenerator.css';

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setGeneratedCode, setPromptHistory, setComponents } = useCode();
  const abortControllerRef = useRef(null);

  // Fungsi ini tetap sama, tugasnya hanya mengurai stream mentah
  const processStreamChunk = useCallback((fullText) => {
    const cleanfullText = fullText.replace(/\x1B\[[0-9;]*m/g, '');
    const jsonBlockStartIndex = cleanfullText.indexOf('```json');
    const reasoning = jsonBlockStartIndex !== -1 ? cleanfullText.substring(0, jsonBlockStartIndex) : cleanfullText;
    
    let html = '', css = '', js = '';

    if (jsonBlockStartIndex !== -1) {
      const jsonText = cleanfullText.substring(jsonBlockStartIndex + 7);
      const extractValue = (key) => {
        const match = jsonText.match(new RegExp(`"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`));
        return match && match[1] ? match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t') : '';
      };
      html = extractValue('generated-html');
      css = extractValue('generated-css');
      js = extractValue('generated-js');
    }

    setGeneratedCode({ html, css, js, reasoning });
  }, [setGeneratedCode]);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedCode({ html: '', css: '', js: '', reasoning: '⏳ Memulai proses generatif...' });
    if(setComponents) setComponents([]);
    if(setPromptHistory) setPromptHistory(prev => [...prev, { sender: 'user', message: prompt }]);
    
    abortControllerRef.current = new AbortController();
    let fullResponseText = '';

    try {
      await generateCode(
        prompt, 
        true, 
        false,
        (chunk) => {
          fullResponseText += chunk;
          processStreamChunk(fullResponseText); // Update UI secara real-time
        }, 
        abortControllerRef.current.signal
      );
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(`Terjadi kesalahan: ${error.message}`);
        setGeneratedCode(prev => ({...prev, reasoning: `Error: ${error.message}`}));
      } else {
        setError('Proses generatif dihentikan.');
        setGeneratedCode(prev => ({...prev, reasoning: 'Proses dihentikan oleh pengguna.'}));
      }
    } finally {
      setIsLoading(false);
      setPrompt('');
      // HAPUS LANGKAH FORMATTING DARI SINI
      // Pemformatan sekarang ditangani oleh LivePreview saat onBlur.
    }
  };

  const handleInterrupt = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate(e);
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
            placeholder="Jelaskan komponen yang ingin Anda buat..."
            className="prompt-input"
            disabled={isLoading}
          />
          <button onClick={isLoading ? handleInterrupt : handleGenerate} className="send-button">
            {isLoading ? <div className="spinner"></div> : (
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
import React, { useState, useRef } from 'react';
import { useCode } from '../../context/CodeContext';
import { generateCode } from '../../services/generatorAPI.js';
import { formatCode } from '../../utils/formatter';
import './AIGenerator.css';

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Pastikan Anda mengimpor semua yang dibutuhkan dari context jika ada penambahan
  const { setGeneratedCode, setPromptHistory, setComponents } = useCode(); 
  const abortControllerRef = useRef(null);

  // --- FUNGSI PARSING BARU YANG LEBIH ANDAL ---
  const processAndSetCode = async (rawText) => {
    console.clear()
    // 1. Membersihkan karakter aneh (ANSI color codes) DARI AWAL
    const cleanedText = rawText.replace(/\x1B\[[0-9;]*m/g, '');

    let jsonString = cleanedText;
    let reasoningText = '';

    // 2. Mencari blok JSON di dalam teks yang sudah bersih
    const markdownMatch = cleanedText.match(/```json\s*([\s\S]*?)\s*```/);

    if (markdownMatch && markdownMatch[1]) {
      // Jika ditemukan, pisahkan reasoning dan JSON string
      jsonString = markdownMatch[1];
      reasoningText = cleanedText.split('```json')[0].trim();
    } else {
      // Jika tidak ada blok markdown, coba cari objek JSON mentah
      const firstBrace = cleanedText.indexOf('{');
      const lastBrace = cleanedText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        jsonString = cleanedText.substring(firstBrace, lastBrace + 1);
        reasoningText = cleanedText.substring(0, firstBrace).trim();
      }
    }

    try {
      // 3. Coba parse string JSON yang sudah diisolasi
      const parsedJson = JSON.parse(jsonString);

      if (typeof parsedJson === 'object' && parsedJson !== null && 'generated-html' in parsedJson) {
        // 4. Otomatis format kode sebelum disimpan
        const formattedHtml = await formatCode(parsedJson['generated-html'] || '', 'html');
        const formattedCss = await formatCode(parsedJson['generated-css'] || '', 'css');
        const formattedJs = await formatCode(parsedJson['generated-js'] || '', 'js');
        
        // 5. Simpan kode yang sudah diformat ke context
        setGeneratedCode({
          html: formattedHtml,
          css: formattedCss,
          js: formattedJs,
          reasoning: reasoningText || 'Code generation complete.',
        });
        setError(null);
      } else {
        // Jika JSON valid tapi strukturnya salah
        throw new Error("Parsed JSON does not have the expected code structure.");
      }
    } catch (err) {
      // 6. Jika parsing GAGAL, tampilkan teks yang SUDAH BERSIH sebagai reasoning
      setGeneratedCode(prev => ({ ...prev, html: '', css: '', js: '', reasoning: cleanedText }));
    }
    console.log(rawText)
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedCode({ html: '', css: '', js: '', reasoning: '⏳ Generating code...' });
    if(setComponents) setComponents([]);
    if(setPromptHistory) setPromptHistory(prev => [...prev, { sender: 'user', message: prompt }]);
    
    abortControllerRef.current = new AbortController();
    let fullResponseText = '';

    try {
      await generateCode(prompt, true, false, async (chunk) => {
        fullResponseText += chunk;
        await processAndSetCode(fullResponseText);
      }, abortControllerRef.current.signal);

      await processAndSetCode(fullResponseText);

    } catch (error) {
      if (error.name !== 'AbortError') setError(`Generation failed: ${error.message}`);
      else setError('Code generation was stopped.');
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };
  
  // Sisa kode (handleInterrupt, handleKeyDown, dan return JSX) tetap sama
  const handleInterrupt = () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(e); } };

  return (
    <div className="ai-generator">
      <div className="prompt-container">
        <div className="input-wrapper">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the component you want to create..."
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
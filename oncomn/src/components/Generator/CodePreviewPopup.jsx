// oncomn/src/components/Generator/CodePreviewPopup.jsx

import React, { useEffect, useState } from 'react';
import { useCode } from '../../context/CodeContext';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import './CodePreviewPopup.css';

const CodePreviewPopup = () => {
  const { generatedCode, isLoading } = useCode();
  const [activeTab, setActiveTab] = useState('html');
  
  // Tampilkan popup hanya saat loading
  if (!isLoading) {
    return null;
  }
  
  // Fungsi untuk membersihkan kode warna CLI dari reasoning
  const cleanReasoning = (text) => {
    // Regex untuk menghapus ANSI escape codes
    return text.replace(/\x1B\[[0-9;]*m/g, '');
  };

  const getLanguageExtension = (tab) => {
    switch (tab) {
      case 'html': return [html()];
      case 'css': return [css()];
      case 'js': return [javascript()];
      default: return [];
    }
  };

  return (
    <div className="code-preview-popup-overlay">
      <div className="code-preview-popup-container">
        <div className="reasoning-box">
          <h4>AI Thinking Process...</h4>
          <pre>{cleanReasoning(generatedCode.reasoning || 'Menunggu respons...')}</pre>
        </div>
        <div className="code-preview-box">
          <div className="code-preview-tabs">
            <button onClick={() => setActiveTab('html')} className={activeTab === 'html' ? 'active' : ''}>HTML</button>
            <button onClick={() => setActiveTab('css')} className={activeTab === 'css' ? 'active' : ''}>CSS</button>
            <button onClick={() => setActiveTab('js')} className={activeTab === 'js' ? 'active' : ''}>JS</button>
          </div>
          <div className="code-preview-content">
            <CodeMirror
              value={generatedCode[activeTab] || `// Menunggu kode ${activeTab}...`}
              height="100%"
              extensions={getLanguageExtension(activeTab)}
              theme="dark"
              readOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePreviewPopup;
import React from 'react';
import { useCodeContext } from '../../context/CodeContext';
import './LivePreview.css';

const LivePreview = () => {
  const { code } = useCodeContext();
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="preview-container">
      <h3>Live Preview</h3>
      <div className="code-content">
        <button 
          onClick={copyToClipboard}
          className="copy-button"
          aria-label="Copy code"
        >
          📋 Copy
        </button>
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
};

export default LivePreview;
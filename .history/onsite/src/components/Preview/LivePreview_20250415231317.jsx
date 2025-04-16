import { useState, useEffect, useCallback } from 'react';
import { useCode } from '../../context/CodeContext';
import './LivePreview.css';

const LivePreview = () => {
  const { generatedCode, setGeneratedCode } = useCode();
  const { html, css, js } = generatedCode;
  const [activeTab, setActiveTab] = useState('preview');
  const [activeCodeTab, setActiveCodeTab] = useState('html');
  const [localCode, setLocalCode] = useState({ html, css, js });

  // Sync localCode with generatedCode when it changes
  useEffect(() => {
    setLocalCode({ html, css, js });
  }, [html, css, js]);

  // Debounce function to limit setGeneratedCode calls
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Handle code changes
  const handleCodeChange = useCallback(
    debounce((field, value) => {
      setGeneratedCode((prev) => ({ ...prev, [field]: value }));
    }, 300),
    [setGeneratedCode]
  );

  // Update localCode and trigger debounced context update
  const updateCode = (field) => (e) => {
    const value = e.target.value;
    setLocalCode((prev) => ({ ...prev, [field]: value }));
    handleCodeChange(field, value);
  };

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

  // Check if there's content to expand iframe
  const hasContent = localCode.html.trim() || localCode.css.trim() || localCode.js.trim();

  return (
    <div className="preview-container">
      <div className="preview-tabs">
        <button
          className={activeTab === 'preview' ? 'active' : ''}
          onClick={() => setActiveTab('preview')}
        >
          Show Preview
        </button>
        <button
          className={activeTab === 'code' ? 'active' : ''}
          onClick={() => setActiveTab('code')}
        >
          Hide Preview
        </button>
      </div>

      <div
        className={`preview-iframe-container ${hasContent ? 'expanded' : 'collapsed'}`}
        style={{ display: activeTab === 'preview' ? 'block' : 'none' }}
      >
        <iframe
          className="preview-iframe"
          srcDoc={iframeCode}
          title="Live Preview"
          sandbox="allow-scripts"
        />
      </div>

      <div className="code-preview">
        <div className="code-tabs">
          {['html', 'css', 'js'].map((lang) => (
            <button
              key={lang}
              className={activeCodeTab === lang ? 'active' : ''}
              onClick={() => setActiveCodeTab(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="code-content">
          <textarea
            className="code-editor"
            value={localCode[activeCodeTab]}
            onChange={updateCode(activeCodeTab)}
            spellCheck="false"
            placeholder={`Enter ${activeCodeTab.toUpperCase()} code here...`}
          />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
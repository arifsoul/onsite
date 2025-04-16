import { useState, useEffect, useCallback } from 'react';
import { useCode } from '../../context/CodeContext';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import './LivePreview.css';

const LivePreview = () => {
  const { generatedCode, setGeneratedCode } = useCode();
  const { html: initialHtml, css: initialCss, js: initialJs } = generatedCode;
  const [activeTab, setActiveTab] = useState('preview');
  const [activeCodeTab, setActiveCodeTab] = useState('html');
  const [localCode, setLocalCode] = useState({
    html: initialHtml,
    css: initialCss,
    js: initialJs,
  });

  // Sinkronisasi localCode dengan generatedCode saat ada perubahan
  useEffect(() => {
    setLocalCode({
      html: initialHtml,
      css: initialCss,
      js: initialJs,
    });
  }, [initialHtml, initialCss, initialJs]);

  // Fungsi debounce untuk membatasi pembaruan state
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Handler untuk perubahan kode
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

  // Gabungkan kode untuk ditampilkan di iframe
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

  const hasContent =
    localCode.html.trim() || localCode.css.trim() || localCode.js.trim();

  // Pilih bahasa untuk CodeMirror berdasarkan tab aktif
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
        className={`preview-iframe-container ${
          hasContent ? 'expanded' : 'collapsed'
        }`}
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
          <CodeMirror
            value={localCode[activeCodeTab]}
            height="200px"
            extensions={[getEditorLanguage()]}
            onChange={(value) => updateCode(activeCodeTab)(value)}
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
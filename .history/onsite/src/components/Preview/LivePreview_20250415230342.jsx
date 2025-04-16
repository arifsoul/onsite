import { useState, useEffect, useCallback } from 'react';
import { useCode } from '../../context/CodeContext';
import './LivePreview.css';

const LivePreview = () => {
  const { generatedCode, setGeneratedCode } = useCode();
  const { jsx, css, js } = generatedCode; // Menggunakan 'jsx' alih-alih 'html'
  const [activeTab, setActiveTab] = useState('preview');
  const [activeCodeTab, setActiveCodeTab] = useState('jsx'); // Default ke 'jsx'
  const [localCode, setLocalCode] = useState({ jsx, css, js });

  // Sinkronkan localCode dengan generatedCode saat ada perubahan
  useEffect(() => {
    setLocalCode({ jsx, css, js });
  }, [jsx, css, js]);

  // Fungsi debounce untuk membatasi pemanggilan setGeneratedCode
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Tangani perubahan kode
  const handleCodeChange = useCallback(
    debounce((field, value) => {
      setGeneratedCode((prev) => ({ ...prev, [field]: value }));
    }, 300),
    [setGeneratedCode]
  );

  // Perbarui localCode dan picu pembaruan context yang di-debounce
  const updateCode = (field) => (e) => {
    const value = e.target.value;
    setLocalCode((prev) => ({ ...prev, [field]: value }));
    handleCodeChange(field, value);
  };

  // Transformasi JSX menjadi JavaScript menggunakan Babel
  const transformedCode = window.Babel.transform(
    `
    function App() {
      return (${localCode.jsx || '<div></div>'});
    }
    ReactDOM.render(<App />, document.getElementById('root'));
    `,
    { presets: ['react'] }
  ).code;

  // Buat konten iframe dengan React, ReactDOM, CSS, JS yang ditransformasi, dan JS tambahan
  const iframeCode = `
    <html>
      <head>
        <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
        <style>${localCode.css}</style>
      </head>
      <body>
        <div id="root"></div>
        <script>${transformedCode}</script>
        <script>${localCode.js}</script>
      </body>
    </html>
  `.trim();

  // Cek apakah ada konten untuk memperluas iframe
  const hasContent = localCode.jsx.trim() || localCode.css.trim() || localCode.js.trim();

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
          {['jsx', 'css', 'js'].map((lang) => (
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
import { useState, useEffect, useCallback } from 'react';
import { useCode } from '../../context/CodeContext';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import './LivePreview.css';

// Konten awal bertema Onsite AI Frontend Generator
const initialHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Onsite AI Frontend Generator</title>
  <style>
    @keyframes slideIn {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
    .banner {
      animation: slideIn 1s ease-out;
      background: linear-gradient(135deg, #007bff, #00ff88);
      color: white;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .banner h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <div class="banner">
    <h1>AI-Powered Frontend Generator</h1>
    <p>Transform your ideas into code instantly</p>
  </div>
</html>
`.trim();

const initialCss = `
:root {
  --primary-color: #007bff;
  --background-color: #f4f7fb;
  --text-color: #333;
}

body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background: var(--background-color);
  color: var(--text-color);
}

.header {
  background: var(--primary-color);
  color: white;
  padding: 1rem;
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 1.8rem;
}

.header nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.header nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.hero {
  text-align: center;
  padding: 2rem;
}

.hero h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.cta-button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.cta-button:hover {
  background: #0056b3;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .header nav ul {
    flex-direction: column;
    gap: 0.5rem;
  }
}
`.trim();

const initialJs = `
document.addEventListener('DOMContentLoaded', () => {
  const ctaButton = document.querySelector('.cta-button');
  ctaButton.addEventListener('click', () => {
    alert('Welcome to Onsite AI Frontend Generator! Start building now.');
  });
});
`.trim();

const LivePreview = () => {
  const { generatedCode, setGeneratedCode } = useCode();
  const [activeTab, setActiveTab] = useState('preview');
  const [activeCodeTab, setActiveCodeTab] = useState('html');
  const [localCode, setLocalCode] = useState({
    html: generatedCode.html || initialHtml,
    css: generatedCode.css || initialCss,
    js: generatedCode.js || initialJs,
  });

  // Sinkronisasi localCode dengan generatedCode saat ada perubahan
  useEffect(() => {
    setLocalCode({
      html: generatedCode.html || initialHtml,
      css: generatedCode.css || initialCss,
      js: generatedCode.js || initialJs,
    });
  }, [generatedCode.html, generatedCode.css, generatedCode.js]);

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

  // Fungsi untuk menyalin kode ke clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      alert('Code copied to clipboard!');
    });
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
          <i className="fas fa-eye"></i> Preview
        </button>
        <button
          className={activeTab === 'code' ? 'active' : ''}
          onClick={() => setActiveTab('code')}
        >
          <i className="fas fa-code"></i> Code
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
          {[
            { lang: 'html', icon: 'fab fa-html5' },
            { lang: 'css', icon: 'fab fa-css3-alt' },
            { lang: 'js', icon: 'fab fa-js' },
          ].map(({ lang, icon }) => (
            <button
              key={lang}
              className={activeCodeTab === lang ? 'active' : ''}
              onClick={() => setActiveCodeTab(lang)}
            >
              <i className={icon}></i> {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="code-content">
          <div className="code-header">
            <button
              className="copy-button"
              onClick={() => copyToClipboard(localCode[activeCodeTab])}
              title="Copy Code"
            >
              <i className="fas fa-copy"></i> Copy {activeCodeTab.toUpperCase()}
            </button>
          </div>
          <CodeMirror
            value={localCode[activeCodeTab]}
            height="300px"
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
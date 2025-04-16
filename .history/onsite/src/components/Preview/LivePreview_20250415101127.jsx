import { useState } from 'react';
import { useCode } from '../../context/CodeContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './LivePreview.css';

const LivePreview = () => {
  const { generatedCode } = useCode();
  const { html, css, js } = generatedCode;
  const [activeTab, setActiveTab] = useState('preview');
  const [activeCodeTab, setActiveCodeTab] = useState('html');

  const iframeCode = `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>
  `.trim();

  return (
    <div className="preview-container">
      <div className="preview-tabs">
        <button
          className={activeTab === 'preview' ? 'active' : ''}
          onClick={() => setActiveTab('preview')}
        >
          Live Preview
        </button>
        <button
          className={activeTab === 'code' ? 'active' : ''}
          onClick={() => setActiveTab('code')}
        >
          Code View
        </button>
      </div>

      {activeTab === 'preview' ? (
        <iframe
          className="preview-iframe"
          srcDoc={iframeCode}
          title="Live Preview"
          sandbox="allow-scripts"
        />
      ) : (
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
            <SyntaxHighlighter
              language={activeCodeTab}
              style={vscDarkPlus}
            >
              {activeCodeTab === 'html' ? html :
               activeCodeTab === 'css' ? css : js}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivePreview;
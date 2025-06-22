import { useMemo, useCallback, useState } from 'react';
import { useCode } from '../../context/CodeContext';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { FaCopy } from 'react-icons/fa';
import './LivePreview.css';

const LivePreview = ({ isEditorVisible, viewMode }) => {
  const { generatedCode, setGeneratedCode } = useCode();
  const [activeCodeTab, setActiveCodeTab] = useState('html');

  const extractBodyContent = (htmlString) => {
    const match = htmlString.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    return match ? match[1] : htmlString;
  };

  const iframeSrcDoc = useMemo(() => {
    const bodyContent = extractBodyContent(generatedCode.html || '');
    return `
      <html>
        <head><style>${generatedCode.css || ''}</style></head>
        <body>
          ${bodyContent}
          <script>try { ${generatedCode.js || ''} } catch(e) { console.error(e); }</script>
        </body>
      </html>
    `;
  }, [generatedCode]);
  
  const onCodeChange = useCallback((field, value) => {
    setGeneratedCode(prev => ({ ...prev, [field]: value }));
  },[setGeneratedCode]);
  
  const getEditorLanguage = (tab) => {
    if (tab === 'html') return html();
    if (tab === 'css') return css();
    return javascript({ jsx: true });
  };
  
  const editorExtensions = (lang) => [getEditorLanguage(lang)];

  const copyToClipboard = (code, type) => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => alert(`${type} copied to clipboard!`));
    }
  };

  return (
    <div className="live-preview-layout">
      <div className="preview-area-wrapper">
        <div className={`preview-device ${viewMode}`}>
          <iframe srcDoc={iframeSrcDoc} title="Live Preview" sandbox="allow-scripts allow-forms allow-same-origin" className="preview-iframe" />
        </div>
      </div>

      <div className={`code-editor-sidebar ${isEditorVisible ? 'visible' : ''}`}>
        <div className="code-editor-header">
          <div className="code-tabs">
            {['html', 'css', 'js'].map(lang => (
              <button key={lang} className={`code-tab-button ${activeCodeTab === lang ? 'active' : ''}`} onClick={() => setActiveCodeTab(lang)}>{lang.toUpperCase()}</button>
            ))}
          </div>
          <button className="copy-button" onClick={() => copyToClipboard(generatedCode[activeCodeTab], activeCodeTab.toUpperCase())}>
            <FaCopy />
          </button>
        </div>
        <div className="codemirror-wrapper">
          <CodeMirror
            value={generatedCode[activeCodeTab] || ''}
            height="100%"
            extensions={editorExtensions(activeCodeTab)}
            onChange={(value) => onCodeChange(activeCodeTab, value)}
            theme="dark"
            className="codemirror-editor"
          />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
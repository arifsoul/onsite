// oncomn/src/components/Preview/LivePreview.jsx

import { useState, useMemo, useCallback } from 'react';
import { useCode } from '../../context/CodeContext';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import { formatCode } from '../../utils/formatter';
import { FaDesktop, FaTabletAlt, FaMobileAlt, FaEyeSlash, FaEye } from 'react-icons/fa';
import './LivePreview.css';

const LivePreview = () => {
  const { generatedCode, setGeneratedCode } = useCode();
  const [viewMode, setViewMode] = useState('desktop');
  const [activeCodeTab, setActiveCodeTab] = useState('html');
  const [isCodeVisible, setIsCodeVisible] = useState(true);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const onCodeChange = useCallback(
    debounce((field, value) => {
      setGeneratedCode(prev => ({ ...prev, [field]: value }));
    }, 250),
    [setGeneratedCode]
  );

  // FUNGSI DIPERBAIKI: Menggunakan 'view' instance dari CodeMirror
  const handleBlur = useCallback(async (view, field) => {
    const currentCode = view.state.doc.toString();
    const formatted = await formatCode(currentCode, field);
    if (formatted !== currentCode) {
      setGeneratedCode(prev => ({...prev, [field]: formatted}));
    }
  }, [setGeneratedCode]);

  const iframeSrcDoc = useMemo(() => `
    <html>
      <head><style>${generatedCode.css || ''}</style></head>
      <body>
        ${generatedCode.html || ''}
        <script>try { ${generatedCode.js || ''} } catch(e) { console.error(e); }</script>
      </body>
    </html>
  `, [generatedCode]);

  const getEditorLanguage = (tab) => {
    if (tab === 'html') return html();
    if (tab === 'css') return css();
    return javascript();
  };

  // EXTENSIONS DIPERBAIKI: Menggunakan `useMemo` dan meneruskan `view` ke `handleBlur`
  const editorExtensions = useMemo(() => (field) => [
    getEditorLanguage(field),
    EditorView.domEventHandlers({
      blur: (event, view) => handleBlur(view, field),
    }),
  ], [handleBlur]);

  const copyToClipboard = (code, type) => {
    navigator.clipboard.writeText(code).then(() => alert(`${type} copied!`));
  };

  return (
    <div className="live-preview-wrapper">
      <div className="top-controls-bar">
         <div className="preview-controls">
            <button className={`view-mode-button ${viewMode === 'desktop' ? 'active' : ''}`} onClick={() => setViewMode('desktop')} title="Desktop"><FaDesktop /><span>Desktop</span></button>
            <button className={`view-mode-button ${viewMode === 'tablet' ? 'active' : ''}`} onClick={() => setViewMode('tablet')} title="Tablet"><FaTabletAlt /><span>Tablet</span></button>
            <button className={`view-mode-button ${viewMode === 'mobile' ? 'active' : ''}`} onClick={() => setViewMode('mobile')} title="Mobile"><FaMobileAlt /><span>Mobile</span></button>
        </div>
        <div className="editor-toggle-control">
            <button onClick={() => setIsCodeVisible(!isCodeVisible)} title={isCodeVisible ? 'Hide Code' : 'Show Code'}>
                {isCodeVisible ? <FaEyeSlash /> : <FaEye />}
                <span>{isCodeVisible ? 'Hide Code' : 'Show Code'}</span>
            </button>
        </div>
      </div>
      
      <div className="preview-area">
        <div className={`preview-device ${viewMode}`}>
          <iframe srcDoc={iframeSrcDoc} title="Live Preview" sandbox="allow-scripts" className="preview-iframe" />
        </div>
      </div>
      
      {isCodeVisible && (
        <>
          <div className="code-editor-section">
            <div className="code-tabs">
              {['html', 'css', 'js'].map(lang => (
                <button key={lang} className={`code-tab-button ${activeCodeTab === lang ? 'active' : ''}`} onClick={() => setActiveCodeTab(lang)}>{lang.toUpperCase()}</button>
              ))}
              <button className="copy-button" onClick={() => copyToClipboard(generatedCode[activeCodeTab], activeCodeTab.toUpperCase())}>
                Copy {activeCodeTab.toUpperCase()}
              </button>
            </div>
            <CodeMirror
              value={generatedCode[activeCodeTab]}
              height="300px"
              extensions={editorExtensions(activeCodeTab)}
              onChange={(value) => onCodeChange(activeCodeTab, value)}
              theme="dark"
            />
          </div>

          <div className="reasoning-container">
            <h3>AI Reasoning</h3>
            <div className="reasoning-content">
              <pre>{generatedCode.reasoning || '...'}</pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LivePreview;
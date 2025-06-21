// oncomn/src/components/Preview/LivePreview.jsx

import { useState, useMemo, useCallback } from 'react';
import { useCode } from '../../context/CodeContext';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import { formatCode } from '../../utils/formatter';
import { FaDesktop, FaTabletAlt, FaMobileAlt, FaCode, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import './LivePreview.css';

const LivePreview = () => {
  const { generatedCode, setGeneratedCode } = useCode();
  const [viewMode, setViewMode] = useState('desktop');
  const [activeCodeTab, setActiveCodeTab] = useState('html');
  // State ini sekarang berfungsi sebagai expander
  const [isEditorVisible, setIsEditorVisible] = useState(false); 

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
    // Wrapper diubah menjadi 'fullscreen'
    <div className="live-preview-fullscreen-wrapper">
      <div className="preview-area">
        <div className="view-controls">
          <button className={`view-mode-button ${viewMode === 'desktop' ? 'active' : ''}`} onClick={() => setViewMode('desktop')} title="Desktop"><FaDesktop /></button>
          <button className={`view-mode-button ${viewMode === 'tablet' ? 'active' : ''}`} onClick={() => setViewMode('tablet')} title="Tablet"><FaTabletAlt /></button>
          <button className={`view-mode-button ${viewMode === 'mobile' ? 'active' : ''}`} onClick={() => setViewMode('mobile')} title="Mobile"><FaMobileAlt /></button>
        </div>
        <div className={`preview-device ${viewMode}`}>
          <iframe srcDoc={iframeSrcDoc} title="Live Preview" sandbox="allow-scripts" className="preview-iframe" />
        </div>
      </div>
      
      {/* Kontainer untuk editor yang bisa disembunyikan/ditampilkan */}
      <div className={`code-editor-collapsible-container ${isEditorVisible ? 'visible' : ''}`}>
        <div className="code-editor-header">
            <div className="code-tabs">
              {['html', 'css', 'js'].map(lang => (
                <button key={lang} className={`code-tab-button ${activeCodeTab === lang ? 'active' : ''}`} onClick={() => setActiveCodeTab(lang)}>{lang.toUpperCase()}</button>
              ))}
            </div>
            <div className="code-actions">
              <button className="copy-button" onClick={() => copyToClipboard(generatedCode[activeCodeTab], activeCodeTab.toUpperCase())}>
                Copy {activeCodeTab.toUpperCase()}
              </button>
            </div>
        </div>
        <div className="codemirror-wrapper">
          <CodeMirror
              value={generatedCode[activeCodeTab]}
              height="100%"
              extensions={editorExtensions(activeCodeTab)}
              onChange={(value) => onCodeChange(activeCodeTab, value)}
              theme="dark"
              className="codemirror-editor"
          />
        </div>
      </div>

      {/* Tombol expander */}
      <button className="editor-expander-button" onClick={() => setIsEditorVisible(!isEditorVisible)}>
        {isEditorVisible ? <FaAngleDown /> : <FaAngleUp />}
        <span>Code</span>
      </button>
    </div>
  );
};

export default LivePreview;
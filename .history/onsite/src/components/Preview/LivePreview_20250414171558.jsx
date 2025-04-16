import { useCode } from '../../context/CodeContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './LivePreview.css';

const LivePreview = () => {
  const { generatedCode } = useCode();
  const { html, css, js } = generatedCode;

  return (
    <div className="preview-container">
      <h4>HTML</h4>
      <SyntaxHighlighter language="html" style={vscDarkPlus}>
        {html || '// Kode HTML akan muncul di sini'}
      </SyntaxHighlighter>
      <h4>CSS</h4>
      <SyntaxHighlighter language="css" style={vscDarkPlus}>
        {css || '// Kode CSS akan muncul di sini'}
      </SyntaxHighlighter>
      <h4>JavaScript</h4>
      <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
        {js || '// Kode JavaScript akan muncul di sini'}
      </SyntaxHighlighter>
    </div>
  );
};

export default LivePreview;
import { useCode } from '../../context/CodeContext';
import './LivePreview.css';

const LivePreview = () => {
  const { generatedCode, components } = useCode();

  const combinedHTML = `
    <style>${generatedCode.css}</style>
    ${components.map((comp) => comp.html).join('')}
    <script>${generatedCode.js}</script>
  `;

  return (
    <div className="preview-container">
      <iframe
        srcDoc={combinedHTML}
        title="Live Preview"
        className="preview-iframe"
      />
    </div>
  );
};

export default LivePreview;
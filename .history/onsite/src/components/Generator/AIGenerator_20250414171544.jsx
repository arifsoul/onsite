import { useState } from 'react';
import { useCode } from '../../context/CodeContext';
import { generateCode } from '../../services/deepseekApi';
import './AIGenerator.css';

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState(null);
  const { setGeneratedCode, setComponents } = useCode();

  const handleGenerate = async () => {
    try {
      setError(null);
      const response = await generateCode(prompt);
      const { html, css, js, components } = response.data;
      setGeneratedCode({ html, css, js });
      setComponents(components || []);
    } catch (error) {
      setError('Gagal menghasilkan kode.');
    }
  };

  return (
    <div className="generator-container">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Tulis deskripsi UI Anda di sini..."
        className="prompt-input code-editor"
      />
      <button onClick={handleGenerate} className="generate-btn">
        Generate Kode
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AIGenerator;
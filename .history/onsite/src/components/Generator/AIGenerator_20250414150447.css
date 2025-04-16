import { useState } from 'react';
import { useCode } from '../../context/CodeContext';
import { generateCode } from '../../services/deepseekApi';
import './AIGenerator.css';

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const { setGeneratedCode, setComponents } = useCode();

  const handleGenerate = async () => {
    try {
      const response = await generateCode(prompt);
      const { html, css, js, components } = response.data;
      setGeneratedCode({ html, css, js });
      setComponents(components);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  return (
    <div className="generator-container">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Deskripsikan UI yang Anda inginkan..."
        className="prompt-input"
      />
      <button onClick={handleGenerate} className="generate-btn">
        Generate Kode
      </button>
    </div>
  );
};

export default AIGenerator;
import { useState, useContext } from 'react';
import { CodeContext } from '../../context/CodeContext';
import { generateCode } from '../../services/deepseekApi';
import OnsiteLogo from '../../assets/Onsite.png';
import './AIGenerator.css';

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setGeneratedCode, setComponents } = useContext(CodeContext);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await generateCode(prompt);
      const { html, css, js, components } = response.data;
      setGeneratedCode({ html, css, js });
      setComponents(components || []);
    } catch (error) {
      setError('Failed to generate code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleGenerate(e);
    }
  };

  return (
    <div className="ai-generator">
      <div className="generator-header">
        <img src={OnsiteLogo} alt="Onsite Logo" className="logo" />
        <h3>AI-Powered Component Generator</h3>
      </div>

      <div className="prompt-container">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the component you want to create..."
          className="prompt-input"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="send-button"
        >
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <svg className="paper-plane" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          )}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      <p className="hint-text">
        Pro Tip: Use Shift + Enter for new lines
      </p>
    </div>
  );
};

export default AIGenerator;
import { useState, useContext } from 'react';
import { CodeContext } from '../../context/CodeContext';
import { generateCode } from '../../services/deepseekApi';
import './AIGenerator.css';

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setGeneratedCode, setComponents } = useContext(CodeContext);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await generateCode(prompt);
      const { html, css, js, components } = response.data;
      setGeneratedCode({ html, css, js });
      setComponents(components || []);
    } catch (error) {
      setError(error.message || 'Failed to generate code. Please try again.');
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
      <div className="prompt-container">
        <div className="input-wrapper">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the component you want to create (e.g., 'A responsive navbar with a hamburger menu')"
            className="prompt-input"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="send-button"
            aria-label="Generate component"
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <svg className="paper-plane" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
      <p className="hint-text">
        Pro Tip: Use Shift + Enter for new lines
      </p>
    </div>
  );
};

export default AIGenerator;
import { useState, useContext } from 'react';
import { CodeContext } from '../../context/CodeContext';
import { generateCode } from '../../services/openrouterApi';
import './AIGenerator.css';

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]); // New state for chat history
  const { setGeneratedCode, setComponents } = useContext(CodeContext);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) {
      const errorMsg = 'Prompt cannot be empty.';
      setError(errorMsg);
      setChatHistory((prev) => [
        ...prev,
        { role: 'error', content: `Error: ${errorMsg}`, timestamp: new Date().toISOString() },
      ]);
      return;
    }

    // Add user prompt to chat history
    setChatHistory((prev) => [
      ...prev,
      { role: 'user', content: prompt, timestamp: new Date().toISOString() },
    ]);

    setIsLoading(true);
    setError(null);
    try {
      const response = await generateCode(prompt);
      const { html, css, js, components } = response.data;
      setGeneratedCode({ html, css, js });
      setComponents(components || []);
      // Optionally add successful response to history (commented out to focus on errors and prompts)
      // setChatHistory((prev) => [
      //   ...prev,
      //   { role: 'assistant', content: JSON.stringify({ html, css, js }, null, 2), timestamp: new Date().toISOString() },
      // ]);
    } catch (error) {
      const errorMsg = error.message || 'Failed to generate code. Please try again.';
      setError(errorMsg);
      // Add error to chat history
      setChatHistory((prev) => [
        ...prev,
        { role: 'error', content: `Error: ${errorMsg}`, timestamp: new Date().toISOString() },
      ]);
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
      {/* Chat History */}
      <div
        className="chat-history"
        style={{
          maxHeight: '200px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: '#f9f9f9',
        }}
      >
        {chatHistory.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No messages yet.</p>
        ) : (
          chatHistory.map((message, index) => (
            <div
              key={index}
              style={{
                margin: '5px 0',
                padding: '8px',
                borderRadius: '5px',
                backgroundColor:
                  message.role === 'user' ? '#e6f3ff' : '#ffe6e6',
                fontSize: '14px',
              }}
            >
              <strong>{message.role === 'user' ? 'You' : 'Error'}:</strong>{' '}
              {message.content}
              <br />
              <small style={{ color: '#888' }}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))
        )}
      </div>

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
              <svg
                className="paper-plane"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
      <p className="hint-text">Pro Tip: Use Shift + Enter for new lines</p>
    </div>
  );
};

export default AIGenerator;
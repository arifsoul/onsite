import React, { createContext, useState, useContext } from 'react';

// State awal yang akan ditampilkan saat aplikasi pertama kali dimuat
const initialCode = {
  html: `<h1>Welcome to Oncomn AI</h1>
<p>Describe the component you want to build in the prompt below.</p>`,
  css: `body {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #f0f0f0;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}
h1 {
  font-size: 2.5rem;
  color: #8a5ff1;
}
p {
  font-size: 1.2rem;
  color: #a0a0a0;
  margin-top: 1rem;
}`,
  js: `console.log("Welcome to Oncomn AI!");`,
  reasoning: 'AI is ready. Describe the component you want to build in the prompt below.',
};

export const CodeContext = createContext();

export const CodeProvider = ({ children }) => {
  const [generatedCode, setGeneratedCode] = useState(initialCode);
  const [promptHistory, setPromptHistory] = useState([]);
  const [components, setComponents] = useState([]);

  const value = {
    generatedCode,
    setGeneratedCode,
    promptHistory,
    setPromptHistory,
    components,
    setComponents,
  };

  return (
    <CodeContext.Provider value={value}>
      {children}
    </CodeContext.Provider>
  );
};

// Custom hook untuk mempermudah penggunaan context
export const useCode = () => {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error('useCode must be used within a CodeProvider');
  }
  return context;
};
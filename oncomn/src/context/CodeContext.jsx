import React, { createContext, useState, useContext } from 'react';

// State awal yang akan ditampilkan saat aplikasi pertama kali dimuat
const initialCode = {
  html: `<h1>Welcome to Oncomn AI</h1>
<p>Describe the component you want to build in the prompt below.</p>`,
  css: `body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #1e1e1e;
  color: white;
  font-family: sans-serif;
  text-align: center;
}
h1 {
  color: #8a5ff1;
}`,
  js: `console.log("Welcome to the Oncomn AI code generator!");`,
  reasoning: 'AI is ready. Describe the component you want to build.',
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
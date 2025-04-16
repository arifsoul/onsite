import { createContext, useState, useContext } from 'react';

export const CodeContext = createContext();

export const CodeProvider = ({ children }) => {
  const [generatedCode, setGeneratedCode] = useState({
    html: '',
    css: '',
    js: '',
  });
  const [components, setComponents] = useState([]);

  const updateComponent = (id, updates) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, ...updates } : comp
      )
    );
  };

  return (
    <CodeContext.Provider
      value={{ generatedCode, setGeneratedCode, components, setComponents, updateComponent }}
    >
      {children}
    </CodeContext.Provider>
  );
};

export const useCode = () => useContext(CodeContext);
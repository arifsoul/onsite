import { createContext, useContext, useState } from 'react';

/**
 * @typedef {Object} GeneratedCode
 * @property {string} html - Generated HTML code
 * @property {string} css - Generated CSS code
 * @property {string} js - Generated JavaScript code
 * @property {string} reasoning - AI reasoning or explanation
 */

/**
 * @typedef {Object} PromptHistoryEntry
 * @property {'user' | 'ai'} sender - Sender of the message ('user' or 'ai')
 * @property {string} message - Prompt or reasoning text
 */

/**
 * @typedef {Object} CodeContextValue
 * @property {GeneratedCode} generatedCode - Current generated code state
 * @property {Function} setGeneratedCode - Setter for generatedCode
 * @property {Array<Object>} components - List of generated components
 * @property {Function} setComponents - Setter for components
 * @property {PromptHistoryEntry[]} promptHistory - Chat history of prompts and reasoning
 * @property {Function} setPromptHistory - Setter for promptHistory
 * @property {Function} resetState - Resets all context state
 * @property {Function} clearPromptHistory - Clears prompt history
 */

/** @type {import('react').Context<CodeContextValue>} */
export const CodeContext = createContext();

/**
 * Custom hook to access CodeContext
 * @returns {CodeContextValue} Context value
 * @throws {Error} If used outside CodeProvider
 */
export const useCode = () => {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error('useCode must be used within a CodeProvider');
  }
  return context;
};

/**
 * Provides context for managing generated code, components, and prompt history.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element}
 */
export const CodeProvider = ({ children }) => {
  const [generatedCode, setGeneratedCode] = useState({
    html: '',
    css: '',
    js: '',
    reasoning: '',
  });

  const [components, setComponents] = useState([]);
  const [promptHistory, setPromptHistory] = useState([]);

  /**
   * Resets all context state to initial values.
   */
  const resetState = () => {
    setGeneratedCode({
      html: '',
      css: '',
      js: '',
      reasoning: '',
    });
    setComponents([]);
    setPromptHistory([]);
  };

  /**
   * Clears the prompt history.
   */
  const clearPromptHistory = () => {
    setPromptHistory([]);
  };

  return (
    <CodeContext.Provider
      value={{
        generatedCode,
        setGeneratedCode,
        components,
        setComponents,
        promptHistory,
        setPromptHistory,
        resetState,
        clearPromptHistory,
      }}
    >
      {children}
    </CodeContext.Provider>
  );
};
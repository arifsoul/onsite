// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CodeProvider } from './context/CodeContext';
import './index.css';

// Suppress React DevTools message in development
if (process.env.NODE_ENV === 'development') {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { supportsFiber: true, inject: () => {} };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CodeProvider>
      <App />
    </CodeProvider>
  </React.StrictMode>
);
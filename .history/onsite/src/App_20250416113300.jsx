import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { CodeProvider } from './context/CodeContext';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Docs from './pages/Docs';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <CodeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/pricing" element={<Editor />} />
            <Route path="/docs" element={<Editor />} />
            <Route path="/contact" element={<Editor />} />
          </Routes>
        </Router>
      </CodeProvider>
    </Auth0Provider>
  );
}

export default App;
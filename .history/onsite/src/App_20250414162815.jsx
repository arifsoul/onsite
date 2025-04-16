import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { CodeProvider } from './context/CodeContext'; // Impor CodeProvider
import Home from './pages/Home';
import Editor from './pages/Editor';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <CodeProvider> {/* Bungkus dengan CodeProvider */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </Router>
      </CodeProvider>
    </Auth0Provider>
  );
}

export default App;
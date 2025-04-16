import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import GoogleLogin from '../components/Auth/GoogleLogin';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth0();
  const [htmlCode, setHtmlCode] = useState('<h1>Hello World</h1>');
  const [cssCode, setCssCode] = useState('h1 { color: #1e40af; }');
  const [jsCode, setJsCode] = useState('console.log("Hello World");');
  const [activeTab, setActiveTab] = useState('html');

  const iframeCode = `
<html>
  <head>
    <style>${cssCode}</style>
  </head>
  <body>
    ${htmlCode}
    <script>${jsCode}</script>
  </body>
</html>
  `.trim();

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">
          <h1>Onsite</h1>
          <span>AI-Powered Frontend Generator</span>
        </div>
        <nav className="nav-menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/docs">Docs</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <GoogleLogin />
      </header>
      <main className="home-main">
        <section className="hero-section">
          <h2>Revolusi Frontend Futuristik Anda</h2>
          <p>
            Onsite memberdayakan pengembang untuk menciptakan antarmuka yang modern dan canggih dengan bantuan AI.
          </p>
          <Link to={isAuthenticated ? '/editor' : '/login'} className="hero-cta">
            {isAuthenticated ? 'Mulai Mengedit Sekarang' : 'Login untuk Memulai'}
          </Link>
        </section>
        <section className="description-section">
          <h2>Kenapa Memilih Onsite?</h2>
          <p>
            Dengan menggabungkan kecerdasan buatan dengan teknologi frontend terkini, Onsite menghadirkan solusi responsif dan profesional untuk kebutuhan bisnis Anda.
          </p>
          <ul>
            <li>Generasi kode cepat dan akurat.</li>
            <li>Edit komponen secara visual dengan antarmuka futuristik.</li>
            <li>Integrasi yang mulus dengan proyek Anda.</li>
          </ul>
        </section>
        <section className="code-playground">
          <div className="generator-section">
            <h3>Code Generator</h3>
            <div className="generator-inputs">
              <div className="generator-file">
                <h4>HTML</h4>
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  placeholder="Masukkan kode HTML..."
                />
              </div>
              <div className="generator-file">
                <h4>CSS</h4>
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  placeholder="Masukkan kode CSS..."
                />
              </div>
              <div className="generator-file">
                <h4>JavaScript</h4>
                <textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  placeholder="Masukkan kode JavaScript..."
                />
              </div>
            </div>
          </div>
          <div className="preview-section">
            <h3>Preview</h3>
            <iframe
              srcDoc={iframeCode}
              className="preview-iframe"
              sandbox="allow-scripts"
              title="Live Preview"
            />
          </div>
          <div className="editor-section">
            <h3>Code Editor</h3>
            <div className="tabs">
              <button
                className={activeTab === 'html' ? 'active' : ''}
                onClick={() => setActiveTab('html')}
              >
                HTML
              </button>
              <button
                className={activeTab === 'css' ? 'active' : ''}
                onClick={() => setActiveTab('css')}
              >
                CSS
              </button>
              <button
                className={activeTab === 'js' ? 'active' : ''}
                onClick={() => setActiveTab('js')}
              >
                JS
              </button>
            </div>
            <div className="code-editor">
              {activeTab === 'html' && (
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  placeholder="Masukkan kode HTML..."
                />
              )}
              {activeTab === 'css' && (
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  placeholder="Masukkan kode CSS..."
                />
              )}
              {activeTab === 'js' && (
                <textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  placeholder="Masukkan kode JavaScript..."
                />
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="home-footer">
        <p>© 2025 Onsite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
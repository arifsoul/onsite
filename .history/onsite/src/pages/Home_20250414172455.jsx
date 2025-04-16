import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import AIGenerator from '../components/Generator/AIGenerator';
import GoogleLogin from '../components/Auth/GoogleLogin';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth0();

  // State variables to hold the code and active tab
  const [htmlCode, setHtmlCode] = useState('<h1>Hello World</h1>');
  const [cssCode, setCssCode] = useState('h1 { color: blue; }');
  const [jsCode, setJsCode] = useState('console.log("Hello World");');
  const [activeTab, setActiveTab] = useState('html');

  // Combine the codes into an HTML string for the iframe
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
        <GoogleLogin />
      </header>
      <main className="home-main">
        <section className="hero-section">
          <h2>Revolusi Pengembangan Frontend Anda</h2>
          <p>
            Onsite memberdayakan pengembang untuk menciptakan antarmuka pengguna yang indah dan fungsional dengan bantuan AI.
            Mulai dari ide hingga kode dalam hitungan detik.
          </p>
          <Link to={isAuthenticated ? '/editor' : '/login'} className="hero-cta">
            {isAuthenticated ? 'Mulai Mengedit Sekarang' : 'Login untuk Memulai'}
          </Link>
        </section>
        <section className="description-section">
          <h2>Kenapa Onsite?</h2>
          <p>
            Onsite menggabungkan kecerdasan buatan dan pengembangan frontend untuk menghasilkan kode React yang bersih dan responsif.
          </p>
          <ul>
            <li>Generate kode dengan cepat dan akurat.</li>
            <li>Edit komponen secara visual.</li>
            <li>Integrasi mudah dengan proyek Anda.</li>
          </ul>
        </section>
        <section className="code-playground">
          <div className="generator-section">
            <h3>AI Generator</h3>
            <AIGenerator
              onGenerate={(html, css, js) => {
                setHtmlCode(html);
                setCssCode(css);
                setJsCode(js);
              }}
            />
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
                  placeholder="Enter HTML code here..."
                />
              )}
              {activeTab === 'css' && (
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  placeholder="Enter CSS code here..."
                />
              )}
              {activeTab === 'js' && (
                <textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  placeholder="Enter JavaScript code here..."
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
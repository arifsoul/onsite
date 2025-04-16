import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import AIGenerator from '../components/Generator/AIGenerator';
import GoogleLogin from '../components/Auth/GoogleLogin';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth0();

  const [htmlCode, setHtmlCode] = useState('<h1>Hello World</h1>');
  const [cssCode, setCssCode] = useState('h1 { color: blue; }');
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
        <section className="features-section">
          <h2>Features</h2>
          <p>Jelajahi fitur-fitur canggih dari Onsite.</p>
        </section>
        <section className="pricing-section">
          <h2>Pricing</h2>
          <p>Pilih paket yang sesuai dengan kebutuhan Anda.</p>
        </section>
        <section className="docs-section">
          <h2>Docs</h2>
          <p>Pelajari cara menggunakan Onsite dengan dokumentasi lengkap kami.</p>
        </section>
        <section className="contact-section">
          <h2>Contact</h2>
          <p>Hubungi kami untuk dukungan atau pertanyaan.</p>
        </section>
      </main>
      <footer className="home-footer">
        <p>© 2025 Onsite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import GoogleLogin from '../components/Auth/GoogleLogin';
import ComponentEditor from '../components/Editor/ComponentEditor';
import LivePreview from '../components/Preview/LivePreview';
import NavMenu from '../components/Navigation/NavMenu';
import FeatureCard from '../components/FeatureCard/FeatureCard';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth0();
  const [htmlCode, setHtmlCode] = useState('<h1>Hello World</h1>');
  const [cssCode, setCssCode] = useState('h1 { color: #ffffff; }');
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
        <NavMenu />
        <GoogleLogin />
      </header>
      <main className="home-main">
        <section className="hero-section">
          <h1>Onsite: Frontend Creation Made Simple</h1>
          <p>
            Powered by advanced AI, Onsite enables you to craft modern, responsive websites with ease. Edit HTML, CSS, and JavaScript in real-time and see your vision come to life.
          </p>
          <Link to={isAuthenticated ? '/editor' : '/login'} className="hero-cta">
            {isAuthenticated ? 'Start Building Now' : 'Sign In to Begin'}
          </Link>
        </section>
        <section className="feature-section">
          <div className="feature-header">
            <h2>Why Choose Onsite?</h2>
            <p>Discover the powerful features that make Onsite the go-to choice for frontend development.</p>
          </div>
          <ul className="feature-list">
            <FeatureCard
              icon={/* SVG for Real-Time Editing */}
              title="Real-Time Editing"
              description="Modify HTML, CSS, and JavaScript with instant previews to see changes as you code."
            />
            <FeatureCard
              icon={/* SVG for No Coding Barriers */}
              title="No Coding Barriers"
              description="Intuitive interface allows beginners and pros alike to build stunning websites."
            />
            <FeatureCard
              icon={/* SVG for Responsive Output */}
              title="Responsive Output"
              description="Create websites that look great on any device, from phones to desktops."
            />
          </ul>
        </section>
        <section className="code-playground" id="generator">
          <div className="playground-header">
            <h2>Build Your Website Now</h2>
            <p>Edit code, preview instantly, and refine your design in one seamless workflow.</p>
          </div>
          <ComponentEditor
            htmlCode={htmlCode}
            cssCode={cssCode}
            jsCode={jsCode}
            onHtmlChange={setHtmlCode}
            onCssChange={setCssCode}
            onJsChange={setJsCode}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <LivePreview
            html={htmlCode}
            css={cssCode}
            js={jsCode}
          />
        </section>
      </main>
      <footer className="home-footer">
        <p>© 2025 Onsite. All rights reserved.</p>
        <a href="mailto:support@onsite.com" className="footer-link">Contact Support</a>
      </footer>
    </div>
  );
};

export default Home;
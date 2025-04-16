import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ComponentEditor from '../components/Editor/ComponentEditor';
import LivePreview from '../components/Preview/LivePreview';
import NavMenu from '../components/Navigation/NavMenu';
import FeatureCard from '../components/FeatureCard/FeatureCard';
import AIGenerator from '../components/Generator/AIGenerator';
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
        <NavMenu />
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
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                </svg>
              }
              title="Real-Time Editing"
              description="Modify HTML, CSS, and JavaScript with instant previews to see changes as you code."
            />
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="18" cy="18" r="3" />
                  <path d="M6 21V9a9 9 0 0 0 9 9" />
                </svg>
              }
              title="No Coding Barriers"
              description="Intuitive interface allows beginners and pros alike to build stunning websites."
            />
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                </svg>
              }
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
          <LivePreview
            html={htmlCode}
            css={cssCode}
            js={jsCode}
          />
          <AIGenerator
            htmlCode={htmlCode}
            cssCode={cssCode}
            jsCode={jsCode}
            onHtmlChange={setHtmlCode}
            onCssChange={setCssCode}
            onJsChange={setJsCode}
            activeTab={activeTab}
            onTabChange={setActiveTab}
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
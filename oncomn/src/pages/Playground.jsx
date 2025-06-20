import React from 'react';
import AIGenerator from '../components/Generator/AIGenerator';
import LivePreview from '../components/Preview/LivePreview';
import NavMenu from '../components/Navigation/NavMenu';
import './Home.css'; // Anda bisa menggunakan styling yang sama atau membuat yang baru

const Playground = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <NavMenu />
      </header>
      <main className="home-main">
        <section className="code-playground" id="aipreview">
          <div className="playground-header">
            <h2>Build Your Website Now</h2>
            <p>Edit code, preview instantly, and refine your design in one seamless workflow.</p>
          </div>
          <LivePreview />
        </section>
        <section className="code-playground" id="generator">
          <AIGenerator />
        </section>
      </main>
      <footer className="home-footer">
        <p>© 2025 Oncomn. All rights reserved.</p>
        <a href="mailto:support@oncomn.com" className="footer-link">Contact Support</a>
      </footer>
    </div>
  );
};

export default Playground;
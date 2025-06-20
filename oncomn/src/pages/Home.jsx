import React from 'react';
import { Link } from 'react-router-dom';
import NavMenu from '../components/Navigation/NavMenu';
import FeatureCard from '../components/FeatureCard/FeatureCard';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <NavMenu />
      </header>
      <main className="home-main">
        <section className="hero-section">
          <h1>Oncomn: Frontend Creation Made Simple</h1>
          <p>
            Powered by advanced AI, Oncomn enables you to craft modern, responsive websites with ease. Edit HTML, CSS, and JavaScript in real-time and see your vision come to life.
          </p>
          <Link to="/playground" className="hero-cta">
            Start Building Now
          </Link>
        </section>
        <section className="feature-section">
          <div className="feature-header">
            <h2>Why Choose Oncomn?</h2>
            <p>Discover the powerful features that make Oncomn the go-to choice for frontend development.</p>
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
      </main>
      <footer className="home-footer">
        <p>© 2025 Oncomn. All rights reserved.</p>
        <a href="mailto:support@oncomn.com" className="footer-link">Contact Support</a>
      </footer>
    </div>
  );
};

export default Home;
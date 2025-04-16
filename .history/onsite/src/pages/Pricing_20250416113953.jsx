import React from 'react';
import './Pricing.css';
import NavMenu from '../components/Navigation/NavMenu';

const Pricing = () => {
  return (
    <div className="pricing-page">
      <NavMenu />
      <header className="home-header">
        <NavMenu />
      </header>
      <h1>Flexible Pricing Plans</h1>
      <div className="pricing-cards">
        <div className="pricing-card">
          <h2>Starter</h2>
          <div className="price">Free</div>
          <ul>
            <li>Basic component library</li>
            <li>Community support</li>
            <li>5 projects limit</li>
          </ul>
          <button className="cta-button">Get Started</button>
        </div>
        
        <div className="pricing-card popular">
          <div className="popular-badge">Most Popular</div>
          <h2>Pro</h2>
          <div className="price">$29<span>/month</span></div>
          <ul>
            <li>Full component library</li>
            <li>Priority support</li>
            <li>Unlimited projects</li>
            <li>AI Code Generation</li>
          </ul>
          <button className="cta-button">Go Pro</button>
        </div>
        
        <div className="pricing-card">
          <h2>Enterprise</h2>
          <div className="price">Custom</div>
          <ul>
            <li>Dedicated support</li>
            <li>Team collaboration</li>
            <li>Custom components</li>
            <li>SSO & Security</li>
          </ul>
          <button className="cta-button">Contact Sales</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
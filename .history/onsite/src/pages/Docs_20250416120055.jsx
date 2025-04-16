import React from 'react';
import NavMenu from '../components/Navigation/NavMenu';
import './Docs.css';

const Docs = () => {
  return (
    <div className="docs-page">
      <NavMenu />
      <aside className="docs-sidebar">
        <h3>Documentation</h3>
        <nav>
          <ul>
            <li><a href="#getting-started">Getting Started</a></li>
            <li><a href="#components">Components</a></li>
            <li><a href="#api">API Reference</a></li>
            <li><a href="#deployment">Deployment</a></li>
          </ul>
        </nav>
      </aside>
      
      <main className="docs-content">
        <section id="getting-started">
          <h2>Getting Started</h2>
          <p>Learn how to quickly set up and start using Onsite in your projects.</p>
          {/* Add more content */}
        </section>
        
        <section id="components">
          <h2>Components Guide</h2>
          <p>Explore our comprehensive component library and usage examples.</p>
          {/* Add more content */}
        </section>
        
        <section id="api">
          <h2>API Reference</h2>
          <p>Detailed documentation for all available API endpoints.</p>
          {/* Add more content */}
        </section>
        
        <section id="deployment">
          <h2>Deployment</h2>
          <p>Step-by-step guides for deploying your Onsite projects.</p>
          {/* Add more content */}
        </section>
      </main>
    </div>
  );
};

export default Docs;
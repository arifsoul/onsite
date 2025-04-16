import React from 'react';
import NavMenu from '../components/Navigation/NavMenu';
import './Docs.css';

const Docs = () => {
  return (
    <div className="docs-page">
      <header className="docs-header">
        <NavMenu />
        <h1>Onsite Documentation</h1>
      </header>
      
      <div className="docs-container">
        <aside className="docs-sidebar">
          <nav>
            <h3>Contents</h3>
            <ul>
              <li><a href="#getting-started">Getting Started</a></li>
              <li><a href="#core-concepts">Core Concepts</a></li>
              <li><a href="#component-library">Component Library</a></li>
              <li><a href="#api-reference">API Reference</a></li>
              <li><a href="#deployment">Deployment</a></li>
              <li><a href="#troubleshooting">Troubleshooting</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </nav>
        </aside>

        <main className="docs-main">
          <section id="getting-started" className="docs-section">
            <h2>Getting Started</h2>
            <div className="section-content">
              <h3>Installation</h3>
              <pre><code>npm install onsite-ui --save</code></pre>
              
              <h3>Project Setup</h3>
              <p>Create a new React application and import Onsite components:</p>
              <pre>{`import { ComponentEditor, LivePreview } from 'onsite-ui';`}</pre>

              <h3>Configuration</h3>
              <p>Create a .env file with your API credentials:</p>
              <pre>{`REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_auth_domain`}</pre>
            </div>
          </section>

          <section id="core-concepts" className="docs-section">
            <h2>Core Concepts</h2>
            <div className="section-content">
              <h3>Real-Time Editing</h3>
              <p>Onsite's dual-pane interface allows simultaneous code editing and live previewing...</p>
              
              <h3>Component Architecture</h3>
              <p>Learn about our modular component structure and how to extend base components...</p>
            </div>
          </section>

          <section id="component-library" className="docs-section">
            <h2>Component Library</h2>
            <div className="section-content">
              <h3>ComponentEditor</h3>
              <p>Props:</p>
              <ul>
                <li><code>language</code> (string): 'html' | 'css' | 'js'</li>
                <li><code>defaultValue</code> (string): Initial code content</li>
                <li><code>onChange</code> (function): Code change handler</li>
              </ul>
              
              <h3>LivePreview</h3>
              <p>Props:</p>
              <ul>
                <li><code>html</code> (string): HTML content to preview</li>
                <li><code>css</code> (string): CSS styles</li>
                <li><code>js</code> (string): JavaScript code</li>
              </ul>
            </div>
          </section>

          <section id="api-reference" className="docs-section">
            <h2>API Reference</h2>
            <div className="section-content">
              <h3>POST /api/render</h3>
              <p>Compile and return rendered HTML:</p>
              <pre>{`{
  "html": "<div>...</div>",
  "css": ".class {...}",
  "js": "function() {...}"
}`}</pre>
              
              <h3>GET /api/projects</h3>
              <p>Retrieve user projects:</p>
              <pre>{`[
  { "id": 1, "name": "Project 1", "createdAt": "2025-04-16" }
]`}</pre>
            </div>
          </section>

          <section id="deployment" className="docs-section">
            <h2>Deployment</h2>
100|             <div className="section-content">
101|               <h3>Static Hosting</h3>
102|               <pre><code>npm run build && deploy --target production</code></pre>
103|
104|               <h3>CI/CD Pipeline</h3>
105|               <p>Example GitHub Actions configuration:</p>
106|               <pre>{`name: Deploy
107| on: [push]
108| jobs:
109|   build:
110|     runs-on: ubuntu-latest
111|     steps:
112|       - uses: actions/checkout@v2
113|       - run: npm install
114|       - run: npm run build
115|       - uses: hosting-platform/deploy-action@v1`}</pre>
116|             </div>
117|           </section>
118|
119|           <section id="faq" className="docs-section">
120|             <h2>Frequently Asked Questions</h2>
121|             <div className="faq-content">
122|               <div className="faq-item">
123|                 <h3>How do I handle authentication?</h3>
124|                 <p>Onsite integrates with Auth0 for secure authentication. Configure your .env file with:</p>
125|                 <pre>{`REACT_APP_AUTH0_DOMAIN=your-domain
126| REACT_APP_AUTH0_CLIENT_ID=your-client-id`}</pre>
127|               </div>
128|
129|               <div className="faq-item">
130|                 <h3>Can I use custom CSS frameworks?</h3>
131|                 <p>Yes! Import your preferred CSS framework in the main App component:</p>
132|                 <pre>{`import 'bootstrap/dist/css/bootstrap.min.css';`}</pre>
133|               </div>
134|
135|               <div className="faq-item">
136|                 <h3>How to resolve deployment errors?</h3>
137|                 <p>Common solutions:</p>
138|                 <ul>
139|                   <li>Verify environment variables</li>
140|                   <li>Check CORS configuration</li>
141|                   <li>Ensure build script completes successfully</li>
142|                 </ul>
143|               </div>
144|
145|               <div className="faq-item">
146|                 <h3>Browser compatibility?</h3>
147|                 <p>Onsite supports all modern browsers (Chrome, Firefox, Safari, Edge) with IE11 polyfills available.</p>
148|               </div>
149|             </div>
150|           </section>
151|         </main>
152|       </div>
153|     </div>
  );
};

export default Docs;
import React, { useState } from 'react';
import NavMenu from '../components/Navigation/NavMenu';
import { FaCopy } from 'react-icons/fa';
import './Docs.css';

// Komponen untuk blok kode dengan tombol copy
const CodeBlock = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <pre><code>{children}</code></pre>
      <button onClick={handleCopy} className="copy-btn" aria-label="Copy code">
        {copied ? 'Copied!' : <FaCopy />}
      </button>
    </div>
  );
};

const Docs = () => {
  return (
    <div className="docs-page">
      <header className="home-header">
        <NavMenu />
      </header>
      <div className="docs-container">
        <aside className="docs-sidebar">
          <nav>
            <h3>Dokumentasi</h3>
            <ul>
              <li><a href="#getting-started">Memulai</a></li>
              <li><a href="#core-concepts">Konsep Inti</a></li>
              <li><a href="#api-reference">Referensi API</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </nav>
        </aside>

        <main className="docs-main">
          <div className="docs-intro">
            <h1>Dokumentasi Onsite</h1>
            <p>Panduan lengkap untuk membantu Anda mengintegrasikan dan menggunakan platform Onsite.</p>
          </div>
          <section id="getting-started" className="docs-section">
            <h2>Memulai</h2>
            <div className="section-content">
              <h3>Instalasi</h3>
              <p>Tambahkan Onsite ke proyek Anda menggunakan npm.</p>
              <CodeBlock>npm install onsite-ai --save</CodeBlock>
              
              <h3>Konfigurasi</h3>
              <p>Buat file `.env` di root proyek Anda dengan kredensial API berikut:</p>
              <CodeBlock>{`VITE_AUTH0_DOMAIN=your_auth_domain
              VITE_AUTH0_CLIENT_ID=your_client_id
              VITE_OPENROUTER_API_KEY=your_api_key`}</CodeBlock>
            </div>
          </section>

          {/* Sisa seksi lainnya mengikuti pola yang sama */}

        </main>
      </div>
    </div>
  );
};

export default Docs;
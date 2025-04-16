import { useAuth0 } from '@auth0/auth0-react';
import AIGenerator from '../components/Generator/AIGenerator';
import GoogleLogin from '../components/Auth/GoogleLogin';
import LivePreview from '../components/Preview/LivePreview';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth0();

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
          <h2>Buat UI Impian Anda dengan AI</h2>
          <p>
            Masukkan deskripsi, dan biarkan Onsite menghasilkan kode frontend yang siap digunakan. 
            {isAuthenticated ? (
              <Link to="/editor">Edit lebih lanjut di editor visual</Link>
            ) : (
              <Link to="/login">Login untuk fitur pengeditan lanjutan</Link>
            )}.
          </p>
        </section>
        <section className="generator-section">
          <div className="card">
            <h3>Generator Kode</h3>
            <AIGenerator />
          </div>
          <div className="card">
            <h3>Pratinjau Langsung</h3>
            <LivePreview />
          </div>
        </section>
        <section className="cta-section">
          {isAuthenticated ? (
            <Link to="/editor" className="cta-button">
              Buka Editor Visual
            </Link>
          ) : (
            <p>
              <Link to="/login" className="cta-button secondary">
                Login untuk Mengedit
              </Link>
            </p>
          )}
        </section>
      </main>
      <footer className="home-footer">
        <p>&copy; 2025 Onsite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
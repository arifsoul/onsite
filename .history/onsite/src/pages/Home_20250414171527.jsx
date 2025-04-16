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
          <h2>Revolusi Pengembangan Frontend Anda</h2>
          <p>
            Onsite memberdayakan pengembang untuk menciptakan antarmuka pengguna yang indah dan fungsional dengan bantuan AI. 
            Mulai dari ide hingga kode dalam hitungan detik.
          </p>
          <Link to={isAuthenticated ? '/editor' : '/login'} className="hero-cta">
            {isAuthenticated ? 'Mulai Mengedit Sekarang' : 'Login untuk Memulai'}
          </Link>
        </section>
        <section className="features-section">
          <div className="card description-card">
            <h3>Kenapa Onsite?</h3>
            <p>
              Onsite menggabungkan kecerdasan buatan dan pengembangan frontend untuk menghasilkan kode React yang bersih dan responsif.
            </p>
            <ul>
              <li>Generate kode dengan cepat dan akurat.</li>
              <li>Edit komponen secara visual.</li>
              <li>Integrasi mudah dengan proyek Anda.</li>
            </ul>
          </div>
          <div className="card generator-card">
            <h3>Prompt Generator</h3>
            <AIGenerator />
          </div>
          <div className="card preview-card">
            <h3>Preview Kode</h3>
            <LivePreview />
          </div>
        </section>
      </main>
      <footer className="home-footer">
        <p>© 2025 Onsite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
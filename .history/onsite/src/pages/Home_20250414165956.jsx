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
          <h2>Ciptakan Antarmuka Modern dengan Kekuatan AI</h2>
          <p>
            Onsite memungkinkan Anda menghasilkan kode frontend berkualitas tinggi hanya dengan deskripsi sederhana. 
            Transformasikan ide Anda menjadi kenyataan dengan cepat dan efisien.
          </p>
          <Link to={isAuthenticated ? '/editor' : '/login'} className="hero-cta">
            {isAuthenticated ? 'Mulai Mengedit' : 'Login untuk Memulai'}
          </Link>
        </section>
        <section className="features-section">
          <div className="card description-card">
            <h3>Tentang Onsite</h3>
            <p>
              Onsite adalah platform inovatif yang memanfaatkan kecerdasan buatan untuk merancang dan menghasilkan antarmuka pengguna secara instan. 
              Dengan teknologi DeepSeek, kami menyediakan solusi cepat untuk pengembang dan desainer, memungkinkan pembuatan komponen React yang responsif tanpa coding manual. 
              Baik Anda membangun prototipe atau aplikasi produksi, Onsite mempercepat alur kerja Anda dengan hasil yang profesional.
            </p>
          </div>
          <div className="card generator-card">
            <h3>Generate Kode</h3>
            <AIGenerator />
          </div>
          <div className="card preview-card">
            <h3>Pratinjau Langsung</h3>
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
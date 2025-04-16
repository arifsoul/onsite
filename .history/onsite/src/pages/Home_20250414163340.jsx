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
      <header>
        <h1>Onsite - AI-Powered Frontend Generator</h1>
        <GoogleLogin />
      </header>
      <main>
        <AIGenerator />
        <div className="preview-container">
          <h2>Pratinjau</h2>
          <LivePreview />
        </div>
        {isAuthenticated ? (
          <Link to="/editor" className="editor-link">
            Buka Editor untuk Mengedit Komponen
          </Link>
        ) : (
          <p>
            <Link to="/login">Login</Link> untuk mengedit komponen secara visual di editor.
          </p>
        )}
      </main>
    </div>
  );
};

export default Home;
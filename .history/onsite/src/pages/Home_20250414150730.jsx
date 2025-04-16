import AIGenerator from '../components/Generator/AIGenerator';
import GoogleLogin from '../components/Auth/GoogleLogin';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header>
        <h1>Onsite - AI-Powered Frontend Generator</h1>
        <GoogleLogin />
      </header>
      <main>
        <AIGenerator />
      </main>
    </div>
  );
};

export default Home;
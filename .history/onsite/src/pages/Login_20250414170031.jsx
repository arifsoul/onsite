import GoogleLogin from '../components/Auth/GoogleLogin';
import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <header className="login-header">
        <div className="logo">
          <h1>Onsite</h1>
          <span>AI-Powered Frontend Generator</span>
        </div>
        <GoogleLogin />
      </header>
      <main className="login-main">
        <section className="login-section">
          <div className="card login-card">
            <h2>Login ke Onsite</h2>
            <p>
              Masuk dengan akun Google Anda untuk mengakses editor visual dan fitur pengeditan lanjutan.
            </p>
            <GoogleLogin />
          </div>
        </section>
      </main>
      <footer className="login-footer">
        <p>© 2025 Onsite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
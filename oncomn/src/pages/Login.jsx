import React from 'react';
import NavMenu from '../components/Navigation/NavMenu';
import GoogleLogin from '../components/Auth/GoogleLogin';
import './Login.css';

const Login = () => {
  return (
    <div className="login-page-container">
      <header className="home-header">
        <NavMenu />
      </header>
      <main className="login-main">
        <div className="login-card">
          <div className="login-header">
            <h1>Selamat Datang Kembali</h1>
            <p>Masuk untuk mulai membuat komponen web impian Anda.</p>
          </div>
          <div className="login-provider">
            <GoogleLogin />
          </div>
          <div className="login-footer">
            <p>Dengan masuk, Anda setuju dengan Syarat & Ketentuan dan Kebijakan Privasi kami.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
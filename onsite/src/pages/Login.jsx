import React from 'react';
import NavMenu from '../components/Navigation/NavMenu';

function Login() {
  return (
    <div className="login-page">
      <header className="home-header">
        <NavMenu />
      </header>
      <h1>Login Page</h1>
      {/* Add login form components here */}
    </div>
  );
}

export default Login;
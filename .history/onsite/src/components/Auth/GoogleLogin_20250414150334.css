import { useAuth0 } from '@auth0/auth0-react';
import { FaGoogle } from 'react-icons/fa';
import './GoogleLogin.css';

const GoogleLogin = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();

  if (isAuthenticated) {
    return (
      <div className="user-info">
        <img src={user.picture} alt={user.name} />
        <span>{user.name}</span>
      </div>
    );
  }

  return (
    <button
      className="google-login-btn"
      onClick={() => loginWithRedirect({ connection: 'google-oauth2' })}
    >
      <FaGoogle /> Login dengan Google
    </button>
  );
};

export default GoogleLogin;
import { useAuth0 } from '@auth0/auth0-react';
import { FaGoogle } from 'react-icons/fa';
import './GoogleLogin.css';

const GoogleLogin = () => {
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();

  return (
    <div>
      {isAuthenticated ? (
        <div className="user-info">
          <img src={user?.picture} alt={user?.name} />
          <span>{user?.name}</span>
          <button
            className="logout-btn"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          className="google-login-btn"
          onClick={() => loginWithRedirect({ connection: 'google-oauth2' })}
        >
          <FaGoogle /> Login dengan Google
        </button>
      )}
    </div>
  );
};

export default GoogleLogin;
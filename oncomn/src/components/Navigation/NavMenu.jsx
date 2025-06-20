import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './NavMenu.css';

const NavMenu = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="nav-menu">
      <div className="nav-logo">
        <Link to="/" onClick={closeMenu}>Oncomn</Link>
      </div>

      <button
        className={`hamburger-menu ${menuOpen ? 'active' : ''}`}
        onClick={handleToggleMenu}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li className="nav-item">
          <Link to="/" className="nav-link" onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/pricing" className="nav-link" onClick={closeMenu}>
            Pricing
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/docs" className="nav-link" onClick={closeMenu}>
            Docs
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/contact" className="nav-link" onClick={closeMenu}>
            Contact
          </Link>
        </li>
        <li className="nav-item auth-item">
          {isAuthenticated ? (
            <div className="user-profile">
              <img src={user.picture} alt={user.name} className="user-avatar" />
              <button
                className="auth-button logout-button"
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              >
                Log Out
              </button>
            </div>
          ) : (
            <button className="auth-button login-button" onClick={() => loginWithRedirect()}>
              Log In
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavMenu;
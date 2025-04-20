import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleLogin from '../Auth/GoogleLogin';
import './NavMenu.css';

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="nav-container">
      <nav className={`nav-menu ${isOpen ? 'open' : ''}`}>
        <div className="nav-logo">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <h1>Onsite</h1>
          </Link>
        </div>
        <button className="hamburger" onClick={toggleMenu} aria-label={isOpen ? 'Close menu' : 'Open menu'}>
          <span className="hamburger-icon"></span>
        </button>
        <ul className={isOpen ? 'open' : ''}>
          {isOpen && (
            <button className="close-menu" onClick={toggleMenu} aria-label="Close menu">
              ×
            </button>
          )}
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/pricing" onClick={() => setIsOpen(false)}>
              Pricing
            </Link>
          </li>
          <li>
            <Link to="/docs" onClick={() => setIsOpen(false)}>
              Docs
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </li>
          <li className="nav-login">
            <Link to="/login" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavMenu;
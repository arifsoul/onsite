import React from 'react';
import { Link } from 'react-router-dom';

const NavMenu = () => {
  return (
    <nav className="nav-menu">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/features">Features</Link></li>
        <li><Link to="/pricing">Pricing</Link></li>
        <li><Link to="/docs">Docs</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
};

export default NavMenu;
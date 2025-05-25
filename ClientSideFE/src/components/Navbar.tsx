// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                <span className="logo-red">L</span>ucky<span className="logo-red">V</span>egas
            </div>
            <ul className="nav-links">
                <li><Link to="/games">Games</Link></li>
                <li><Link to="/guides">Guides</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
            <a href="#" className="signup-btn">Sign Up</a>
        </nav>
    );
};

export default Navbar;

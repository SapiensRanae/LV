// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                <li><Link to="/"><span className="logo-red">L</span>ucky<span className="logo-red">V</span>egas</Link></li>

            </div>
            <div className="navbar-center">
            <ul className="nav-links">
                <li><Link to="/games">Games</Link></li>
                <li><Link to="/guides">Guides</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/FAQ">FAQ</Link></li>
            </ul>
            </div>
            <a href="#" className="signup-btn">Sign Up</a>
        </nav>
    );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
    onGamesClick: () => void;
    onSignupClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onGamesClick, onSignupClick}) => (
    <nav className="navbar">
        <div className="logo">
            <li>
                <Link to="/">
                    <span className="logo-red">L</span>ucky
                    <span className="logo-red">V</span>egas
                </Link>
            </li>
        </div>
        <div className="navbar-center">
            <ul className="nav-links">
                <li><button onClick={onGamesClick} className="nav-link-button">
                    Games
                </button></li>
                <li><Link to="/guides">Guides</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/FAQ">FAQ</Link></li>
            </ul>
        </div>
        <button onClick={onSignupClick} className={"nav-signup-button"}>Sign Up</button>
    </nav>
);

export default Navbar;

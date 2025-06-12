import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Profile from '../assets/profile.png';

interface NavbarProps {
    onGamesClick: () => void;
    onSignupClick: () => void;
    isSignedIn: boolean;
    onProfileClick: () => void;
    onSubscriptionClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onGamesClick, onSignupClick, isSignedIn, onProfileClick, onSubscriptionClick}) => (
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
        {isSignedIn ? (
            <div className="infoPart">
                <button onClick={onProfileClick} className="nav-profile-button">
                    <img src={Profile} alt={"Profile"}></img>
                </button>
                <button onClick={onSubscriptionClick} className="subscription">
                    Standard
                </button>
            </div>
        ) : (
            <button onClick={onSignupClick} className="nav-signup-button">Sign Up</button>
        )}
    </nav>
);

export default Navbar;

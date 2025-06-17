import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './Navbar.css';
import Profile from '../assets/profile.png';
import Coin from '../assets/coin.png';

interface NavbarProps {
    onGamesClick: () => void;
    onSignupClick: () => void;
    isSignedIn: boolean;
    onProfileClick: () => void;
    onSubscriptionClick: () => void;
    onBalanceClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onGamesClick, onSignupClick, isSignedIn, onProfileClick, onSubscriptionClick, onBalanceClick}) => {
    const { user } = useUser();
    return (
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
                <li><button onClick={onGamesClick} className="nav-link-button">Games</button></li>
                <li><Link to="/guides">Guides</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/FAQ">FAQ</Link></li>
            </ul>
        </div>
        {isSignedIn ? (
            <div className="infoPart">
                <label className="nav-balance" onClick={onBalanceClick}>
                    {user ? user.balance : 0} <img src={Coin} alt='Coins'/>
                </label>
                <button onClick={onProfileClick} className="nav-profile-button">
                    <img src={user && user.userIcon ? user.userIcon : Profile} alt="Profile"/>
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
}
export default Navbar;

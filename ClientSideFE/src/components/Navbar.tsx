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
    <nav className={user?.role === 'vip' ? "navbar-vip" : "navbar"}>
        <div className="logo">
            <li>
                <Link to="/">
                    <span className={user?.role === 'vip' ? "logo-vip" : "logo-red"}>L</span>ucky
                    <span className={user?.role === 'vip' ? "logo-vip" : "logo-red"}>V</span>egas
                </Link>
            </li>
        </div>
        <div className="navbar-center">
            <ul className={user?.role === 'vip' ? "nav-links-vip" : "nav-links"}>
                <li><button onClick={onGamesClick} className={user?.role === 'vip' ? "nav-link-button-vip" : "nav-link-button"}>Games</button></li>
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
                <button onClick={onSubscriptionClick}
                        className={user?.role === 'vip' ? "subscriptionVIP" : "subscription"}>
                    {user?.role === 'vip' ? 'VIP' : 'Standard'}
                </button>
            </div>
        ) : (
            <button onClick={onSignupClick} className="nav-signup-button">Sign Up</button>
        )}
    </nav>
);
}
export default Navbar;

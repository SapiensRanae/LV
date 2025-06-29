import React, { useState } from 'react';
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

const Navbar: React.FC<NavbarProps> = ({
                                           onGamesClick,
                                           onSignupClick,
                                           isSignedIn,
                                           onProfileClick,
                                           onSubscriptionClick,
                                           onBalanceClick
                                       }) => {
    const { user } = useUser();
    const isVip = user?.role === 'vip';
    const [menuOpen, setMenuOpen] = useState(false);

    // Close menu on navigation (mobile)
    const handleNavClick = (cb?: () => void) => {
        setMenuOpen(false);
        if (cb) cb();
    };

    return (
        <nav className={isVip ? "navbar-vip" : "navbar"}>
            <button
                className="hamburger"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(m => !m)}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect y="4" width="24" height="2" rx="1" fill="#FFFFFF"/>
                    <rect y="11" width="24" height="2" rx="1" fill="#FFFFFF"/>
                    <rect y="18" width="24" height="2" rx="1" fill="#FFFFFF"/>
                </svg>
            </button>
            <div className="logo">
                <li>
                    <Link to="/" onClick={() => setMenuOpen(false)}>
                        <span className={isVip ? "logo-vip" : "logo-red"}>L</span>
                        <span className="logo-rest">ucky</span>
                        <span className={isVip ? "logo-vip" : "logo-red"}>V</span>
                        <span className="logo-rest">egas</span>
                    </Link>
                </li>
            </div>
            <div className={`navbar-center${menuOpen ? ' open' : ''}`}>
                <ul className={isVip ? "nav-links-vip" : "nav-links"}>
                    <li>
                        <button
                            onClick={onGamesClick}
                            className={isVip ? "nav-link-button-vip" : "nav-link-button"}
                        >
                            Games
                        </button>
                    </li>
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
                    <button
                        onClick={onSubscriptionClick}
                        className={isVip ? "subscriptionVIP" : "subscription"}
                    >
                        {isVip ? 'VIP' : 'Standard'}
                    </button>
                </div>
            ) : (
                <button onClick={onSignupClick} className="nav-signup-button">Sign Up</button>
            )}
            {/* Mobile menu overlay */}
            {menuOpen && (
                <div
                    className="mobile-menu-overlay"
                    onClick={() => setMenuOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 99,
                        background: 'rgba(0,0,0,0.2)'
                    }}
                />
            )}
        </nav>
    );
};

export default Navbar;
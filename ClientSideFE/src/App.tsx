// src/App.tsx
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Games from './pages/Games';
import Guides from './pages/Guides';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import CookiePolicy from './pages/CookiePolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RegistrationModal from './components/RegistrationModal'
import LoginModal from './components/LoginModal';
import TransactionsModal from "./components/TransactionsModal";
import Profile from './pages/Profile';
import { useLocation } from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
    React.useEffect(() => {
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 100);
    }, []);

    const location = useLocation();

    const [isSignedIn, setIsSignedIn] = React.useState(true);
    const [showRegModal, setShowRegModal] = React.useState(false);
    const [showLogModal, setShowLogModal] = React.useState(false);
    const [showTransactionModal, setShowTransactionModal] = React.useState(false);
    const navigate = useNavigate();
    const onProfilePage = location.pathname === '/profile';

    const handleSubscriptionClick = () => {
        setShowTransactionModal(true);
    }

    const handleProfileClick = () => {
        navigate('/profile');
    }

    const handleGamesClick = () => {
        if (isSignedIn) {
            navigate('/games');
        } else {
            setShowRegModal(true);
        }
    };

    const handleSignupClick = () => {
        setShowRegModal(true);
    };

    const handleRegisterSuccess = () => {
        setIsSignedIn(true);
        setShowRegModal(false);
    };

    const handleLoginPress = () => {
        setShowRegModal(false);
        setShowLogModal(true);
        };

    const handleRegisterPress = () => {
        setShowRegModal(true);
        setShowLogModal(false);
    };

    const handleLoginSuccess = () => {
        setIsSignedIn(true);
        setShowLogModal(false);
        };

    return (
        <>
            <Navbar
                onGamesClick={handleGamesClick}
                onSignupClick={handleSignupClick}
                isSignedIn={isSignedIn}
                onProfileClick={handleProfileClick}
                onSubscriptionClick={handleSubscriptionClick}/>

            {showRegModal && (
                <RegistrationModal
                    onClose={() => setShowRegModal(false)}
                    onRegisterSuccess={handleRegisterSuccess}
                    onLoginPress={handleLoginPress}
                />
            )}

            {showLogModal && (
                <LoginModal
                    onClose={() => setShowLogModal(false)}
                    onLoginSuccess={handleLoginSuccess}
                    onRegisterClick={handleRegisterPress}
                    />
                )}

            {showTransactionModal && (
                <TransactionsModal
                    onClose={() => setShowTransactionModal(false)}
                    />
            )}

            {onProfilePage ? (<Profile />
            ) : (
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {isSignedIn && <Route path="/games" element={<Games />} />}
                        <Route path="/guides" element={<Guides />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/cookie-policy" element={<CookiePolicy />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    </Routes>
                </div>
            )}

            {!onProfilePage && <Footer />}
        </>
    );
};

export default App;

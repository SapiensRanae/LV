import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
import PaymentModal from "./components/PaymentModal";
import Profile from './pages/Profile';
import { useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import './App.css';

const App: React.FC = () => {
    useEffect(() => {
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 100);
    }, []);

    const [isAuthenticated] = React.useState(true);
    //const { isAuthenticated, logout } = useAuth();

    const location = useLocation();

    const [showRegModal, setShowRegModal] = React.useState(false);
    const [showLogModal, setShowLogModal] = React.useState(false);
    const [showPaymentModal, setShowPaymentModal] = React.useState(false);
    const [showTransactionModal, setShowTransactionModal] = React.useState(false);
    const navigate = useNavigate();
    const onProfilePage = location.pathname === '/profile';
    const onSlotsPage = location.pathname === '/games/slots';
    const onRoulettePage = location.pathname === '/games/roulette';
    const onPokerPage = location.pathname === '/games/poker';
    const onBlackjackPage = location.pathname === '/games/blackjack';

    const handleBuying = () => {
        setShowTransactionModal(false);
        setShowPaymentModal(true);
    }

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
    }

    const handleBuyVIPClick = () => {
        setShowTransactionModal(true);
    }

    const handleSubscriptionClick = () => {
        setShowTransactionModal(true);
    }

    const handleProfileClick = () => {
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            setShowLogModal(true);
        }
    }

    const handleGamesClick = () => {
        if (isAuthenticated) {
            navigate('/games');
        } else {
            setShowRegModal(true);
        }
    };

    const handleSignupClick = () => {
        setShowRegModal(true);
    };

    const handleRegisterSuccess = () => {
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
        setShowLogModal(false);
    };

    const handleLogoutClick = () => {
        logout();
        navigate('/');
    }

    return (
        <UserProvider>
            <Navbar
                onGamesClick={() => navigate('/games')}
                onSignupClick={handleSignupClick}
                isSignedIn={isAuthenticated}
                onProfileClick={handleProfileClick}
                onSubscriptionClick={handleSubscriptionClick}
                onBalanceClick={() => setShowTransactionModal(true)}
            />

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
                    onBuying={handleBuying}
                />
            )}

            {showPaymentModal && (
                <PaymentModal
                    onClose={() => setShowPaymentModal(false)}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}

            {onProfilePage ? (
                isAuthenticated ? (
                    <Profile onLogoutClick={handleLogoutClick}
                             onBuyVIPClick={handleBuyVIPClick}
                    />
                ) : (
                    <Navigate to="/" replace />
                )
            ) : (
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/games" element={<Games />} />
                        <Route path="/guides" element={<Guides />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/cookie-policy" element={<CookiePolicy />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    </Routes>
                </div>
            )}

            {!onProfilePage && !onSlotsPage && !onRoulettePage && !onPokerPage && !onBlackjackPage && <Footer />}
        </UserProvider>
    );
};

export default App;

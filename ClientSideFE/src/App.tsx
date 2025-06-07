// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import './App.css';

const App: React.FC = () => {
    React.useEffect(() => {
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 100);
    }, []);
    return (
        <>
            <Navbar />
            <div className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/guides" element={<Guides />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/FAQ" element={<FAQ />}/>
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                </Routes>
            </div>
            <Footer />
        </>
    );
};

export default App;

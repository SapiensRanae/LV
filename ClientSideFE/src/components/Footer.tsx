// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './Footer.css';

const Footer: React.FC = () => {
    const { user } = useUser();
    return (
        <footer className="footer">
            <div className={user?.role === 'vip' ? "footer-bg-vip" : "footer-bg"}>
                <div className="footer-content">
                    <div className="contact">
                        <h3>Contact us:</h3>
                        <label>LuckyVegas.co@gmail.com</label>
                    </div>
                    <div className="legal">
                        <h3>Legal:</h3>
                        <label><Link to="/terms">Terms & Conditions</Link></label><br/>
                        <label><Link to="/cookie-policy">Cookie Policy</Link></label><br/>
                        <label><Link to="/privacy-policy">Privacy Policy</Link></label>
                    </div>
                </div>
            </div>
            <div className={user?.role === 'vip' ? "gold-line" : "red-line"}></div>
            <div className="disclaimer">
                <p>
                    Disclaimer: Customers must be at least 21 years old. All rights reserved. LuckyVegas &copy; 2025.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

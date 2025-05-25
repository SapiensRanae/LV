// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import GoldenLine from '../assets/GoldenLine.png';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="contact">
                    <h3>Contact us:</h3>
                    <p>LuckyVegas.co@gmail.com</p>
                </div>
                <div className="legal">
                    <h3>Legal:</h3>
                    <p><Link to="/terms">Terms & Conditions</Link></p>
                    <p><Link to="/cookie-policy">Cookie Policy</Link></p>
                    <p><Link to="/privacy-policy">Privacy Policy</Link></p>
                </div>
            </div>
            <div className="disclaimer">
                <p>
                    Disclaimer: Customers must be at least 18 years old. All rights reserved. LuckyVegas &copy; 2025.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

// src/pages/Terms.tsx
import React from 'react';
import './Legal.css';

const Terms: React.FC = () => {
    return (
        <div className="legal-container">
            <h1>Terms & Conditions</h1>

            <h2>1. Introduction</h2>
            <p>Welcome to LuckyVegas. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.</p>

            <h2>2. Eligibility</h2>
            <p>You must be at least 21 years old to use our services. By accessing or using LuckyVegas, you confirm that you meet this age requirement and are legally allowed to participate in online gambling activities in your jurisdiction.</p>

            <h2>3. Account Registration</h2>
            <p>When registering an account, you must provide accurate, current, and complete information. You are solely responsible for maintaining the confidentiality of your account and password.</p>
            <p>LuckyVegas reserves the right to refuse service, terminate accounts, or cancel transactions at its discretion.</p>

            <h2>4. Rules of Conduct</h2>
            <p>Users of LuckyVegas agree not to:</p>
            <ul>
                <li>Use any automated systems or software to extract data from our website</li>
                <li>Attempt to hack, manipulate, or interfere with our services</li>
                <li>Create multiple accounts for fraudulent purposes</li>
                <li>Use our services for any illegal activities</li>
                <li>Share account access with third parties</li>
            </ul>

            <h2>5. Payment Terms</h2>
            <p>All deposits and withdrawals are subject to verification. LuckyVegas reserves the right to request proof of identity and payment methods at any time.</p>
            <p>LuckyVegas applies a 10% commission on standard accounts and 5% on VIP accounts for all withdrawals, subject to minimum and maximum withdrawal limits.</p>

            <h2>6. Game Rules</h2>
            <p>Each game on LuckyVegas has specific rules that must be followed. By participating in any game, you agree to abide by these rules, which are available on the respective game pages.</p>
            <p>In the event of a technical malfunction, LuckyVegas reserves the right to void any affected games or transactions.</p>

            <h2>7. Termination of Account</h2>
            <p>LuckyVegas may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach these Terms and Conditions.</p>

            <h2>8. Limitation of Liability</h2>
            <p>LuckyVegas and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.</p>

            <h2>9. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law principles.</p>

            <h2>10. Changes to Terms</h2>
            <p>LuckyVegas reserves the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of these Terms or by other reasonable means.</p>

            <div className="legal-notice">
                <p>Please note: LuckyVegas promotes responsible gambling. If you feel you may have a gambling problem, please seek professional help.</p>
            </div>

            <div className="legal-date">Last updated: May 15, 2025</div>
        </div>
    );
};

export default Terms;
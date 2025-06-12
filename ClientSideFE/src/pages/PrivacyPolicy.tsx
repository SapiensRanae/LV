// src/pages/PrivacyPolicy.tsx
import React from 'react';
import './Legal.css';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="legal-container">
            <h1>Privacy Policy</h1>

            <h2>1. Information We Collect</h2>
            <p>LuckyVegas collects various types of information from our users to provide a secure and personalized gaming experience:</p>
            <ul>
                <li><strong>Personal Information:</strong> Name, email address, date of birth, phone number, and address</li>
                <li><strong>Financial Information:</strong> Payment details, transaction history, and billing information</li>
                <li><strong>Technical Information:</strong> IP address, browser type, device information, and cookies</li>
                <li><strong>Game Activity:</strong> Betting patterns, game preferences, and session data</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
                <li>To verify your identity and comply with legal obligations</li>
                <li>To process payments and maintain transaction records</li>
                <li>To provide customer support and respond to inquiries</li>
                <li>To improve our website, games, and services</li>
                <li>To detect and prevent fraud, money laundering, and other illegal activities</li>
                <li>To send relevant promotional materials and updates (if you've opted in)</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>LuckyVegas does not sell your personal information to third parties. We may share your information with:</p>
            <ul>
                <li>Payment processors to facilitate transactions</li>
                <li>Regulatory authorities when required by law</li>
                <li>Service providers who help us operate our business</li>
                <li>Fraud prevention agencies to protect against illegal activities</li>
            </ul>
            <p>Any third parties with whom we share your information are contractually obligated to maintain its confidentiality and security.</p>

            <h2>4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, loss, or alteration. These include encryption, access controls, and regular security assessments.</p>
            <p>While we take all reasonable steps to protect your information, no online transmission or electronic storage method is 100% secure.</p>

            <h2>5. Your Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul>
                <li>Access to your personal information</li>
                <li>Correction of inaccurate or incomplete information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction or objection to processing</li>
                <li>Data portability</li>
                <li>Withdrawal of consent</li>
            </ul>
            <p>To exercise any of these rights, please contact us at LuckyVegas.co@gmail.com.</p>

            <h2>6. Changes to Privacy Policy</h2>
            <p>We may update this Privacy Policy periodically to reflect changes in our practices or for legal reasons. We will notify you of significant changes by posting a notice on our website or by other appropriate means.</p>

            <h2>7. Contact Information</h2>
            <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
            <p>Email: LuckyVegas.co@gmail.com</p>

            <div className="legal-notice">
                <p>By using LuckyVegas services, you consent to the collection and use of information as described in this Privacy Policy.</p>
            </div>

            <div className="legal-date">Last updated: May 15, 2025</div>
        </div>
    );
};

export default PrivacyPolicy;
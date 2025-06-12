// src/pages/CookiePolicy.tsx
import React from 'react';
import './Legal.css';

const CookiePolicy: React.FC = () => {
    return (
        <div className="legal-container">
            <h1>Cookie Policy</h1>

            <h2>1. What Are Cookies</h2>
            <p>Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently, provide basic functionality such as remembering your preferences, and provide information to the owners of the site.</p>

            <h2>2. How We Use Cookies</h2>
            <p>At LuckyVegas, we use cookies and similar technologies for several purposes, including:</p>
            <ul>
                <li>Maintaining secure login sessions</li>
                <li>Remembering your preferences and settings</li>
                <li>Analyzing how you use our website to improve user experience</li>
                <li>Providing personalized content and advertisements</li>
                <li>Preventing fraud and ensuring the security of transactions</li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>
            <p><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic functions like page navigation, secure areas access, and game functionality. The website cannot function properly without these cookies.</p>

            <p><strong>Preference Cookies:</strong> These cookies allow us to remember your preferences such as language selection, region, and other settings.</p>

            <p><strong>Analytics Cookies:</strong> These cookies collect information about how you use our website, which pages you visited, and which links you clicked on. All of this data is aggregated and anonymous.</p>

            <p><strong>Marketing Cookies:</strong> These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share that information with other organizations such as advertisers.</p>

            <h2>4. Managing Cookies</h2>
            <p>Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, or to alert you when cookies are being sent. However, if you disable cookies, some of the features that make your site experience more efficient may not function properly.</p>

            <p>The procedures for managing cookies differ from browser to browser. You can check the support pages of your specific browser for detailed instructions:</p>
            <ul>
                <li>Chrome</li>
                <li>Firefox</li>
                <li>Safari</li>
                <li>Edge</li>
            </ul>

            <h2>5. Updates to This Policy</h2>
            <p>We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>

            <div className="legal-notice">
                <p>By continuing to use our website, you are agreeing to our use of cookies as described in this Cookie Policy.</p>
            </div>

            <div className="legal-date">Last updated: May 15, 2025</div>
        </div>
    );
};

export default CookiePolicy;
// src/pages/About.tsx
import React from 'react';
import './FAQ.css';
import './Guides.css';

const questions = [
    { title: 'About registration and account', content: [
            '♤ How do I sign up?',
            '♤ Go to the registration page, fill in the required details, and confirm your account via email or SMS.',
            '♤ What should I do if I forgot my password?',
            ' ♤ Click "Forgot Password?" on the login page and follow the instructions to reset it.',
            '♤ Is it possible to have multiple accounts?',
            ' ♤ No, creating multiple accounts is against our rules and may lead to blocking.',
            '♤ How do I change the phone number / email in my profile?',
            ' ♤ Go to your account settings and update your contact information.',
            '♤ How do I confirm my identity (verification)?',
            ' ♤ Upload a valid ID document and proof of address in the verification section of your profile.',
        ],
    },
    { title: 'About payment', content: [
            '♢ What deposit and withdrawal methods are available?',
            ' ♢ Bank cards, e-wallets, crypto, and other popular payment systems — check the list in your account.',
            "♢ Why didn't the money come to my account/card?",
            ' ♢ Processing may take time depending on the payment method. If delayed, contact support.',
            '♢ How long does it take to process a withdrawal?',
            ' ♢ Usually from a few minutes to 24 hours, depending on the method.',
            '♢ Are there any commissions on deposit or withdrawal?',
            ' ♢ Yes — 5% with a VIP subscription and 10% on the Standard version, without taking taxes into account.',
            '♢ How to cancel a withdrawal request?',
            ' ♢ Go to the "Cashier" or "Transactions" section and cancel the pending request if it’s still in progress.',
        ],
    },
    { title: 'About security and politics', content: [
            '♡ Is it safe to store data here?',
            ' ♡ Yes — we use encrypted connections and securely protect your personal data.',
            '♡ Where can I find the privacy policy and rules?',
            ' ♡ They’re available at the bottom of the website or in your account menu.',
            '♡ Can I temporarily lock my account?',
            ' ♡ Yes — contact support or use the “Self-Exclusion” option in your profile settings.',
            '♡ How do I delete an account?',
            ' ♡ Contact our support team via chat or email to request account deletion.',
        ],
    },
    { title: 'Customer service', content: [
            '♧ How do I get in touch with support?',
            ' ♧ Email us at LuckyVegas.co@gmail.com.',
            '♧ Is there 24/7 support?',
            ' ♧ Unfortunately no — we reply during business hours as soon as possible.',
            '♧ Is it possible to contact support via messengers?',
            ' ♧ Currently, support is available only via email.',
            '♧ How do I leave a complaint or suggestion?',
            ' ♧ Send your message to LuckyVegas.co@gmail.com — we appreciate your feedback!',
        ],
    },
];

const FAQ: React.FC = () => {
    return (
        <div className={"FAQ-container"}>
            <h1 className={"headertext"}>Frequently Asked Questions</h1>
            {questions.map((question, i) => (
                <section key={i} className="FAQdropdown">
                    <header className="dropdown-header">
                        <h3>{question.title}</h3>
                    </header>
                    <div className="dropdown-body">
                        <ul className="rule-list">
                            {question.content.map((line, idx) => (
                                <li key={idx}>{line}</li>
                            ))}
                        </ul>
                    </div>
                </section>
            ))}
        </div>
    );
};

export default FAQ;
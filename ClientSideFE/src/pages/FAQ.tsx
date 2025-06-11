// src/pages/About.tsx
import React, {useState} from 'react';
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
    { title: 'About security and politics',
        items: [
            {q: '♡ Is it safe to store data here?',
                a:' ♡ Yes — we use encrypted connections and securely protect your personal data.'},
            {q: '♡ Where can I find the privacy policy and rules?',
                a:' ♡ They’re available at the bottom of the website or in your account menu.'},
            {q: '♡ Can I temporarily lock my account?',
                a:' ♡ Yes — contact support or use the “Self-Exclusion” option in your profile settings.'},
            {q: '♡ How do I delete an account?',
                a:' ♡ Contact our support team via chat or email to request account deletion.'}
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
    const [expandedIndex, setExpandedIndex] = useState<number>(0);
    const [justOpenedIndex, setJustOpenedIndex] = useState<number | null>(0);

    const toggleDropdown = (index: number) => {
        if (expandedIndex === index) {
            setExpandedIndex(-1);
            setJustOpenedIndex(null);
        } else {
            setExpandedIndex(index);
            setJustOpenedIndex(index);
        }
    };

    return (
        <div className="guides-container">
            <h1 className={"FAQ-header"}>Frequently Asked Questions</h1>
            {questions.map((question, q) => (
                <section key={q} className="dropdown">
                    <header
                        className={`dropdown-header ${justOpenedIndex === q ? 'underline-animated' : ''}`}
                        onClick={() => toggleDropdown(q)}
                    >
                        <h3 className={expandedIndex === q ? 'open' : ''}>{question.title}</h3>
                        <svg
                            className={`icon ${expandedIndex === q ? 'open' : ''}`}
                            width="23"
                            height="14"
                            viewBox="0 0 23 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12.1173 0.93924C11.5315 0.353453 10.5818 0.353453 9.99598 0.93924L0.450039 10.4852C-0.135748 11.071 -0.135748 12.0207 0.450039 12.6065C1.03583 13.1923 1.98557 13.1923 2.57136 12.6065L11.0566 4.12122L19.5419 12.6065C20.1277 13.1923 21.0775 13.1923 21.6632 12.6065C22.249 12.0207 22.249 11.071 21.6632 10.4852L12.1173 0.93924ZM11.0566 2H12.5566V1.9999H11.0566H9.55664V2H11.0566Z"
                                fill="white"
                            />
                        </svg>
                    </header>
                    {expandedIndex === q && (
                        <div className="dropdown-body">
                            <ul className="questions-list">
                                {question.items.map((line, idx) => (
                                    <li key={idx}>
                                        <div className="faq-question">{line.q}</div>
                                        <div className="faq-answer">{line.a}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            ))}
        </div>
    );
};

export default FAQ;
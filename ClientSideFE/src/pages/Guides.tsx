import React, { useState } from 'react';
import './Guides.css';

const rules = [
    { title: 'Common Rules', content: [
            'All players must be 21 years or older.',
            'Play responsibly and within your limits.',
            'All winnings and losses are final once confirmed by the system.',
            'Players must agree to terms and conditions before playing.',
            'Any form of cheating or manipulation will result in a ban.',
        ],
    },
    { title: 'Poker', content: [
            "Standard Texas Hold'em format unless stated otherwise.",
            'Each player receives 2 private cards.',
            'Five community cards are dealt in three stages: the flop, the turn, and the river.',
            'The goal is to make the best 5-card hand.',
            'Betting occurs in rounds.',
        ],
    },
    { title: 'Blackjack', content: [
            'The aim is to get a hand total of 21 or as close as possible without going over.',
            'Players are dealt two cards and can hit, stand, double, or split.',
            'Face cards are worth 10, Aces are worth 1 or 11.',
            'Dealer must hit until reaching at least 17.',
        ],
    },
    { title: 'Slots', content: [
            'Match symbols on paylines to win.',
            'Each slot has unique symbols and bonus features.',
            'Betting amount affects potential winnings.',
            'Some slots include free spins, multipliers, or mini-games.',
        ],
    },
    { title: 'Three-in-a-row', content: [
            'Also known as Tic Tac Toe.',
            'Get three of your symbols in a row to win.',
            'Simple strategy game of placement and prediction.',
        ],
    },
    { title: 'Fool', content: [
            'Russian card game played with 36 cards (6s through Aces).',
            'The player with the lowest trump starts the attack.',
            'Defenders beat cards with higher trump or matching suit.',
            'Game continues until one player is left with cards (the "Fool").',
        ],
    },
    { title: 'Roulette', content: [
            'Place bets on numbers, colors, odd/even, or groups.',
            'Wheel has 37 pockets (European) or 38 (American).',
            'Payouts vary by type of bet.',
        ],
    },
    { title: 'Casino', content: [
            'General casino rules apply to all games.',
            'No use of external tools to influence game outcome.',
            'All chips must be visible at all times.',
            'Dealer decisions are final.',
        ],
    },
    { title: 'Live Casino', content: [
            'Real-time video streaming of dealers and tables.',
            'Players interact via chat or interface.',
            'Games are conducted by professional dealers.',
            'Stable internet required for best experience.',
        ],
    },
];

const Guides: React.FC = () => {
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
            {rules.map((rule, i) => (
                <section key={i} className="dropdown">
                    <header
                        className={`dropdown-header ${justOpenedIndex === i ? 'underline-animated' : ''}`}
                        onClick={() => toggleDropdown(i)}
                    >
                        <h3 className={expandedIndex === i ? 'open' : ''}>{rule.title}</h3>
                        <svg
                            className={`icon ${expandedIndex === i ? 'open' : ''}`}
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
                    {expandedIndex === i && (
                        <div className="dropdown-body">
                            <ul className="rule-list">
                                {rule.content.map((line, idx) => (
                                    <li key={idx}>{line}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            ))}
        </div>
    );
};

export default Guides;

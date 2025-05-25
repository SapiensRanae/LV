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

    const toggleDropdown = (index: number) => {
        setExpandedIndex(prev => (prev === index ? -1 : index));
    };

    return (
        <div className="guides-container">
            {rules.map((rule, i) => (
                <section key={i} className="dropdown">
                    <header className="dropdown-header" onClick={() => toggleDropdown(i)}>
                        <h3>{rule.title}</h3>
                        <span className={`icon ${expandedIndex === i ? 'open' : ''}`}>▶</span>
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

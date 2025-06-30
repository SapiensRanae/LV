import React, { useState, useEffect } from 'react';
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
            {
                m: [
                    'Match symbols on paylines to win.',
                    'Each slot has unique symbols.',
                    'Betting amount affects potential winnings.',
                    'Our slot combinations include:'
                ],
                s: 'Four Card Combinations',
                t: [
                    'Legendary: Get 4 LV (Lucky Vegas) cards in one row',
                    'Grand: Get 4 black cards of different suits in one row',
                    'Epic: Get 4 white cards of different suits in one row',
                    'Major: Get 4 black cards of the same suit in one row',
                    'Advanced: Get 4 white cards of the same suit in one row',
                    'Minor: Get 4 cards of the same suit (any color) in one row'
                ],
                s2: 'Three Card Combinations',
                t2: [
                    'Epic: Get 3 LV (Lucky Vegas) cards in one row',
                    'Major: Get 3 black cards of the same suit in one row',
                    'Advanced: Get 3 white cards of the same suit in one row',
                    'Mini: Get 3 cards of the same suit (any color) in one row'
                ]
            }
        ],
    },
    {
        title: 'Roulette',
        content: [
            'Place bets on numbers, colors, odd/even, or groups.',
            'Wheel has 37 pockets (European) or 38 (American).',
            'Payouts vary by type of bet.',
        ],
        s: 'European roulette payout ratios are:',
        t: [
            'Straight-up (single number) – 35:1',
            'Split (2 numbers) – 17:1',
            'Street (3-number row) – 11:1',
            'Corner (4 numbers) – 8:1',
            'Basket (1,2,3,0) – 8:1',
            'Line (6 numbers) – 6:1',
            'Dozen (12 numbers) – 2:1',
            'Column (12 numbers) – 2:1',
            'Low (1–18) – 1:1',
            'High (19–36) – 1:1',
            'Red/Black – 1:1',
            'Odd/Even – 1:1',
        ],
    },
    { title: 'Casino', content: [
            {
                m: [
                    'General casino rules apply to all games.',
                    'No use of external tools to influence game outcome.',
                    'All chips must be visible at all times.',
                    'Dealer decisions are final.'
                ],
            }
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

    // New: show “back to top” button when on mobile AND scrolled to bottom
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const atBottom =
                window.scrollY + window.innerHeight >=
                document.documentElement.scrollHeight;
            setShowScrollTop(window.innerWidth < 900 && atBottom);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                        <h3 className={expandedIndex === i ? 'open' : ''}>
                            {rule.title}
                        </h3>
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
                                {rule.content.map((line, idx) =>
                                    typeof line === 'string' ? (
                                        <li key={idx}>{line}</li>
                                    ) : (
                                        <React.Fragment key={idx}>
                                            {line.m?.map((msg, mIdx) => (
                                                <li key={`m-${mIdx}`}>{msg}</li>
                                            ))}
                                            {line.s && <li className="slot-subtitle">{line.s}</li>}
                                            {line.t?.map((combo, tIdx) => (
                                                <li key={`t-${tIdx}`}>– {combo}</li>
                                            ))}
                                            {line.s2 && <li className="slot-subtitle">{line.s2}</li>}
                                            {line.t2?.map((combo, t2Idx) => (
                                                <li key={`t2-${t2Idx}`}>– {combo}</li>
                                            ))}
                                        </React.Fragment>
                                    )
                                )}

                                {rule.s && <li className="slot-subtitle">{rule.s}</li>}
                                {rule.t?.map((combo, tIdx) => (
                                    <li key={`rt-${tIdx}`}>– {combo}</li>
                                ))}
                                {rule.s2 && <li className="slot-subtitle">{rule.s2}</li>}
                                {rule.t2?.map((combo, t2Idx) => (
                                    <li key={`rt2-${t2Idx}`}>– {combo}</li>
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
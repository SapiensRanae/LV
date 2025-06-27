import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { spinSlots, SlotsSpinResult } from '../../api/slotsService';
import './Slots.css';

interface CardCollection {
    [colorOrType: string]: {
        [suit: string]: {
            [cardName: string]: string;
        };
    };
}

// Import all card images from assets
declare const require: {
    context(
        directory: string,
        useSubdirectories: boolean,
        regExp: RegExp
    ): {
        keys(): string[];
        <T>(id: string): T;
    };
};

const importAllCards = (): CardCollection => {
    const context = require.context('../../assets/Cards', true, /\.png$/);
    const cards: CardCollection = {};

    context.keys().forEach((key: string) => {
        const parts = key.replace(/^\.\//, '').split('/');
        if (parts.length !== 3) return;
        const [colorOrType, suit, fileName] = parts;
        const cardName = fileName.replace(/\.png$/, '');

        cards[colorOrType] ??= {};
        cards[colorOrType][suit] ??= {};
        cards[colorOrType][suit][cardName] = context(key);
    });

    return cards;
};

const Cards = importAllCards();

// Get card image by name, color, and suit
const getCardImage = (name: string, color: string, suit: string): string => {
    if (Cards[color]?.[suit]?.[name]) return Cards[color][suit][name];
    for (const colorGroup of Object.values(Cards)) {
        for (const suitGroup of Object.values(colorGroup)) {
            if ((suitGroup as any)[name]) return (suitGroup as any)[name];
        }
    }
    return '';
};

// Get a random card image
const getRandomCard = (): string => {
    const colorKeys = Object.keys(Cards);
    const color = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    const suitKeys = Object.keys(Cards[color]);
    const suit = suitKeys[Math.floor(Math.random() * suitKeys.length)];
    const cardNames = Object.keys(Cards[color][suit]);
    const name = cardNames[Math.floor(Math.random() * cardNames.length)];
    return Cards[color][suit][name];
};

const REEL_SIZE = 4;
const SPIN_LENGTH = 16;

// Slots game component
const Slots: React.FC = () => {
    const { user, refreshUser } = useUser();
    const [bet, setBet] = useState(5);
    const [turboOn, setTurboOn] = useState(false);
    const [autoOn, setAutoOn] = useState(false);

    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<SlotsSpinResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userBalance, setUserBalance] = useState(user?.balance ?? 0);

    const [reels, setReels] = useState<string[][]>(
        Array(4).fill(0).map(() => Array(SPIN_LENGTH).fill('').map(getRandomCard))
    );

    // Animation refs
    const animTimeout = useRef<NodeJS.Timeout | null>(null);
    const stopTimeouts = useRef<NodeJS.Timeout[]>([]);
    const pendingResult = useRef<SlotsSpinResult | null>(null);

    // Update balance when user changes
    useEffect(() => {
        if (user) setUserBalance(user.balance);
    }, [user]);

    // Initialize reels on mount
    useEffect(() => {
        setReels(Array(4).fill(0).map(() => Array(SPIN_LENGTH).fill('').map(getRandomCard)));
    }, []);

    // Clean up timeouts on unmount
    useEffect(() => {
        return () => {
            if (animTimeout.current) clearTimeout(animTimeout.current);
            stopTimeouts.current.forEach(clearTimeout);
        };
    }, []);

    // Show backend result on reels after spin
    const showResultOnReels = (spinResult: SlotsSpinResult) => {
        setReels(() => {
            return spinResult.reels.map((card) => {
                const centerIdx = Math.floor(REEL_SIZE / 2);
                const newReel = [];
                for (let j = 0; j < REEL_SIZE; j++) {
                    if (j === centerIdx) {
                        newReel.push(getCardImage(card.name, card.color, card.suit));
                    } else {
                        newReel.push(getRandomCard());
                    }
                }
                return newReel;
            });
        });
    };

    // Handle spin button click
    const handleSpin = async () => {
        if (spinning || !user) return;
        setError(null);
        setResult(null);

        if (bet < 5) {
            setError('Minimal stake is 5 coins');
            return;
        }
        if (bet > userBalance) {
            setError('Insufficient balance');
            return;
        }

        setSpinning(true);

        try {
            const spinResult = await spinSlots({ userId: user.userID, betAmount: bet });
            pendingResult.current = spinResult;
            setUserBalance(prev => prev - bet + spinResult.winnings);
            refreshUser();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Spin failed');
            setSpinning(false);
        }
    };

    // Handle slot animation and stopping logic
    useEffect(() => {
        if (!spinning) return;

        let stopped = false;

        const spinStep = () => {
            if (stopped) return;
            setReels(prev =>
                prev.map(reel =>
                    [getRandomCard(), ...reel.slice(0, SPIN_LENGTH - 1)]
                )
            );
            animTimeout.current = setTimeout(spinStep, turboOn ? 40 : 90);
        };

        spinStep();

        // Hard stop after 2 seconds
        const forceStopTimeout = setTimeout(() => {
            stopped = true;
            if (animTimeout.current) clearTimeout(animTimeout.current);
            stopTimeouts.current.forEach(clearTimeout);
            stopTimeouts.current = [];
            setSpinning(false);
            if (pendingResult.current) {
                showResultOnReels(pendingResult.current);
                setResult(pendingResult.current);
                pendingResult.current = null;
            }
        }, 2000);

        // Usual reel stop logic
        if (pendingResult.current) {
            pendingResult.current.reels.forEach((card, i) => {
                const delay = (turboOn ? 120 : 400) * i + (turboOn ? 200 : 600);
                const timeout = setTimeout(() => {
                    setReels(prev => {
                        const newReels = [...prev];
                        const centerIdx = Math.floor(REEL_SIZE / 2);
                        const newReel = [];
                        for (let j = 0; j < REEL_SIZE; j++) {
                            if (j === centerIdx) {
                                newReel.push(getCardImage(card.name, card.color, card.suit));
                            } else {
                                newReel.push(getRandomCard());
                            }
                        }
                        newReels[i] = newReel;
                        return newReels;
                    });
                    if (i === 3) {
                        setTimeout(() => {
                            stopped = true;
                            if (animTimeout.current) clearTimeout(animTimeout.current);
                            clearTimeout(forceStopTimeout);
                            setSpinning(false);

                            showResultOnReels(pendingResult.current!);
                            setResult(pendingResult.current!);
                            pendingResult.current = null;
                        }, turboOn ? 200 : 600);
                    }
                }, delay);
                stopTimeouts.current.push(timeout);
            });
        }

        return () => {
            stopped = true;
            if (animTimeout.current) clearTimeout(animTimeout.current);
            stopTimeouts.current.forEach(clearTimeout);
            clearTimeout(forceStopTimeout);
            stopTimeouts.current = [];
        };
    }, [spinning, turboOn]);

    // Handle auto-spin logic
    useEffect(() => {
        if (autoOn && !spinning && result) {
            const autoTimeout = setTimeout(() => {
                handleSpin();
            }, turboOn ? 300 : 1000);
            return () => clearTimeout(autoTimeout);
        }
    }, [autoOn, spinning, result, turboOn]);

    return (
        <div className="game-wrapper">
            {/* Prize multipliers row */}
            <div className={user?.role === 'vip' ? "prizes-rowVip" : "prizes-row"}>
                <div className="prizes-left">
                    <div className="prize-item">
                        <div className="legendary-title">Legendary</div>
                        <div className="legendary-value">x1000</div>
                    </div>
                </div>
                <div className="prizes-right">
                    <div className="prize-item">
                        <div className="prize-title">Grand</div>
                        <div className={user?.role === 'vip' ? "prize-boxVip" : "prize-box"}>x500</div>
                    </div>
                    <div className="prize-item">
                        <div className="prize-title">Epic</div>
                        <div className={user?.role === 'vip' ? "prize-boxVip" : "prize-box"}>x250</div>
                    </div>
                    <div className="prize-item">
                        <div className="prize-title">Major</div>
                        <div className={user?.role === 'vip' ? "prize-boxVip" : "prize-box"}>x100</div>
                    </div>
                    <div className="prize-item">
                        <div className="prize-title">Advanced</div>
                        <div className={user?.role === 'vip' ? "prize-boxVip" : "prize-box"}>x50</div>
                    </div>
                    <div className="prize-item">
                        <div className="prize-title">Minor</div>
                        <div className={user?.role === 'vip' ? "prize-boxVip" : "prize-box"}>x20</div>
                    </div>
                    <div className="prize-item">
                        <div className="prize-title">Mini</div>
                        <div className={user?.role === 'vip' ? "prize-boxVip" : "prize-box"}>x10</div>
                    </div>
                </div>
            </div>
            {/* Slot reels */}
            <div className="slots">
                {reels.map((reel, i) => (
                    <div key={i} className={`${
                        user?.role === 'vip' ? 'slotVip' : 'slot'
                    }${spinning ? ' spinning' : ''}`}>
                        <div className="reel">
                            {reel.map((src, idx) => (
                                <section className={user?.role === 'vip' ? "slot-sectionVip" : "slot-section"} key={idx}>
                                    {src && <img src={src} alt="" />}
                                </section>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {/* Controls and stake section */}
            <div className={user?.role === 'vip' ? "buttonsVip" : "buttons"}>
                <div className="stake-section">
                    <div className={user?.role === 'vip' ? "stake-textVip" : "stake-text"}>
                        Stake <input
                        type="number"
                        min={5}
                        value={bet}
                        onChange={e => setBet(Math.max(5, Number(e.target.value)))}
                        disabled={spinning || autoOn}
                    /> coins
                    </div>
                    <div className="min-stake-text">Minimal stake = 5 coins</div>
                    {result && (
                        <div className="min-stake-text" style={{ color: result.winnings > 0 ? 'green' : 'crimson' }}>
                            {result.combination} {result.winnings > 0 ? `You won ${result.winnings}!` : 'No win'}
                        </div>
                    )}
                    <div className="min-stake-text">Balance: {userBalance} coins</div>
                </div>
                <div className="controls">
                    <button className={`side-button${turboOn ? ' glow' : ''}`}
                            onClick={() => setTurboOn(t => !t)}
                            disabled={spinning}
                    >Turbo</button>
                    <button className="spin-button"
                            onClick={handleSpin}
                            disabled={spinning || autoOn}
                    >{spinning ? 'Spinning...' : 'Spin'}</button>
                    <button className={`side-button${autoOn ? ' glow' : ''}`}
                            onClick={() => setAutoOn(a => !a)}
                            disabled={spinning}
                    >Auto</button>
                </div>
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};

export default Slots;
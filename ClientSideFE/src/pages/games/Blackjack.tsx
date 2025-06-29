import React, { useState, useEffect } from 'react';
import * as blackjackApi from '../../api/blackjackService';
import { useUser } from '../../contexts/UserContext';
import './Blackjack.css';

// Card image import logic (same as Slots.tsx)
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

interface CardCollection {
    [colorOrType: string]: {
        [suit: string]: {
            [cardName: string]: string;
        };
    };
}

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

const getCardImage = (name: string, color: string, suit: string): string => {
    if (Cards[color]?.[suit]?.[name]) return Cards[color][suit][name];
    for (const colorGroup of Object.values(Cards)) {
        for (const suitGroup of Object.values(colorGroup)) {
            if ((suitGroup as any)[name]) return (suitGroup as any)[name];
        }
    }
    return '';
};

const Blackjack: React.FC = () => {
    const { user, refreshUser } = useUser();
    const [lobbyCode, setLobbyCode] = useState('');
    const [joinedLobby, setJoinedLobby] = useState(false);
    const [isPrivate, setIsPrivate] = useState(true);
    const [betAmount, setBetAmount] = useState(0);
    const [message, setMessage] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [playerCards, setPlayerCards] = useState<any[]>([]);
    const [dealerCards, setDealerCards] = useState<any[]>([]);
    const [action, setAction] = useState('');
    const [loading, setLoading] = useState(false);

    // --- Lobby Management ---
    const handleCreateLobby = async () => {
        setLoading(true);
        try {
            const res = await blackjackApi.createLobby(isPrivate);
            setLobbyCode(res.lobbyCode);
            setJoinedLobby(true);
            setMessage('Lobby created: ' + res.lobbyCode);
        } catch (e: any) {
            setMessage(e.response?.data?.message || 'Failed to create lobby');
        }
        setLoading(false);
    };

    const handleJoinLobby = async () => {
        setLoading(true);
        try {
            await blackjackApi.joinLobby(lobbyCode);
            setJoinedLobby(true);
            setMessage('Joined lobby: ' + lobbyCode);
        } catch (e: any) {
            setMessage(e.response?.data?.message || 'Failed to join lobby');
        }
        setLoading(false);
    };

    const handleStartGame = async () => {
        setLoading(true);
        try {
            const res = await blackjackApi.startGame(lobbyCode);
            setGameStarted(true);
            setMessage('Game started!');
            // Example: set initial cards if returned by backend
            if (res && res.playerCards && res.dealerCards) {
                setPlayerCards(res.playerCards);
                setDealerCards(res.dealerCards);
            }
        } catch (e: any) {
            setMessage(e.response?.data?.message || 'Failed to start game');
        }
        setLoading(false);
    };

    // --- Player Actions ---
    const handleAction = async (actionType: 'bet' | 'call' | 'raise' | 'fold') => {
        setLoading(true);
        try {
            const res = await blackjackApi.playerAction(lobbyCode, actionType, betAmount);
            setAction(actionType);
            setMessage(`Action: ${actionType} ${betAmount ? `with $${betAmount}` : ''}`);
            // Example: update cards if returned by backend
            if (res && res.playerCards && res.dealerCards) {
                setPlayerCards(res.playerCards);
                setDealerCards(res.dealerCards);
            }
            if (actionType === 'bet' || actionType === 'raise') {
                refreshUser();
            }
        } catch (e: any) {
            setMessage(e.response?.data?.message || 'Action failed');
        }
        setLoading(false);
    };

    // --- Card Rendering ---
    const renderCards = (cards: any[]) => (
        <div className="player-cards">
            {cards.map((card, idx) => (
                <div className="card center" key={idx}>
                    {card && card.name && card.color && card.suit ? (
                        <img
                            src={getCardImage(card.name, card.color, card.suit)}
                            alt={`${card.name} of ${card.suit}`}
                            style={{ width: 60, height: 90 }}
                        />
                    ) : (
                        <div className="card-back" />
                    )}
                </div>
            ))}
        </div>
    );

    // --- Table SVG Layout ---
    const widthTop = 500;
    const widthBottom = 400;
    const arcHeightTop = 160;
    const arcHeightBottom = 130;
    const commonY = 120;
    const topX1 = (1000 - widthTop) / 2;
    const topX2 = topX1 + widthTop;
    const bottomX1 = (1000 - widthBottom) / 2;
    const bottomX2 = bottomX1 + widthBottom;
    const deltaX = topX1 - bottomX1;
    const bottomY = commonY + deltaX * 0.75 + 15;

    return (
        <div className="frame">
            <div className="background-image">
                <div className="blackjack-container">
                    <div className="gray-zone left"/>
                    <div className="gray-zone right"/>
                    {/* Dealer cards */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ color: '#F0CE77', fontWeight: 'bold' }}>Dealer</div>
                        {gameStarted ? renderCards(dealerCards) : null}
                    </div>
                    {/* Player cards */}
                    <div>
                        <div style={{ color: '#fff', fontWeight: 'bold' }}>You</div>
                        {gameStarted ? renderCards(playerCards) : null}
                    </div>
                    {/* Table SVG */}
                    <div className="arc">
                        <svg viewBox="0 0 1000 300" width="100%" height="100%">
                            {/* Top arc */}
                            <path
                                id="topArc"
                                d={`M ${topX1} ${commonY} A ${widthTop / 2} ${arcHeightTop} 0 0 0 ${topX2} ${commonY}`}
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />
                            {/* Bottom arc */}
                            <path
                                id="bottomArc"
                                d={`M ${bottomX1} ${bottomY} A ${widthBottom / 2} ${arcHeightBottom} 0 0 0 ${bottomX2} ${bottomY}`}
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                            />
                            {/* Invisible arc for "BLACKJACK" text */}
                            <path
                                id="blackjackCurve"
                                d={`M ${topX1} ${commonY} A ${widthTop / 2} ${arcHeightTop + 30} 0 0 0 ${topX2} ${commonY}`}
                                fill="none"
                                stroke="none"
                            />
                            {/* "BLACKJACK" text on arc */}
                            <text className="arc-text" fill="white" fontSize="28" fontWeight="bold" dy="-45" style={{letterSpacing: '8px'}}>
                                <textPath href="#blackjackCurve" startOffset="50%" textAnchor="middle">
                                    BLACKJACK
                                </textPath>
                            </text>
                            {/* Dealer rule text on top arc */}
                            <text className="arc-text-high" fill="#F0CE77" fontSize="18" fontWeight="bold" dy="-75" style={{letterSpacing: '10px'}}>
                                <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                                    DEALER MUST STAND ON 17
                                </textPath>
                            </text>
                            {/* Payout text on top arc, left and right */}
                            <text fill="white" fontSize="20" fontWeight="bold" dy="-20" style={{ letterSpacing: '2px', wordSpacing: '-3px' }}>
                                <textPath href="#topArc" startOffset="5%" >
                                    PAYS 2 TO 1
                                </textPath>
                            </text>
                            <text fill="white" fontSize="20" fontWeight="bold" dy="-20" style={{ letterSpacing: '2px', wordSpacing: '-3px' }}>
                                <textPath href="#topArc" startOffset="75%">
                                    PAYS 2 TO 1
                                </textPath>
                            </text>
                            {/* Connecting lines between arcs */}
                            <line x1={topX1} y1={commonY} x2={bottomX1} y2={bottomY} stroke="white" strokeWidth="4" />
                            <line x1={topX2} y1={commonY} x2={bottomX2} y2={bottomY} stroke="white" strokeWidth="4" />
                        </svg>
                    </div>
                    {/* Lobby and betting controls */}
                    <div className="lobby-controls">
                        {!joinedLobby ? (
                            <div>
                                <button onClick={handleCreateLobby} disabled={loading}>
                                    Create Private Lobby
                                </button>
                                <input
                                    placeholder="Lobby Code"
                                    value={lobbyCode}
                                    onChange={e => setLobbyCode(e.target.value)}
                                    disabled={loading}
                                />
                                <button onClick={handleJoinLobby} disabled={loading || !lobbyCode}>
                                    Join Lobby
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div>Lobby Code: <b>{lobbyCode}</b></div>
                                {!gameStarted ? (
                                    <button onClick={handleStartGame} disabled={loading}>
                                        Start Game
                                    </button>
                                ) : (
                                    <div className="betting-controls">
                                        <input
                                            type="number"
                                            placeholder="Bet Amount"
                                            value={betAmount}
                                            min={1}
                                            onChange={e => setBetAmount(Number(e.target.value))}
                                            disabled={loading}
                                        />
                                        <button onClick={() => handleAction('bet')} disabled={loading}>Bet</button>
                                        <button onClick={() => handleAction('call')} disabled={loading}>Call</button>
                                        <button onClick={() => handleAction('raise')} disabled={loading}>Raise</button>
                                        <button onClick={() => handleAction('fold')} disabled={loading}>Fold</button>
                                    </div>
                                )}
                            </div>
                        )}
                        <div style={{ color: '#F0CE77', marginTop: 8 }}>{message}</div>
                        {user && (
                            <div style={{ color: '#fff', marginTop: 8 }}>
                                Balance: {user.balance} coins
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blackjack;
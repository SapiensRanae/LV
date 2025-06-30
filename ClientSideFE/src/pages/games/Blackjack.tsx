import React, { useState, useEffect } from 'react';
import * as blackjackApi from '../../api/blackjackService';
import { useUser } from '../../contexts/UserContext';
import './Blackjack.css';
import { useRef } from 'react';
import Dealer from '../../assets/daeler.svg'


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
    const [lobbyState, setLobbyState] = useState<any>(null);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    const [playerProfiles, setPlayerProfiles] = useState<{ [id: string]: any }>({});
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const avatarRef = useRef<HTMLImageElement>(null);



    const isVip = user?.role === 'vip';


    useEffect(() => {
        // On mount, restore lobby state from storage
        const savedLobbyCode = localStorage.getItem('blackjackLobbyCode');
        const savedJoined = localStorage.getItem('blackjackJoinedLobby') === 'true';
        if (savedLobbyCode && savedJoined) {
            setLobbyCode(savedLobbyCode);
            setJoinedLobby(true);
        }
    }, []);

    useEffect(() => {
        // Save lobby state to storage
        if (joinedLobby && lobbyCode) {
            localStorage.setItem('blackjackLobbyCode', lobbyCode);
            localStorage.setItem('blackjackJoinedLobby', 'true');
        } else {
            localStorage.removeItem('blackjackLobbyCode');
            localStorage.removeItem('blackjackJoinedLobby');
        }
    }, [joinedLobby, lobbyCode]);
    useEffect(() => {
        if (!joinedLobby || !lobbyCode) return;
        // Poll every 2 seconds
        pollingRef.current = setInterval(() => {
            fetchLobbyState();
        }, 2000);
        // Fetch immediately on join
        fetchLobbyState();
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [joinedLobby, lobbyCode]);
    useEffect(() => {
        const fetchProfiles = async () => {
            if (!lobbyState?.players) return;
            const profiles: { [id: string]: any } = {};
            await Promise.all(
                lobbyState.players.map(async (id: number | string) => {

                    const numericId = typeof id === 'string' ? Number(id) : id;

                    try {
                        const profile = await blackjackApi.getPlayerProfile(numericId);
                        // Normalize keys to match render expectations
                        profiles[id.toString()] = {
                            Username: profile.Username ?? profile.username,
                            Description: profile.Description ?? profile.description,
                            UserIcon: profile.UserIcon ?? profile.userIcon,
                            History: profile.History ?? profile.history,
                        };
                    } catch {
                        profiles[id.toString()] = { Username: `Player ${id}` };
                    }
                })
            );
            setPlayerProfiles(profiles);
        };
        fetchProfiles();
    }, [lobbyState]);
    const handleLeaveLobby = async () => {
        setLoading(true);
        try {
            await blackjackApi.leaveLobby(lobbyCode);
            setJoinedLobby(false);
            setLobbyCode('');
            setLobbyState(null);
            setGameStarted(false);
            setPlayerCards([]);
            setDealerCards([]);
            setMessage('You left the lobby.');
            localStorage.removeItem('blackjackLobbyCode');
            localStorage.removeItem('blackjackJoinedLobby');
        } catch (e: any) {
            setMessage(e.response?.data?.message || 'Failed to leave lobby');
        }
        setLoading(false);
    };

    /// Add a function to fetch lobby state (implement this endpoint in your backend if not present):
    const fetchLobbyState = async () => {
        if (!lobbyCode) return;
        try {
            const res = await blackjackApi.getLobbyState(lobbyCode);
            // Map playerIds to players for frontend compatibility
            setLobbyState({
                ...res,
                players: res.playerIds ?? res.players // fallback if already correct
            });
            if (res.gameStarted) setGameStarted(true);
            if (res.playerCards) setPlayerCards(res.playerCards);
            if (res.dealerCards) setDealerCards(res.dealerCards);
        } catch (e) {
            // handle error
        }
    };
    const getPlayerPosition = (idx: number, total: number) => {
        const angle = Math.PI * (1 + idx / (total - 1)); // from 180° to 0°
        const radius = 220;
        const centerX = 300, centerY = 260;
        return {
            left: centerX + radius * Math.cos(angle) - 50,
            top: centerY + radius * Math.sin(angle) - 50,
            position: 'absolute' as const,
            width: 100,
            textAlign: 'center' as const,
        };
    };
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


    const isLobbyCreator = lobbyState?.creatorId === user?.userID;

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

    function extractGameName(h: any): string {
        if (h && h.game) {
            if (typeof h.game === 'object' && h.game.name) return h.game.name;
            if (typeof h.game === 'string') return h.game;
        }
        return '';
    }

    // --- Table SVG Layout ---
    const widthTop = 700;
    const widthBottom = 600;
    const arcHeightTop = 160;
    const arcHeightBottom = 130;
    const commonY = 60;
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
                    {lobbyState && lobbyState.players && selectedPlayerId && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0, left: 0, width: '100%', height: '100%',
                                zIndex: 5,
                                background: 'transparent',
                            }}
                            onClick={() => setSelectedPlayerId(null)}
                        />
                    )}

                    {lobbyState && lobbyState.players && (
                        <div style={{ position: 'relative', width: 600, height: 350, margin: '0 auto' }}>
                            {/* Render each player in a half-circle */}
                            {lobbyState.players.map((id: any, idx: number) => {
                                const profile = playerProfiles[id.toString()];
                                const isYou = id === user?.userID;
                                const isSelected = selectedPlayerId === id.toString();

                                return (
                                    <div key={id} style={getPlayerPosition(idx, lobbyState.players.length)}>
                                        <img
                                            src={profile?.UserIcon || '/default-profile.png'}
                                            alt={profile?.Username}
                                            style={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: '50%',
                                                border: isYou ? '3px solid #F0CE77' : '2px solid #fff',
                                                marginBottom: 4,
                                                marginTop: 32,
                                                cursor: 'pointer',
                                                justifySelf: 'center'
                                            }}
                                            onClick={e => {
                                                e.stopPropagation();
                                                setSelectedPlayerId(isSelected ? null : id.toString());
                                            }}
                                        />
                                        <div style={{ color: isYou ? '#F0CE77' : '#fff', fontWeight: 'bold' }}>
                                            {profile?.Username || `Player ${id}`}
                                            {isYou && ' (You)'}
                                        </div>
                                        {isSelected && (
                                            <div style={{
                                                background: 'rgba(30,30,30,0.95)',
                                                color: '#fff',
                                                borderRadius: 8,
                                                padding: 10,
                                                marginTop: 15,
                                                minWidth: 200,
                                                marginLeft: 90,
                                                position: 'absolute',
                                                zIndex: 1000,
                                                boxShadow: '0 2px 8px #0008'
                                            }}
                                                 onClick={e => e.stopPropagation()}
                                            >
                                                <div style={{ fontWeight: 'bold', color: '#F0CE77' }}>
                                                    {profile?.Description || 'No description'}
                                                </div>
                                                <div style={{ marginTop: 8 }}>
                                                    <b>Game History:</b>
                                                    <table style={{
                                                        width: '100%',
                                                        background: 'rgba(40,40,40,0.95)',
                                                        borderRadius: 6,
                                                        marginTop: 6,
                                                        fontSize: 13,
                                                        color: '#fff'
                                                    }}>
                                                        <thead>
                                                        <tr>
                                                            <th style={{color:'#F0CE77'}}>№</th>
                                                            <th style={{color:'#F0CE77'}}>Game</th>
                                                            <th style={{color:'#F0CE77'}}>Bet</th>
                                                            <th style={{color:'#F0CE77'}}>Result</th>
                                                            <th style={{color:'#F0CE77'}}>Date</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {profile?.History && profile.History.length > 0 ? (
                                                            profile.History.map((h: any, i: number) => {
                                                                const bet = h.CashAmount ?? h.cashAmount;
                                                                const isWin = (h.TransactionType ?? h.transactionType) === 'win';
                                                                const result = isWin ? `+${bet}` : `-${bet}`;
                                                                const gameName = extractGameName(h);
                                                                return (
                                                                    <tr key={h.GameTransactionID ?? h.gameTransactionID}>
                                                                        <td>{i + 1}</td>
                                                                        <td>{gameName}</td>
                                                                        <td>{bet}</td>
                                                                        <td style={{color: isWin ? 'green' : 'crimson'}}>{result}</td>
                                                                        <td>{new Date(h.Date ?? h.date).toLocaleString()}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={5}>No game history yet</td>
                                                            </tr>
                                                        )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {/* Dealer (always bot) at the top center */}
                            <div
                                className="Bot"
                            >
                                <img
                                    src={Dealer}
                                    alt="Dealer"
                                    style={{
                                        width: 96,
                                        height: 96,
                                        marginBottom: 4,
                                    }}
                                />
                                <div className="BotText">Dealer (Bot)</div>
                            </div>
                        </div>
                    )}
                    {/* Lobby and betting controls */}
                    <div className={isVip ? "lobby-controlsVip" : "lobby-controls"}>
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
                                {!gameStarted && isLobbyCreator ? (
                                    <button onClick={handleStartGame} disabled={loading}>
                                        Start Game
                                    </button>
                                ) : null}
                                {joinedLobby && (
                                    <button onClick={handleLeaveLobby} disabled={loading} style={{ marginTop: 12 }}>
                                        Leave Lobby
                                    </button>
                                )}
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
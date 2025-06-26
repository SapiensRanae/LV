import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { spinRoulette } from '../../api/rouletteService';

import './Roulette.css';

interface BetType {
    type: string;
    amount: number;
    numbers: number[];
}

interface SpinResult {
    outcome: string;
    color: string;
    betAmount: number;
    winnings: number;
    newBalance: number;
}

const Roulette: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();
    const { refreshUser } = useUser();
    const [result, setResult] = useState<null | 'win' | 'lose'>(null);

    const [spinning, setSpinning] = useState(false);
    const [currentNumber, setCurrentNumber] = useState<number | null>(null);
    const [selectedChip, setSelectedChip] = useState(1);
    const [currentBets, setCurrentBets] = useState<BetType[]>([]);
    const [wheelRotation, setWheelRotation] = useState(0);
    const [spinDirection, setSpinDirection] = useState(1);

    // API integration state
    const [userBalance, setUserBalance] = useState<number | null>(user?.balance || null);
    const [lastWinnings, setLastWinnings] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (user) {
            setUserBalance(user.balance);
        }
    }, [user]);

    const numbers = [
        0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
        5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    ];

    const chips = [1, 5, 10, 25, 100, 500];
    const row1 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
    const row2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
    const row3 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];

    const RED_NUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    const BLACK_NUMBERS = numbers.filter(n => n !== 0 && !RED_NUMBERS.includes(n));

    const RED_SET = new Set(RED_NUMBERS);

    const numberColor = (n: number) => {
        if (n === 0) return 'green';
        return RED_SET.has(n) ? 'red' : 'black';
    };

    const size = 800;
    const center = size / 2;
    const outerRadius = center - 20;
    const innerRadius = outerRadius * 0.4;
    const segmentAngle = 360 / numbers.length;
    const fontSize = 40;
    const labelRadiusFactor = 0.75;

    const getTextColor = (bg: string) => {
        const hex = bg.slice(1);
        const rgb = [hex.substr(0,2), hex.substr(2,2), hex.substr(4,2)]
            .map(h => parseInt(h, 16) / 255);
        const lum = rgb
            .map(v => (v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4)))
            .reduce((sum, v, i) => sum + [0.2126,0.7152,0.0722][i] * v, 0);
        return lum > 0.179 ? '#000000' : '#ffffff';
    };

    const placeBet = (type: string, numbers: number[]) => {
        if (spinning) return;
        setCurrentBets([...currentBets, { type, amount: selectedChip, numbers }]);
    };

    const getBetData = () => {
        // Calculate total bet amount
        const totalBet = currentBets.reduce((sum, bet) => sum + bet.amount, 0);

        // Get the first bet to determine type (simplified approach)
        const mainBet = currentBets[0];

        // Map local bet types to API expected format
        let betType = '';
        let betNumber = null;
        let betColor = '';
        let columnType = null;
        let dozenType = null;

        switch (mainBet.type) {
            case 'single':
                betType = 'single';
                betNumber = mainBet.numbers[0];
                break;
            case 'column':
                betType = 'column';
                if (JSON.stringify(mainBet.numbers) === JSON.stringify(row1)) {
                    columnType = 'first';
                } else if (JSON.stringify(mainBet.numbers) === JSON.stringify(row2)) {
                    columnType = 'second';
                } else {
                    columnType = 'third';
                }
                break;
            case 'dozen':
                betType = 'dozen';
                if (mainBet.numbers[0] === 1) {
                    dozenType = 'first';
                } else if (mainBet.numbers[0] === 13) {
                    dozenType = 'second';
                } else {
                    dozenType = 'third';
                }
                break;
            case 'even':
                betType = 'even';
                break;
            case 'odd':
                betType = 'odd';
                break;
            case 'red':
                betType = 'color';
                betColor = 'red';
                break;
            case 'black':
                betType = 'color';
                betColor = 'black';
                break;
            default:
                betType = 'red'; // Fallback
        }

        return {
            userId: user?.userID || 0,
            betAmount: totalBet,
            betType,
            betNumber,
            betColor,
            columnType,
            dozenType
        };
    };

    const spinWheel = async () => {
        if (spinning || currentBets.length === 0 || !user || !user.userID) return;

        setSpinning(true);
        setError(null);
        setIsLoading(true);

        try {
            const betData = getBetData();
            const result = await spinRoulette(betData);

            const spinResult = result as SpinResult;
            const outcomeNumber = parseInt(spinResult.outcome);

            setLastWinnings(spinResult.winnings);
            setUserBalance(spinResult.newBalance);



            const numberIndex = numbers.indexOf(outcomeNumber);
            const fullRotations = 5 * 360;
            const anglePerNumber = 360 / numbers.length;
            const currentAngle = wheelRotation % 360;
            const targetAngle = -(numberIndex * anglePerNumber + 90);

            let delta = targetAngle - currentAngle;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;

            const totalRotation = wheelRotation + (spinDirection * fullRotations) + delta;

            setWheelRotation(totalRotation);
            setSpinDirection(prev => prev * -1);

            setTimeout(() => {
                setCurrentNumber(outcomeNumber);
                setSpinning(false);
                setCurrentBets([]);
                refreshUser();
                setResult(spinResult.winnings > 0 ? 'win' : 'lose'); // <-- Show result after animation

            }, 5000);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to spin the roulette');
            setSpinning(false);
        } finally {
            setIsLoading(false);
        }
    };

    const clearBets = () => {
        if (!spinning) {
            setCurrentBets([]);
        }
    };

    const renderWheel = () => (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'visible'
        }}>
            <svg
                viewBox={`0 0 ${size} ${size}`}
                width={size}
                height={size}
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) rotate(${wheelRotation}deg)`,
                    transition: spinning ? 'transform 5s cubic-bezier(0.2, 0.8, 0.3, 1)' : 'none'
                }}
            >
                <defs>
                    <filter id="glow" x="-30%" y="-30%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <circle
                    cx={center}
                    cy={center}
                    r={outerRadius + 5}
                    fill="#2c2c2c"
                    stroke="crimson"
                    strokeWidth={8}
                />

                {numbers.map((num, idx) => {
                    const startAng = idx * segmentAngle - segmentAngle / 2;
                    const endAng = startAng + segmentAngle;
                    const midAng = startAng + segmentAngle / 2;

                    let fill;
                    if (num === 0) fill = '#008000';
                    else if (RED_NUMBERS.includes(num)) {
                        fill = '#c41e3a';
                    } else {
                        fill = '#000000';
                    }

                    const textColor = getTextColor(fill);
                    const isWinningNumber = currentNumber === num;

                    const largeArc = segmentAngle > 180 ? 1 : 0;
                    const p1 = [
                        center + outerRadius * Math.cos((startAng * Math.PI) / 180),
                        center + outerRadius * Math.sin((startAng * Math.PI) / 180)
                    ];
                    const p2 = [
                        center + outerRadius * Math.cos((endAng * Math.PI) / 180),
                        center + outerRadius * Math.sin((endAng * Math.PI) / 180)
                    ];
                    const p3 = [
                        center + innerRadius * Math.cos((endAng * Math.PI) / 180),
                        center + innerRadius * Math.sin((endAng * Math.PI) / 180)
                    ];
                    const p4 = [
                        center + innerRadius * Math.cos((startAng * Math.PI) / 180),
                        center + innerRadius * Math.sin((startAng * Math.PI) / 180)
                    ];

                    const d = `M ${p1.join(' ')} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${p2.join(' ')} L ${p3.join(' ')} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${p4.join(' ')} Z`;

                    const labelRadius = outerRadius * labelRadiusFactor;
                    const tx = center + labelRadius * Math.cos((midAng * Math.PI) / 180);
                    const ty = center + labelRadius * Math.sin((midAng * Math.PI) / 180);

                    return (
                        <g key={num}>
                            <path
                                d={d}
                                fill={fill}
                                stroke={isWinningNumber ? "#ffff00" : "white"}
                                strokeWidth={isWinningNumber ? 3 : 1}
                                filter={isWinningNumber ? "url(#glow)" : "none"}
                            />
                            <text
                                x={tx}
                                y={ty}
                                fill={isWinningNumber ? "#ffffff" : textColor}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={isWinningNumber ? fontSize * 1.2 : fontSize}
                                fontWeight="bold"
                                transform={`rotate(${midAng + 90}, ${tx}, ${ty})`}
                            >
                                {num}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );

    const isNumberSelected = (n: number) =>
        currentBets.some(bet => bet.numbers.includes(n));

    const totalBetAmount = currentBets.reduce((sum, bet) => sum + bet.amount, 0);

    return (
        <div className="roulette-container">
            <div className="wheel-section">
                {renderWheel()}
                <div className="wheel-pointer"/>
                {result && (
                    <div className="game-result"
                         style={{
                             color: result === 'win' ? 'green' : 'crimson',
                         }}>
                        {result === 'win' ? 'You won!' : 'You lost!'}
                    </div>
                )}
                {error && <div className="error-message">{error}</div>}
            </div>

            <div className="betting-table">
                <div className="chips-section">
                    {chips.map((value) => (
                        <div
                            key={value}
                            className={`chip ${selectedChip === value ? 'selected' : ''}`}
                            onClick={() => setSelectedChip(value)}
                        >
                            {value}
                        </div>
                    ))}
                    <div className="total-bet">
                        Total Bet: ${totalBetAmount}
                    </div>
                </div>


                <div className="numbers-grid">
                    <div className={`zero ${isNumberSelected(0) ? 'highlight' : ''}`} onClick={() => placeBet('single', [0])}>0</div>
                    {[row1, row2, row3].map((row, rowIdx) => (
                        <React.Fragment key={rowIdx}>
                            {row.map(n => (
                                <div
                                    key={n}
                                    className={[
                                        'number',
                                        numberColor(n),
                                        isNumberSelected(n) ? 'highlight' : ''
                                    ].join(' ')}
                                    onClick={() => placeBet('single', [n])}
                                >
                                    {n}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>

                <div className="outside-bets">
                    <div className="column-bets">
                        <div onClick={() => placeBet('column', row1)}>2 to 1</div>
                        <div onClick={() => placeBet('column', row2)}>2 to 1</div>
                        <div onClick={() => placeBet('column', row3)}>2 to 1</div>
                    </div>
                    <div className="dozen-bets">
                        <div onClick={() => placeBet('dozen', Array.from({length: 12}, (_, i) => i + 1))}>1st 12</div>
                        <div onClick={() => placeBet('dozen', Array.from({length: 12}, (_, i) => i + 13))}>2nd 12</div>
                        <div onClick={() => placeBet('dozen', Array.from({length: 12}, (_, i) => i + 25))}>3rd 12</div>
                    </div>
                    <div className="simple-bets">
                        <div onClick={() => placeBet('even', Array.from({length: 18}, (_, i) => (i + 1) * 2))}>EVEN</div>
                        <div className="bet-button red" onClick={() => placeBet('red', RED_NUMBERS)}>RED</div>
                        <div className="bet-button black" onClick={() => placeBet('black', BLACK_NUMBERS)}>BLACK</div>
                        <div onClick={() => placeBet('odd', Array.from({length: 18}, (_, i) => i * 2 + 1))}>ODD</div>
                    </div>
                </div>

                <div className="control-buttons">
                    <button
                        onClick={spinWheel}
                        disabled={spinning || currentBets.length === 0 || isLoading}
                    >
                        {isLoading ? 'SPINNING...' : 'SPIN'}
                    </button>
                    <button onClick={clearBets} disabled={spinning || isLoading}>
                        CLEAR BETS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Roulette;
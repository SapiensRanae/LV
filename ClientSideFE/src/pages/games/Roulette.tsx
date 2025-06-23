import React, { useState } from 'react';
import './Roulette.css';

interface BetType {
    type: string;
    amount: number;
    numbers: number[];
}

const Roulette: React.FC = () => {
    const [spinning, setSpinning] = useState(false);
    const [currentNumber, setCurrentNumber] = useState<number | null>(null);
    const [selectedChip, setSelectedChip] = useState(1);
    const [currentBets, setCurrentBets] = useState<BetType[]>([]);
    const [wheelRotation, setWheelRotation] = useState(0);
    const [spinDirection, setSpinDirection] = useState(1);





    const numbers = [
        0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
        5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    ];

    const chips = [1, 5, 10, 25, 100, 500];
    const row1 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
    const row2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
    const row3 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];

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



    const spinWheel = () => {
        if (spinning) return;
        setSpinning(true);

        const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
        const fullRotations = 5 * 360; // Keep 5 rotations for control

        const numberIndex = numbers.indexOf(randomNumber);
        const anglePerNumber = 360 / numbers.length;

        // Calculate the current position
        const currentAngle = wheelRotation % 360;

        // Calculate target angle for the number to align with pointer (at -90 degrees)
        const targetAngle = -(numberIndex * anglePerNumber + 90);

        // Calculate shortest path to target
        let delta = targetAngle - currentAngle;

        // Normalize delta to be between -180 and 180
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        // Add full rotations in the current direction
        const totalRotation = wheelRotation + (spinDirection * fullRotations) + delta;

        setWheelRotation(totalRotation);

        // Toggle direction for next spin
        setSpinDirection(prev => prev * -1);

        setTimeout(() => {
            setCurrentNumber(randomNumber);
            setSpinning(false);
        }, 5000);
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
                else if ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(num)) {
                    fill = '#c41e3a';
                } else {
                    fill = '#000000';
                }

                const textColor = getTextColor(fill);
                // Add this line to determine if this is the winning number
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

    return (
        <div className="roulette-container">
            <div className="wheel-section">
                {renderWheel()}
                <div className="wheel-pointer"/>

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
                </div>

                <div className="numbers-grid">
                    <div className="zero" onClick={() => placeBet('single', [0])}>0</div>
                    {row1.map(n => (
                        <div
                            key={n}
                            className={`number ${n === 6 || n === 15 || n === 24 || n === 33 ? 'black' : 'red'}`}
                            onClick={() => placeBet('single', [n])}
                        >
                            {n}
                        </div>
                    ))}
                    {row2.map(n => (
                        <div
                            key={n}
                            className={`number ${n === 2 || n === 8 || n === 11 || n === 17 || n === 20 || n === 26 || n === 29 || n === 35 ? 'black' : 'red'}`}
                            onClick={() => placeBet('single', [n])}
                        >
                            {n}
                        </div>
                    ))}
                    {row3.map(n => (
                        <div
                            key={n}
                            className={`number ${n === 4 || n === 10 || n === 13 || n === 22 || n === 28 || n === 31 ? 'black' : 'red'}`}
                            onClick={() => placeBet('single', [n])}
                        >
                            {n}
                        </div>
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
                        <div onClick={() => placeBet('red', numbers.filter(n => n !== 0 && n % 2 !== 0))}>RED</div>
                        <div onClick={() => placeBet('black', numbers.filter(n => n !== 0 && n % 2 === 0))}>BLACK</div>
                        <div onClick={() => placeBet('odd', Array.from({length: 18}, (_, i) => i * 2 + 1))}>ODD</div>
                    </div>
                </div>

                <div className="control-buttons">
                    <button onClick={spinWheel} disabled={spinning || currentBets.length === 0}>
                        SPIN
                    </button>
                    <button onClick={clearBets} disabled={spinning}>
                        CLEAR BETS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Roulette;
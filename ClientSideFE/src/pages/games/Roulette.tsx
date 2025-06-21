
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

    const numbers = [
        0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
        5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    ];

    const chips = [1, 5, 10, 25, 100, 500];

    const placeBet = (type: string, numbers: number[]) => {
        if (spinning) return;
        setCurrentBets([...currentBets, { type, amount: selectedChip, numbers }]);
    };

    const spinWheel = () => {
        if (spinning) return;
        setSpinning(true);

        const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
        const fullRotations = (3 + Math.floor(Math.random() * 3)) * 360;
        const numberPosition = (360 / 37) * numbers.indexOf(randomNumber);
        const totalRotation = fullRotations + numberPosition;

        setWheelRotation(totalRotation);

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
        <svg viewBox="0 0 400 400" className="roulette-wheel">
            <circle cx="200" cy="200" r="190" fill="#2c2c2c" stroke="gold" strokeWidth="5"/>
            {numbers.map((num, index) => {
                const angle = (index * 360) / 37;
                const rotation = angle - 90;
                const radian = (angle * Math.PI) / 180;
                const x = 200 + 150 * Math.cos(radian);
                const y = 200 + 150 * Math.sin(radian);

                return (
                    <g key={num} transform={`translate(${x},${y}) rotate(${rotation})`}>
                        <circle
                            r="20"
                            fill={num === 0 ? '#008000' : num % 2 === 0 ? '#000000' : '#c41e3a'}
                            stroke="white"
                            strokeWidth="1"
                        />
                        <text
                            fill="white"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="14"
                            fontWeight="bold"
                        >
                            {num}
                        </text>
                    </g>
                );
            })}
        </svg>
    );

    return (
        <div className="roulette-container">
            <div className="wheel-section">
                <div style={{ transform: `rotate(${wheelRotation}deg)` }}>
                    {renderWheel()}
                </div>
                <div className="wheel-pointer"/>
                {currentNumber !== null && (
                    <div className="result">
                        Last: <span className={currentNumber === 0 ? 'green' : currentNumber % 2 === 0 ? 'black' : 'red'}>
                            {currentNumber}
                        </span>
                    </div>
                )}
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
                    {[...Array(36)].map((_, i) => (
                        <div
                            key={i + 1}
                            className={`number ${(i + 1) % 2 === 0 ? 'black' : 'red'}`}
                            onClick={() => placeBet('single', [i + 1])}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>

                <div className="outside-bets">
                    <div className="column-bets">
                        <div onClick={() => placeBet('column', [3,6,9,12,15,18,21,24,27,30,33,36])}>2:1</div>
                        <div onClick={() => placeBet('column', [2,5,8,11,14,17,20,23,26,29,32,35])}>2:1</div>
                        <div onClick={() => placeBet('column', [1,4,7,10,13,16,19,22,25,28,31,34])}>2:1</div>
                    </div>
                    <div className="dozen-bets">
                        <div onClick={() => placeBet('dozen', [1,2,3,4,5,6,7,8,9,10,11,12])}>1st 12</div>
                        <div onClick={() => placeBet('dozen', [13,14,15,16,17,18,19,20,21,22,23,24])}>2nd 12</div>
                        <div onClick={() => placeBet('dozen', [25,26,27,28,29,30,31,32,33,34,35,36])}>3rd 12</div>
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
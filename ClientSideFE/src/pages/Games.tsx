    // src/pages/Games.tsx
import React from 'react';
import './Games.css';
import Poker from '../assets/PokerCard.jpg';
import Blackjack from '../assets/BlackjackCard.png';
import Roulette from '../assets/RouletteCard.png';
import Slots from '../assets/SlotsCard.png'


const Games: React.FC = () => {
    return (
        <div className="games">
            <div className="card">
                <div className="shadow">
                    <h2>Poker</h2>
                    <h3>A classic card game where players bet on the strength of their hand, combining strategy, psychology, and luck to win chips or money.</h3>
                    <button>Play</button>
                </div>
                <img src={Poker} alt={"Poker"}></img>
            </div>
            <div className="card">
                <div className="shadow">
                    <h2>Blackjack</h2>
                    <h3>A fast-paced card game where players aim to beat the dealer by getting a hand value as close to 21 as possible without going over.</h3>
                    <button>Play</button>
                </div>
                <img src={Blackjack} alt={"Blackjack"}></img>
            </div>
            <div className="card">
                <div className="shadow">
                    <h2>Roulette</h2>
                    <h3>A popular casino game where players bet on numbers, colors, or ranges before a ball spins around a wheel to determine the winning spot.</h3>
                    <button>Play</button>
                </div>
                <img src={Roulette} alt={"Roulette"}></img>
            </div>
            <div className="card">
                <div className="shadow">
                    <h2>Slots</h2>
                    <h3>A simple game of chance where players spin reels with various symbols, aiming to land matching combinations for payouts or bonuses.</h3>
                    <button>Play</button>
                </div>
                <img src={Slots} alt={"Slots"}></img>
            </div>
    </div>
);
};

export default Games;

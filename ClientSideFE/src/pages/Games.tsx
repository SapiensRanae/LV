// src/pages/Games.tsx
import React from 'react';
import './Games.css';
import Poker from '../assets/PokerCard.jpg';
import Blackjack from '../assets/BlackjackCard.png';
import Roulette from '../assets/RouletteCard.png';
import Slots from '../assets/SlotsCard.png'


const Games: React.FC = () => {
    return (
        <div className="page games">
            <h1>Games</h1>
            <p>Discover our exciting collection of games. From classic table games to cutting-edge slots, there's something for every player. Play responsibly and enjoy!</p>
    </div>
);
};

export default Games;

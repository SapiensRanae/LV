// src/pages/Games.tsx
import React from 'react';
import './Games.css';
import Poker from '../assets/PokerCard.jpg';
import Blackjack from '../assets/BlackjackCard.png';
import Roulette from '../assets/RouletteCard.png';
import Slots from '../assets/SlotsCard.png';
import {useNavigate} from "react-router-dom";

const games = [
    {
        name: 'Poker',
        description: 'A classic card game where players bet on the strength of their hand, combining strategy, psychology, and luck to win chips or money.',
        img: Poker,
        route: 'poker',
    },
    {
        name: 'Blackjack',
        description: 'A fast-paced card game where players aim to beat the dealer by getting a hand value as close to 21 as possible without going over.',
        img: Blackjack,
        route: 'blackjack',
    },
    {
        name: 'Roulette',
        description: 'A popular casino game where players bet on numbers, colors, or ranges before a ball spins around a wheel to determine the winning spot.',
        img: Roulette,
        route: 'roulette',
    },
    {
        name: 'Slots',
        description: 'A simple game of chance where players spin reels with various symbols, aiming to land matching combinations for payouts or bonuses.',
        img: Slots,
        route: 'slots',
    },
]

const Games: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="games">
            {games.map(g => (
                <div key={g.route} className="card">
                    <div className="shadow">
                        <h2>{g.name}</h2>
                        <h3>{g.description}</h3>
                        <button
                            onClick={() => navigate(`/games/${g.route}`)}
                            className="play-button"
                        >
                            Play
                        </button>
                    </div>
                    <img src={g.img} alt={g.name} />
                </div>
            ))}
        </div>
    )
}

export default Games;

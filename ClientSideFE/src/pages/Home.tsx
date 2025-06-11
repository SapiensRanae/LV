// src/pages/Home.tsx
import React from 'react';
import Poker from '../assets/PokerCarousel.png';
import './Home.css';

const Home: React.FC = () => {
    return (
        <div className="carousel-container">
            <img className="carousel-item" src={Poker} alt="Poker Carousel"/>
        </div>
    );
};

export default Home;

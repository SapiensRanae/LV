// src/pages/Home.tsx
import React from 'react';
import Poker from '../assets/PokerCarousel.png';
import Roulette from '../assets/RouletteCarousel.png';
import './Home.css';

const images = [Poker, Roulette]

const slides = [...images, ...images]

const Home: React.FC = () => {
    return (
        <div className="carousel">
            <div className="carousel-track">
                {slides.map((src, idx) => (
                    <div className="carousel-item" key={idx}>
                        <img src={src} alt={`slide-${idx % images.length}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;

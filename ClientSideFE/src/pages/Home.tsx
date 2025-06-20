import React from 'react';
import Slider from 'react-slick';
import Poker from '../assets/PokerCarousel.png';
import Roulette from '../assets/RouletteCarousel.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';

const images = [Poker, Roulette];

const sliderSettings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: true,
};

const Home: React.FC = () => {
    console.log('Images array:', images);
    return (
        <div className="carousel">
            <Slider {...sliderSettings}>
                {images.map((source, idx) => (
                    <div className="carousel-item" key={idx}>
                        <img src={source} alt={`slide-${idx}`} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Home;
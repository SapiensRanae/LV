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

const Home: React.FC = () => (
    <div className="carousel">
        <Slider {...sliderSettings}>
            {images.map((source, idx) => (
                <div className="carousel-item" key={idx}>
                    <img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-JfVO_Hwqlb4%2FTlOjgETXGnI%2FAAAAAAAAAc4%2FKYiJ_rRA5vA%2Fs1600%2Ftree_frog_3.jpg&f=1&nofb=1&ipt=7b40e133df82e6c624225d5d17b64585b57e3c48777e1165239a1096e6845b17" alt={`slide-${idx}`} />
                </div>
            ))}
        </Slider>
    </div>
);

export default Home;
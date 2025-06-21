import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Slider from 'react-slick';
import ProjectNoticeModal from '../components/ProjectNoticeModal';
import Poker from '../assets/PokerCarousel.png';
import Roulette from '../assets/RouletteCarousel.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';

const images = [Poker, Roulette];
const sliderSettings = {
  infinite: true, speed: 1000, slidesToShow: 1, slidesToScroll: 1,
  autoplay: true, autoplaySpeed: 3000, arrows: false, dots: true,
};

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowNotice(true);
    }
  }, [isAuthenticated]);

  return (
    <>
      {showNotice && <ProjectNoticeModal onClose={() => setShowNotice(false)} />}

      <div className="carousel">
        <Slider {...sliderSettings}>
          {images.map((src, idx) => (
            <div className="carousel-item" key={idx}>
              <img src={src} alt={`slide-${idx}`} />
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Home;
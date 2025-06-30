import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProjectNoticeModal from '../components/ProjectNoticeModal';
import Poker from '../assets/PokerCarousel.png';
import Roulette from '../assets/RouletteCarousel.png';
import Blackjack from '../assets/BlackjackCarousel.png';
import Slots from '../assets/SlotsCarousel.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// Carousel responsiveness settings
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 900 },
    items: 1,
    slidesToSlide: 1
  },
  mobile: {
    breakpoint: { max: 900, min: 0 },
    items: 1,
    slidesToSlide: 1
  }
};

interface HomeProps {
  onProtectedRoute: (path: string) => void;
}

// Home page with carousel of games and project notice for unauthenticated users
const Home: React.FC<HomeProps> = ({onProtectedRoute}) => {
  const { isAuthenticated } = useAuth();
  const [showNotice, setShowNotice] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show notice modal if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setShowNotice(true);
    }
  }, [isAuthenticated]);

  // Images and navigation paths for carousel
  const images: { src: string; path: string; alt: string }[] = [
    { src: Roulette, path: '/games/roulette', alt: 'Roulette' },
    { src: Slots, path: '/games/slots', alt: 'Slots'},
    { src: Poker,    path: '/games/poker',    alt: 'Poker'    },
    { src: Blackjack, path: '/games/blackjack', alt: 'Blackjack'}
  ];

  return (
      <>
        {showNotice && <ProjectNoticeModal onClose={() => setShowNotice(false)} />}

        <div className="carousel">
          <Carousel
              swipeable={isMobile}
              arrows={!isMobile}
              showDots={true}
              responsive={responsive}
              ssr={true}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={2500}
              keyBoardControl={true}
              customTransition="all .5"
              transitionDuration={500}
              containerClass="carousel-container"
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item"
          >
            {images.map((img) => (
                <div
                    key={img.path}
                    onClick={() => onProtectedRoute(img.path)}
                    style={{ cursor: 'pointer' }}
                >
                  <img
                      src={img.src}
                      alt={img.alt}
                      className="carousel-item"
                  />
                </div>
            ))}
          </Carousel>
        </div>
      </>
  );
};

export default Home;
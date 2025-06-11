// src/pages/About.tsx
import React from 'react';
import './About.css';

const About: React.FC = () => {
    return (
        <div className="About-us">
            <h1 style={{textAlign: "center"}}>About LuckyVegas</h1>
            <p>Welcome to <b>Lucky Vegas</b>, a modern online casino created to unite gaming enthusiasts from all over the world.</p>
            <p>Our platform was founded by a team of three dedicated professionals who set out to build a safe, reliable,
                and entertaining gaming environment. Despite our compact team,
                we successfully developed a fully functional online casino that today welcomes players from various countries and cultures.</p>
            <p>At <b>Lucky Vegas</b>, we prioritize the security of our players.
                Our platform is equipped with advanced protection technologies that ensure the safety of personal data and financial transactions.
                We strictly adhere to international security standards and are constantly updating our systems to guarantee the highest level of protection.</p>
            <p>We also take great pride in the quality of our gaming content.
                Every game available on our platform undergoes careful selection, testing, and optimization to deliver a seamless, engaging, and fair gaming experience.
                Our portfolio includes a wide range of modern video slots, classic games, and live casino options with professional dealers,
                providing our players with an authentic casino atmosphere from the comfort of their homes.</p>
            <p>Our mission is to offer a reliable, secure, and comfortable online gaming experience for everyone.
                By continuously improving our platform and expanding our collection of games,
                we aim to maintain the highest standards in the online gambling industry.</p>
            <p>Join <b>LuckyVegas</b> and discover a new level of online entertainment.</p>
        </div>
    );
};

export default About;

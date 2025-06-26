import React from 'react';
import './Poker.css';
import WIP from '../../assets/WIP.png'
import Racc from '../../assets/IMG_1809.jpg'

const Poker: React.FC = () => {

    return(
         <div className="poker-bg">
             <div className="poker-content">
                <h1 className="linear-text-gradient">Page under construction</h1>

                 <img src={WIP} alt="WIP"></img>

                 <p>This page is in the works and will (possibly) be done soon.</p>
             </div>
             <img src={Racc} alt="Raccoon" className="racc"></img>
         </div>
    );
};

export default Poker;
import React from 'react';
import './Slots.css';

const Slots: React.FC = () => {
    const [turboOn, setTurboOn] = React.useState(false);
    const [autoOn, setAutoOn] = React.useState(false);

    return (
        <div className="game-wrapper">
            <div className="prizes-row">
                <div className="prizes-left">
                    <div className="prize-item">
                        <div className="legendary-title">Legendary</div>
                        <div className="legendary-value">x1000</div>
                    </div>
                </div>
                <div className="prizes-right">
                    <div className="prize-item">
                        <div className="prize-title">Grand</div>
                        <div className="prize-box">x500</div>
                    </div>
                    <div className="prize-item">
                        <div className="prize-title">Epic</div>
                        <div className="prize-box">x250</div>
                    </div>
                    <div className="prize-item">
                        <div className="prize-title">Major</div>
                        <div className="prize-box">x100</div>
                    </div>
                    <div className="prize-item">
                        <div className="prize-title">Advanced</div>
                        <div className="prize-box">x50</div>
                    </div>
                    <div className="prize-item">
                        <div className="prize-title">Minor</div>
                        <div className="prize-box">x20</div>
                    </div>
                    <div className="prize-item">
                        <div className="prize-title">Mini</div>
                        <div className="prize-box">x10</div>
                    </div>
                </div>
            </div>
            <div className="slots">
                <div className="slot">
                    <section className="slot-section"></section>
                    <section className="slot-section"></section>
                    <section className="slot-section"></section>
                </div>
                <div className="slot">
                    <section className="slot-section"></section>
                    <section className="slot-section"></section>
                    <section className="slot-section"></section>
                </div>
                <div className="slot">
                    <section className="slot-section"></section>
                    <section className="slot-section"></section>
                    <section className="slot-section"></section>
                </div>
                <div className="slot">
                    <section className="slot-section"></section>
                    <section className="slot-section"></section>
                    <section className="slot-section"></section>
                </div>
            </div>
            <div className="buttons">
                <div className="stake-section">
                    <div className="stake-text">
                        Stake <input type="number" defaultValue={10} /> coins
                    </div>
                    <div className="min-stake-text">Minimal stake = 5 coins</div>
                </div>

                <div className="controls">
                    <button className={`side-button ${turboOn ? 'glow' : ''}`}
                            onClick={() => setTurboOn(t => !t)}>Turbo</button>
                    <button className="spin-button">Spin</button>
                    <button className={`side-button ${autoOn ? 'glow' : ''}`}
                            onClick={() => setAutoOn(a => !a)}>Auto</button>
                </div>
            </div>
        </div>
    );
};

export default Slots;

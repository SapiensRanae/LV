import React from 'react';
import './Blackjack.css';

const Blackjack = () => {
    const widthTop = 500;
    const widthBottom = 400;
    const arcHeightTop = 160;
    const arcHeightBottom = 130;
    const commonY = 120;
    const topX1 = (1000 - widthTop) / 2;
    const topX2 = topX1 + widthTop;
    const bottomX1 = (1000 - widthBottom) / 2;
    const bottomX2 = bottomX1 + widthBottom;
    const deltaX = topX1 - bottomX1;
    const bottomY = commonY + deltaX * 0.75 + 15;

    return (
        <div className="frame">
        <div className="background-image">
            <div className="blackjack-container">
                <div className="gray-zone left"/>
                <div className="gray-zone right"/>

                <div className="player-cards">
                    <div className="card side"/>
                    <div className="card center"/>
                    <div className="card side"/>
                </div>
                <div className="logo-mid">
                    <span className="logo-red-mid">L</span>ucky
                    <span className="logo-red-mid">V</span>egas
                </div>
                <div className="arc"> {/* Контейнер для SVG с дугами и текстом */}
                    <svg viewBox="0 0 1000 300" width="100%" height="100%">
                        {/* Верхняя дуга */}
                        <path
                            id="topArc"
                            d={`M ${topX1} ${commonY} A ${widthTop / 2} ${arcHeightTop} 0 0 0 ${topX2} ${commonY}`}
                            fill="none"
                            stroke="white"
                            strokeWidth="4"
                        />
                        {/* Нижняя дуга */}
                        <path
                            id="bottomArc"
                            d={`M ${bottomX1} ${bottomY} A ${widthBottom / 2} ${arcHeightBottom} 0 0 0 ${bottomX2} ${bottomY}`}
                            fill="none"
                            stroke="white"
                            strokeWidth="4"
                        />

                        {/* Вспомогательная невидимая дуга для текста "BLACKJACK" */}
                        <path
                            id="blackjackCurve"
                            d={`M ${topX1} ${commonY} A ${widthTop / 2} ${arcHeightTop + 30} 0 0 0 ${topX2} ${commonY}`}
                            fill="none"
                            stroke="none"
                        />
                        <text className="arc-text" fill="white" fontSize="28" fontWeight="bold" dy="-45" style={{letterSpacing: '8px'}}>
                            <textPath href="#blackjackCurve" startOffset="50%" textAnchor="middle">
                                BLACKJACK
                            </textPath>
                        </text>

                        <text className="arc-text-high" fill="#F0CE77" fontSize="18" fontWeight="bold" dy="-75" style={{letterSpacing: '10px'}}>
                            <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                                DEALER MUST STAND ON 17
                            </textPath>
                        </text>

                        <text fill="white" fontSize="20" fontWeight="bold" dy="-20" style={{ letterSpacing: '2px', wordSpacing: '-3px' }}>
                            <textPath href="#topArc" startOffset="5%" >
                                PAYS 2 TO 1
                            </textPath>
                        </text>

                        {/* Текст по нижней дуге */}
                        <text fill="white" fontSize="20" fontWeight="bold" dy="-20" style={{ letterSpacing: '2px', wordSpacing: '-3px' }}>
                            <textPath href="#topArc" startOffset="75%">
                                PAYS 2 TO 1
                            </textPath>
                        </text>

                        {/* Линии соединения */}
                        <line x1={topX1} y1={commonY} x2={bottomX1} y2={bottomY} stroke="white" strokeWidth="4" />
                        <line x1={topX2} y1={commonY} x2={bottomX2} y2={bottomY} stroke="white" strokeWidth="4" />
                    </svg>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Blackjack;
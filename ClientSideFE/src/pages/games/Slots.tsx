import React, {useState, useRef} from 'react';
import './Slots.css';

interface CardCollection {
    [colorOrType: string]: {
        [suit: string]: {
            [cardName: string]: string;
        };
    };
}

declare const require: {
    context(
        directory: string,
        useSubdirectories: boolean,
        regExp: RegExp
    ): {
        keys(): string[];
        <T>(id: string): T;
    };
};

const importAllCards = (): CardCollection => {
    const context = require.context('../../assets/Cards', true, /\.png$/);
    const cards: CardCollection = {};

    context.keys().forEach((key: string) => {
        const parts = key.replace(/^\.\//, '').split('/');
        if (parts.length !== 3) return;
        const [colorOrType, suit, fileName] = parts;
        const cardName = fileName.replace(/\.png$/, '');

        cards[colorOrType] ??= {};
        cards[colorOrType][suit] ??= {};
        cards[colorOrType][suit][cardName] = context(key);
    });

    return cards;
};

const Cards = importAllCards();

const allCardSrcs: string[] = [];
Object.values(Cards).forEach(colorGroup =>
    Object.values(colorGroup).forEach(suitGroup =>
        Object.values(suitGroup).forEach(src => allCardSrcs.push(src))
    )
);

const pickRandom = (count: number): string[] =>
    Array(count)
        .fill(0)
        .map(
            () => allCardSrcs[Math.floor(Math.random() * allCardSrcs.length)]
        );

const Slots: React.FC = () => {
    const [turboOn, setTurboOn] = useState(false);
    const [autoOn, setAutoOn] = useState(false);

    const [reels, setReels] = useState<string[][]>(
        Array(4).fill(0).map(() => pickRandom(5))
    );
    const [status, setStatus] = useState<'idle'|'spinning'|'stopping'>('idle');
    const reelRefs = useRef<Array<HTMLDivElement| null>>([]);

    const handleSpin = () => {
        if (status !== 'idle') return;
        setStatus('spinning');

        const newCards = Array(4).fill(0).map(() => pickRandom(2));

        const linearDuration = 0.8 + Math.random() * 0.4; // 0.8–1.2s

        setTimeout(() => {
            reelRefs.current.forEach((reelEl, idx) => {
                if (!reelEl) return;
                const len = reels[idx].length;
                const finalIndex = Math.floor(Math.random()*2);
                const targetPos = (len - 2) + finalIndex;
                const offsetPercent = 50 + (targetPos / (len * 2)) * 100;
                reelEl.style.setProperty('--final-offset', `-${offsetPercent}%`);
            });

            setStatus('stopping');

            const easeDur = 0.8 + Math.random() * 0.6; // 0.8–1.4s
            setTimeout(() => {
                setReels(prev => prev.map((col, i) => {
                    return [...col.slice(2), ...newCards[i]];
                }));
                setStatus('idle');
            }, easeDur * 1000);
        }, linearDuration * 1000);
    };

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
                {reels.map((column, i) => { const padded = [...column, ...column];
                    return (
                        <div key={i} className={`slot ${status==='spinning' ? 'spinning' : ''} ${status==='stopping' ? 'stopping':''}`}>
                            <div className="reel"
                                 style={{
                                     '--linear-duration': `${(0.8 + Math.random() * 0.4)}s`,
                                     '--ease-duration': `${(0.8 + Math.random() * 0.6)}s`
                                 } as any}
                                 ref={el => {reelRefs.current[i] = el;}}>
                                {padded.map((src, idx) =>
                                    <section className="slot-section" key={idx}>
                                        <img src={src} alt="card"/>
                                    </section>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="buttons">
                <div className="stake-section">
                    <div className="stake-text">
                        Stake <input type="number" defaultValue={5} min={5}/> coins
                    </div>
                    <div className="min-stake-text">Minimal stake = 5 coins</div>
                </div>

                <div className="controls">
                    <button className={`side-button ${turboOn ? 'glow' : ''}`}
                            onClick={() => setTurboOn(t => !t)}>Turbo</button>
                    <button className="spin-button" onClick={handleSpin}>Spin</button>
                    <button className={`side-button ${autoOn ? 'glow' : ''}`}
                            onClick={() => setAutoOn(a => !a)}>Auto</button>
                </div>
            </div>
        </div>
    );
};

export default Slots;
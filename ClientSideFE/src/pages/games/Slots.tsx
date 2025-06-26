import React, {useState, useRef, useEffect} from 'react';
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

    const VISIBLE = 12;
    const SCROLL_COUNT = 80;
    const TOTAL_DURATION = 5000;

    const handleSpin = () => {
        if (status !== 'idle') return;
        setStatus('spinning');

        const longReels = Array(4)
            .fill(0)
            .map(() => pickRandom(SCROLL_COUNT));
        setReels(longReels);

        setTimeout(() => {
            setReels(prevLong => prevLong.map(col => col.slice(-VISIBLE)));
            setStatus('idle');
        }, TOTAL_DURATION);
    };

    useEffect(() => {
        if (status !== 'spinning') return;

        const listeners: Array<() => void> = [];

        reelRefs.current.forEach((reelEl, idx) => {
            if (!reelEl) return;

            // on each loop, append one new card
            const onLoop = () => {
                setReels(prev => prev.map((col, colIdx) => {
                    if (colIdx !== idx) return col;
                    // pick 1 new card; you can pick 2 or 3 if your "row" is more
                    const newCard = pickRandom(4)[0];
                    const newCol = [...col, newCard];

                    // to avoid unbounded growth, keep your last N cards
                    const MAX_VISIBLE = 12;
                    return newCol.slice(-MAX_VISIBLE);
                }));
            };

            reelEl.addEventListener('animationiteration', onLoop);
            listeners.push(() => reelEl.removeEventListener('animationiteration', onLoop));
        });

        // cleanup when we stop spinning
        return () => { listeners.forEach(remove => remove()); };
    }, [status]);


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
                {reels.map((column, i) => (
                    <div key={i} className={`slot ${status}`}>
                        <div
                            className="reel"
                            ref={el => {reelRefs.current[i] = el;}}
                            onAnimationEnd={() => {
                                // (optional) you could also do the final slicing here instead
                            }}
                            style={{
                                // only when spinning do we use a long scroll
                                '--spin-duration': `${TOTAL_DURATION}ms`,
                                '--scroll-distance': `${(reels[i].length - VISIBLE) * 33.33}%`,
                            } as any}
                        >
                            {reels[i].map((src, idx) => (
                                <section className="slot-section" key={idx}>
                                    <img src={src} alt="" />
                                </section>
                            ))}
                        </div>
                    </div>
                ))}
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
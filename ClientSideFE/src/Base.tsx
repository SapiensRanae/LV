import React from 'react';
import Header from './Header';
import * as styles from './styles.module.css';

const Base: React.FC = () => {
    return (
        <>
            <Header/>
            <body>
                <div className={styles.content}>
                    <h1 style={{ textAlign: 'center', color: '#FFFFFF', fontFamily: 'Montserrat', fontWeight: 'bold', fontSize: '4rem'}}>
                        GAME ACCOUNTS <br/>
                        <span style={{ color: '#8E4BF6'}}> FOR SALE</span></h1>
                    <p className={styles.customText} style={{ margin: '-1%', fontSize: '2.5rem', fontWeight: 'lighter'}}>
                        Buy trusted accounts for your favorite games</p>
                </div>
            </body>
        </>
    );
};

export default Base;
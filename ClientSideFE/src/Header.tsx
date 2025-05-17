import React from 'react';
import * as styles from './styles.module.css';

const Header: React.FC = () => (
    <header className={styles.header}>
        <nav>
            <a href="/" className={styles.logoLink}>
                <img src="https://i.imgur.com/gKxz4a5.png" className={styles.logoImg} alt="Logo" />
                TrustAccs
            </a>
        </nav>
        <nav className={styles.navLinks}>
            <a href="/test" className={styles.navLink}>Games</a>
            <a href="/about" className={styles.navLink}>About</a>
            <a href="/cart" className={styles.navLink}>Cart</a>
            <a href="/account" className={styles.navLink}>My Account</a>
        </nav>
    </header>
);

export default Header;
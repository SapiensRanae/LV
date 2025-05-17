import React from 'react';
import * as styles from './styles.module.css';
import sticker from './assets/sticker.jpg';
import sticker2 from './assets/sticker2.png';
import AudioPlayer from 'react-h5-audio-player';
import file from './assets/file.mp3';

interface AppProps {
    // define any props here, if needed
}

const App: React.FC<AppProps> = () => {
    return (
        <body style={{ backgroundColor: 'rgb(49,49,49)'}} className={styles.sideDecor}>
        <div style={{ textAlign: 'center', padding: '2rem'}}>
            <h1 className={styles.test}>Femboiz!</h1>
            <img src={"https://anime-body-pillow.com/cdn/shop/products/astolfo-outfit-body-pillow_720x.jpg?v=1624581010"} alt={'Femboiz!'}></img>

            <div>
                <img src={sticker2} alt={'Zakhar!'} style={{width: '400px', height: '400px'}}></img>
                <video src={'https://i.imgur.com/DfNq9zS.mp4'} autoPlay={true} loop={true} controls={true}></video>
                <img src={sticker} alt={'Boykisser!'}></img>
            </div>
            <AudioPlayer
                autoPlay={true}
                src={file}
                loop={true}
                // other props: volume, loop, onEnded, etc.
            />
        </div>
        </body>
    );
};

export default App;
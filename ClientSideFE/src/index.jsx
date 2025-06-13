import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import faviconUrl from '../public/assets/LuckyVegasLogoStandard.png';
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>

        </BrowserRouter>
    </React.StrictMode>


);

const link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement('link');
link.type = 'image/png';
link.rel = 'shortcut icon';
link.sizes = '64x64';
link.href = faviconUrl;
document.getElementsByTagName('head')[0].appendChild(link);
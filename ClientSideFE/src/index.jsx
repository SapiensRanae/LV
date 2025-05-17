import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Base from './Base';
import Test from './Test';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Base />} />
            <Route path="/test" element={<Test />} />
        </Routes>
    </BrowserRouter>
);
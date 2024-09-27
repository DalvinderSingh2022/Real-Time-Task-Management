import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles/index.css";
import { AppProvider } from './store/AppContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AppProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AppProvider>
);
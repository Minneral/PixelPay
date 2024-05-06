import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import MainView from './views/MainView';
import MarketView from './views/MarketView';
import ProfileView from './views/ProfileView';
import CartView from './views/CartView';
import ListingView from './views/ListingView';
import NotFoundView from './views/NotFoundView';
import App from './App';
import { getToken } from './services/sessionStorage';

const AppRoutes: React.FC = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainView />} />
                <Route path='/market' element={<MarketView />} />
                <Route path='/profile' element={<ProfileView />} />
                <Route path='/cart' element={<CartView />} />
                <Route path='/listing' element={<ListingView />} />
                <Route path='/app' element={<App />} />
                <Route path='*' element={<NotFoundView />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;

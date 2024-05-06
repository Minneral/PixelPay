// services/api.js
import axios from 'axios';
import { getToken } from './sessionStorage';

export const api = axios.create({
    baseURL: 'http://api.develop',
    headers: { 'Content-type': 'application/json;charset=utf-8' },
});

// Перехватчик запроса для установки заголовка Authorization
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api_getNavigation = (game: string | null = "") => api.get('/INavigation/GetNavigation/' + game);
export const api_getGames = () => api.get('/IGame/GetGames');
export const api_getFilters = (game: string = "") => api.get('/IFilter/GetFilters/' + game);
export const api_getCategories = (game: string = "") => api.get('/IFilter/GetCategories/' + game);
export const api_getListings = (game: string = "") => api.get('/IListing/GetListings/' + game);
export const api_getListingFilters = (filter_ids: string = "") => api.post('/IListing/GetListingFilters', { "filter_ids": filter_ids });


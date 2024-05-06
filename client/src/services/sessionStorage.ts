// services/sessionStorage.js

import { json } from "stream/consumers";
import { CartType, NavigationTree, UserType } from "../types/apiTypes";

export const setToken = (token: string) => sessionStorage.setItem('token', token);
export const getToken = () => sessionStorage.getItem('token');
export const removeToken = () => sessionStorage.removeItem('token');

export const setUserInfo = (userinfo: UserType) => {
    userinfo ?
        sessionStorage.setItem('userinfo', JSON.stringify(userinfo)) : sessionStorage.setItem('userinfo', "")
}
export const getUserInfo = (): UserType => {
    const userInfo = sessionStorage.getItem('userinfo');
    return userInfo ? JSON.parse(userInfo)[0] : null;
}
export const removeUserInfo = () => sessionStorage.removeItem('userinfo');

export const setMarketGame = (game: string) => sessionStorage.setItem('marketGame', game);
export const getMarketGame = () => sessionStorage.getItem('marketGame');
export const removeMarketGame = () => sessionStorage.removeItem('marketGame');


export const setNavigation = (navigation: NavigationTree[]) => sessionStorage.setItem('navigation', JSON.stringify(navigation));
export const getNavigation = (): NavigationTree[] => {
    const navigation = sessionStorage.getItem('navigation');
    return navigation ? JSON.parse(navigation) : [];
}

export const setGames = (games: string[]) => sessionStorage.setItem('games', JSON.stringify(games));
export const getGames = (): string[] => {
    const games = sessionStorage.getItem('games');
    return games ? JSON.parse(games) : [];
}

export const setCart = (cart: CartType[]) => sessionStorage.setItem('cart', JSON.stringify(cart));
export const getCart = (): CartType[] => {
    const cart = sessionStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

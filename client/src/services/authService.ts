// services/authService.js
import { api } from './api';
import '../types/apiTypes';
import { CartDeleteDataType, ChangePasswordFormDataType, LoginFormDataType, RegisterFormDataType } from '../types/apiTypes';

export const api_login = (credentials: LoginFormDataType) => api.post('/IUser/Login', credentials);
export const api_register = (credentials: RegisterFormDataType) => api.post('/IUser/Register', credentials);
export const api_getUserInfo = () => api.get('/IUser/GetUserInfo');
export const api_getUserAvatar = () => api.get('/IUser/GetAvatarImage');
export const api_isNameAvailable = (name: string) => api.post('/IUser/IsNameAvailable', { "name": name });
export const api_getUserPurchases = () => api.get('/IUser/GetPurchases');
export const api_getUserTransactions = () => api.get('/IUser/GetTransactions');
export const api_getCart = () => api.get('/IUser/GetCart');
export const api_cartPush = (credentials: CartDeleteDataType) => api.post('/IUser/CartPush', credentials);
export const api_cartPop = (credentials: CartDeleteDataType) => api.post('/IUser/CartPop', credentials);
export const api_clearCart = () => api.get('/IUser/ClearCart');
export const api_buyCart = () => api.get('/IUser/BuyCart');
export const api_updateTradeLink = (trade: string) => api.post('/IUser/UpdateTradeLink', { "tradeLink": trade });
export const api_changePassword = (credentials: ChangePasswordFormDataType) => api.post('/IUser/ChangePassword', credentials);
export const api_changeAvatar = (avatar: string) => api.post('/IUser/ChangeAvatar', {"avatar" : avatar});


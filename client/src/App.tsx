import React, { useState, useRef, FormEvent } from 'react';
import AppRoutes from './routes';
import { api_getNavigation } from './services/api';
import { api_getUserInfo, api_login } from './services/authService';
import { setToken } from './services/sessionStorage';

export default function App() {
  const [info, setInfo] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleGetNavigation = async () => {
    try {
      const response = await api_getNavigation();
      setInfo(JSON.stringify(response.data.data));
    } catch (e) {
      console.log(e);
    }
  }

  const handleLogin = async (e: FormEvent) => {
    try {
      e.preventDefault();

      const nameValue = nameRef.current ? nameRef.current.value : '';
      const passwordValue = passwordRef.current ? passwordRef.current.value : '';

      const credentials = {
        "name": nameValue,
        "password": passwordValue
      }

      const response = await api_login(credentials);
      const data = response.data;

      if (data.status !== 'ERROR')
        setToken(data.data.jwt);

      setInfo(JSON.stringify(response.data));
    } catch (e) {
      console.log(e);
    }
  }

  const handleGetUserInfo = async () => {
    try {
      const response = await api_getUserInfo();
      setInfo(JSON.stringify(response.data));
    } catch (e) {
      console.log(e);
    }
  }

  const reset = () => {
    setInfo('');
  }

  const logout = () => {
    setToken('');
    reset();
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <button onClick={reset}>Сброс</button>
        <button onClick={handleGetNavigation}>Навигация</button>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="">Name</label>
          <input type="text" ref={nameRef} />
          <label htmlFor="">Password</label>
          <input type="password" ref={passwordRef} />
          <input type="submit" value='Войти' style={{ marginTop: "10px" }} />
        </form>
        <button onClick={handleGetUserInfo}>Профиль</button>
        <button onClick={logout}>Выйти</button>
      </div>

      <div style={{ padding: "20px" }}>{info}</div>
    </>
  )
}

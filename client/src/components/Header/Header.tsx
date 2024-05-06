import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from "../../assets/img/logo.png";
import search from "../../assets/icons/search.png";

import "../../styles/header.scss"
import { getGames, getMarketGame, getNavigation, getToken, getUserInfo, removeMarketGame, removeToken, removeUserInfo, setGames, setMarketGame, setNavigation, setToken, setUserInfo } from '../../services/sessionStorage';
import { api_getUserAvatar, api_getUserInfo, api_isNameAvailable, api_login, api_register } from '../../services/authService';
import { ApiResponseType, GameType, NavigationTree, NavigationType, UserType } from '../../types/apiTypes';
import { Exception } from 'sass';
import { jwtDecode } from 'jwt-decode';
import Notification from '../Notification/Notification';
import { error } from 'console';
import { api_getGames, api_getNavigation } from '../../services/api';
import Dropdown from '../Dropdown/Dropdown';
import { arraysEqual } from '../../utils/Equals';


export default function Header() {

    const navigate = useNavigate();

    // Принудительное обновление useEffect
    const [seed, setSeed] = useState<number>(0);

    // Открыты ли модальные окна
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    // Флаг проверки существования имени
    const [isNameExists, setIsNameExists] = useState(false);

    // Дополнительная проверка установленного JWT, если тот истек и надо выйти из сессии
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Ошибки при валидации
    const [ValidationErrors, setValidationErrors] = useState<string[]>([]);

    // Объект сообщения
    const [notification, setNotification] = useState({
        message: "",
        isVisible: false
    });

    // Дерево ВСЕЙ навигации

    // Данные для отправки в запросе
    const [credentials, setCredentials] = useState({
        "name": "",
        "password": "",
        "passwordConfirmation": "",
        "email": "",
    });

    // Список всех игр

    // Очистить данные для отправки
    const resetCredentials = () => {
        setCredentials({
            "name": "",
            "password": "",
            "passwordConfirmation": "",
            "email": "",
        });
    }

    const resetValidation = () => {
        try {
            setValidationErrors([]);
            const elements = document.querySelectorAll('.input-error');

            elements.forEach(element => {
                element.classList.remove('input-error');
                const nextElement = element.nextElementSibling;
                if (nextElement) {
                    nextElement.innerHTML = "";
                }
            });
        }
        catch (ex) {

        }
    }

    // Обновление credentials при изменении в полях ввода
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const { name, value } = e.target;
            setCredentials({
                ...credentials,
                [name]: value,
            });
        }
        catch (ex) {

        }
    }

    // Валидация при фокусе полей
    const handleInputValidate = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const name = e.target.name;
        const value = e.target.value;
        const nextElement = e.target.nextElementSibling;

        try {
            if (value == "")
                throw new Error("Это поле не может быть пустым");

            switch (name) {
                case 'name':
                    const nameRegex = /^[a-zA-Z0-9_]{3,20}$/;
                    if (!value.match(nameRegex)) {
                        throw new Error("Введенное имя не соответствует требованиям");
                    }

                    if (e.target.parentElement?.id === 'register_name') {
                        const response = await api_isNameAvailable(credentials.name);
                        const data: ApiResponseType = response.data;

                        if (data.status == "OK") {
                            if (data.message !== "NAME_AVAILABLE")
                                throw Error("Пользователь с таким именем уже существует!");
                        }
                    }

                    break;

                case "passwordConfirmation":
                    if (credentials.password !== value)
                        throw Error("Пароли не совпадают!");
                    break;

                case 'email':
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!value.match(emailRegex)) {
                        throw new Error("Введенный Email не соответствует требованиям");
                    }
                    break;

            }


            e.target.classList.remove('input-error');
            var index = ValidationErrors.indexOf(name);
            if (index !== -1) {
                setValidationErrors(prev => prev.splice(index, 1));
                if (nextElement) {
                    nextElement.innerHTML = "";
                }
            }
        }
        catch (ex) {
            if (ex instanceof Error) {
                e.target.classList.add('input-error');
                if (nextElement) {
                    nextElement.innerHTML = ex.message;
                }

                var index = ValidationErrors.indexOf(name);
                if (index === -1) {
                    setValidationErrors(prev => [...prev, name]);
                }
            }
        }
    }

    // Метод вызова уведомления
    const showNotification = (message: string, delay: number) => {
        try {
            setNotification({
                message: message,
                isVisible: true
            });

            setTimeout(() => {
                setNotification({
                    message: "",
                    isVisible: false
                });
            }, delay);
        }
        finally {

        }
    }

    // Метод авторизации
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (ValidationErrors.length === 0 && credentials.name && credentials.password) {
                const response = await api_login(credentials);
                const data: ApiResponseType = response.data;

                if (data.status == "OK") {
                    setToken(data.data.jwt);

                    const userInfo = await api_getUserInfo();
                    let userData: ApiResponseType = userInfo.data;

                    if (userData.status == "OK") {
                        setUserInfo(userData.data);

                        setIsLoginModalOpen(false);
                        window.location.reload();
                    }
                }
                else {
                    throw Error(data.message);
                }
            }

        }
        catch (ex) {
            if (ex instanceof Error) {
                showNotification(ex.message, 3000);
            }
        }
    }

    // Открыть - закрыть модальное окно Авторизации
    const handleOpenLoginModal = () => {
        setIsLoginModalOpen(prev => (!prev))
        resetCredentials();
    }

    const handleCloseLoginModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLoginModalOpen(prev => (!prev));
        resetCredentials();
        resetValidation();
    }

    // Метод регистрации
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (ValidationErrors.length === 0 && credentials.email && credentials.name && credentials.password && credentials.passwordConfirmation) {
                const response = await api_register(credentials);
                const data: ApiResponseType = response.data;

                if (data.status == "OK") {
                    showNotification("Пользователь успешно создан!", 3000);
                    resetCredentials();
                    setIsRegisterModalOpen(false);
                }
                else {
                    throw Error(data.message);
                }
            }

        }
        catch (ex) {
            if (ex instanceof Error) {
                showNotification(ex.message, 3000);
            }
        }
    }

    // Открыть - закрыть модальное окно Регистрации
    const handleOpenRegisterModal = () => {
        setIsRegisterModalOpen(prev => (!prev))
        resetCredentials();
    }

    const handleCloseRegisterModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsRegisterModalOpen(prev => (!prev))
        resetCredentials();
        resetValidation();
    }

    // Построить дерево (Рекурсивный метод)
    const buildTree = (data: NavigationType[], parentId: number = 0): NavigationTree[] => {
        return data
            .filter(item => item.parent_id == parentId)
            .map(item => ({
                ...item,
                children: buildTree(data, item.id)
            }));
    }

    // Инициализировать navigation
    const initNavigationData = async () => {
        try {
            // Если игра установлена в сессии
            if (getMarketGame() != null) {
                const game = getMarketGame();
                const response = await api_getNavigation(game);
                const data: ApiResponseType = response.data;

                if (data.status === "OK") {
                    let treeData: NavigationType[] = data.data;

                    let tree = buildTree(treeData);

                    let nav = getNavigation();
                    if (!arraysEqual(tree, nav)) {
                        setNavigation(tree);
                        setSeed(Math.random());
                    }
                    console.log("InitNavigation");
                }
            }
            else {
                const getGames = async () => {
                    const response = await api_getGames();
                    const data: ApiResponseType = response.data;
                    return data;
                }

                getGames()
                    .then(response => {
                        setMarketGame(response.data[0].game);
                        let data: GameType[] = response.data;
                        setGames(data.map(item => {
                            return item.game
                        }));
                    })

                setSeed(Math.random());
            }
        }
        catch (ex) {
            return null;
        }
    }

    const handleProfileClick = () => {
        navigate('/profile');
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formFields = form.elements[0] as HTMLInputElement;

        navigate('/market?search=' + formFields.value);
    }


    // Проверка токена на срок действия
    useEffect(() => {
        try {
            console.log("h1");
            const serverTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Minsk' });
            const millisecondsSinceEpoch = new Date(serverTime).getTime();
            const seconds = Math.floor(millisecondsSinceEpoch / 1000);

            const token = getToken();
            if (token !== null) {
                let payload = jwtDecode(token);
                let exp = payload.exp ? payload.exp : 0;
                if (exp >= Number(seconds) && getUserInfo() != null) {
                    setIsLoggedIn(true);

                    api_getUserInfo()
                        .then(response => response.data)
                        .then(response => {
                            const res: ApiResponseType = response;

                            if (res.status == "OK") {
                                setUserInfo(res.data);
                            }
                        });
                }
            }
            else {
                setIsLoggedIn(false);
            }
        }
        catch (ex) {

        }
    }, [])

    // Инициализация навигации и списка всех игр
    useEffect(() => {
        try {
            console.log("h2");
            initNavigationData();
        }
        catch (ex) {

        }
    }, [seed])

    return (
        <header className="header">
            <div className="header__container">
                <div className="header__inner">
                    <div className="header__upper">
                        <div className='header__upperInfo'>
                            <Link to="/"><img src={logo} alt="logo" /></Link>

                            <div className="header__upperNav">
                                <div className="header__upperNavItem">
                                    <div className="header__upperNavItem_menu">
                                        <div className="header__upperNavItem_menu_title">
                                            {getMarketGame()}
                                            <span> &#9654;</span>
                                        </div>

                                        <div className="header__upperNavItem_menu_body">
                                            {
                                                getGames().map((item, index) => {
                                                    return <div onClick={() => {
                                                        setMarketGame(item)
                                                        setSeed(Math.random())
                                                    }} className="header__upperNavItem_menu_item" key={index}>
                                                        {item}
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="header__upperNavItem"><Link to="/market">МАРКЕТ</Link></div>
                            </div>
                        </div>

                        <form className="header__search" onSubmit={handleSearch}>
                            <input type="text" placeholder='ПОИСК ПО CS2' />
                        </form>

                        <div className="header__userNav">
                            <div className="header__cart"><Link to="/cart">Корзина</Link></div>


                            {
                                !isLoggedIn ?
                                    <div className="header__auth">
                                        <div className="header__signin" onClick={handleOpenLoginModal}>
                                            Войти
                                        </div>

                                        <div className="header__signup" onClick={handleOpenRegisterModal}>
                                            Регистрация
                                        </div>
                                    </div>
                                    :
                                    <div className='header__user'>
                                        <div className="header__user-balance">
                                            {getUserInfo() ? (getUserInfo().balance + " BYN") : ""}
                                        </div>
                                        <div className="header__user-name" onClick={handleProfileClick}>
                                            {getUserInfo() ? getUserInfo().name : ""}
                                        </div>

                                        <div className="header__user-avatar" onClick={handleProfileClick}>
                                            <img src={"data:image/png;base64," + getUserInfo().avatar} alt="avatar" />
                                        </div>
                                    </div>

                            }

                        </div>

                        {notification.isVisible && <Notification message={notification.message} />}

                        <div className={"modal " + (isLoginModalOpen ? "block" : "hidden")} onClick={handleCloseLoginModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <span className='modal-close' onClick={handleCloseLoginModal}>&times;</span>
                                <div className="modal-title">Авторизация</div>

                                <form className='modal-form' onSubmit={handleLogin}>
                                    <div className="modal-form-item">
                                        <label htmlFor="">Имя пользователя</label>
                                        <input className={isNameExists ? "input-error" : ""}
                                            type="text"
                                            name='name'
                                            value={credentials.name}
                                            onChange={handleInputChange}
                                            onBlur={handleInputValidate} />
                                        <div className="modal-error-message"></div>
                                    </div>

                                    <div className="modal-form-item">
                                        <label htmlFor="">Пароль</label>
                                        <input type="password"
                                            name='password'
                                            value={credentials.password}
                                            onChange={handleInputChange}
                                            onBlur={handleInputValidate} />
                                        <div className="modal-error-message"></div>

                                    </div>

                                    <div className="modal-form-item">
                                        <button type='submit'>Войти</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className={"modal " + (isRegisterModalOpen ? "block" : "hidden")} onClick={handleCloseRegisterModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <span className='modal-close' onClick={handleCloseRegisterModal}>&times;</span>
                                <div className="modal-title">Регистрация</div>

                                <form className='modal-form' onSubmit={handleRegister}>
                                    <div className="modal-form-item" id='register_name'>
                                        <label htmlFor="">Имя пользователя</label>
                                        <input type="text"
                                            name='name'
                                            value={credentials.name}
                                            onChange={handleInputChange}
                                            onBlur={handleInputValidate} />
                                        <div className="modal-error-message"></div>
                                    </div>

                                    <div className="modal-form-item">
                                        <label htmlFor="">Email</label>
                                        <input type="text"
                                            name='email'
                                            value={credentials.email}
                                            onChange={handleInputChange}
                                            onBlur={handleInputValidate} />
                                        <div className="modal-error-message"></div>
                                    </div>

                                    <div className="modal-form-item">
                                        <label htmlFor="">Пароль</label>
                                        <input type="password"
                                            name='password'
                                            value={credentials.password}
                                            onChange={handleInputChange}
                                            onBlur={handleInputValidate} />
                                        <div className="modal-error-message"></div>
                                    </div>

                                    <div className="modal-form-item">
                                        <label htmlFor="">Повторите пароль</label>
                                        <input type="password"
                                            name='passwordConfirmation'
                                            value={credentials.passwordConfirmation}
                                            onChange={handleInputChange}
                                            onBlur={handleInputValidate} />
                                        <div className="modal-error-message"></div>
                                    </div>



                                    <div className="modal-form-item">
                                        <button type='submit'>Зарегистрироваться</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="header__lower">
                        {
                            getNavigation().map((item, index) => {
                                return <Dropdown data={[item]} key={index} />
                            })
                        }
                    </div>
                </div>
            </div>
        </header>
    )
}

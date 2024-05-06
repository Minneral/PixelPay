import React, { useState } from 'react'
import { CardPropsType } from '../../types/commonTypes'

import s from "./Card.module.scss";
import Button from '../Button/Button';
import { getCart } from '../../services/sessionStorage';
import { api_cartPop, api_cartPush } from '../../services/authService';
import Notification from '../Notification/Notification';
import { ApiResponseType } from '../../types/apiTypes';

export default function Card(props: CardPropsType) {

    // Объект сообщения
    const [notification, setNotification] = useState({
        message: "",
        isVisible: false
    });

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

    const handleAddToCart = () => {
        try {
            api_cartPush({ "listing_id": String(props.id) })
                .then(response => response.data)
                .then((response: ApiResponseType) => {
                    if (response.status === "OK") {
                        window.location.reload();
                    }
                    else {
                        showNotification(response.message, 3000);
                    }
                })

        }
        catch (ex) {
        }
    }

    const handleDeleteFromCart = () => {
        try {
            api_cartPop({ "listing_id": String(props.id) })
                .then(response => response.data)
                .then((response: ApiResponseType) => {
                    if (response.status === "OK") {
                        window.location.reload();
                    }
                    else {
                        showNotification(response.message, 3000);
                    }
                })
        }
        catch (ex) {
        }
    }

    return (
        <>
            {notification.isVisible && <Notification message={notification.message} />}

            <div className={s.card}>
                <div className={s.card__inner}>
                    <div className={s.card__img}>
                        <img src={props.url} alt="icon" />
                    </div>

                    <div className={s.card__name}>
                        {props.name}
                    </div>

                    <div className={s.card__price}>
                        {props.price} <span>BYN</span>
                    </div>

                    {getCart().reduce((acc, item) => {
                        return acc || item.id === props.id;
                    }, false) ?
                        <Button title='Удалить из корзины' fz={14} fw={600} callBack={handleDeleteFromCart} stretch={true} color='var(--red)' />
                        :
                        <Button title='В корзину' fz={14} fw={600} callBack={handleAddToCart} stretch={true} />
                    }

                </div>
            </div>
        </>
    )
}

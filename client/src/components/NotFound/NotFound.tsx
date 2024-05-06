import React from 'react'

import s from "./NotFound.module.scss";
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {

    const navigate = useNavigate();

    const handleHomeNavigate = () => {
        navigate('/');
    }

    return (
        <>
            <main className={s.main}>
                <div className={s.main__inner}>
                    <h1>Ошибка 404<span>Страница не найдена</span></h1>

                    <Button title='На главную' fz={32} fw={700} stretch={false} callBack={handleHomeNavigate} />
                </div>

            </main>

        </>

    )
}

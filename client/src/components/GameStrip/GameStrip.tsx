import React, { useEffect, useState } from 'react'

import { GameStripPropsType } from '../../types/commonTypes';
import s from "./GameStrip.module.scss";
import { Link, useNavigate } from 'react-router-dom';
import { api_getListings } from '../../services/api';
import { ApiResponseType, CartType, ListingType } from '../../types/apiTypes';
import Card from '../Card/Card';
import { setMarketGame } from '../../services/sessionStorage';


export default function GameStrip(props: GameStripPropsType) {

    const navigate = useNavigate();
    const [cards, setCards] = useState<React.ReactElement[]>([]);

    const handleClick = (e: React.MouseEvent) => {
        setMarketGame(props.game);
        navigate("/market");
    }

    useEffect(() => {
        try {
            setCards([]);

            api_getListings(props.game)
                .then(response => response.data)
                .then((response: ApiResponseType) => {
                    if (response.status === "OK") {
                        return response.data;
                    }
                })
                .then((data: ListingType[]) => {
                    data.forEach(item => {
                        setCards(prev => {
                            return data.slice(0, 6).map(item => (
                                <Card key={item.id} id={item.id} name={item.item} price={item.price} url={item.url} />
                            ));
                        });

                    })
                })
        } catch (ex) {

        }
    }, [])

    return (
        <div className={s.strip}>
            <div className={s.strip__info}>
                <div className={s.strip__game}>
                    <div className={s.strip__icon}>
                        <img src={props.iconUrl} alt="icon" />
                    </div>

                    <div className={s.strip__name}>
                        {props.game}
                    </div>
                </div>

                <div className={s.strip__market} onClick={handleClick}>
                    {"Посмотреть все скины >"}
                </div>
            </div>

            <div className={s.strip__cards}>
                {cards}
            </div>
        </div>
    )
}

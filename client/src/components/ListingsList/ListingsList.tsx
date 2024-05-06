import { useEffect, useState } from "react"
import { ApiResponseType, ListingType } from "../../types/apiTypes";
import { api_getListings } from "../../services/api";
import { getMarketGame } from "../../services/sessionStorage";
import Card from "../Card/Card";

import s from "./ListingList.module.scss";

export default function ListingsList(props: { listings: ListingType[], search: string }) {

    return (
        <div className={s.list}>
            {
                props.listings.length ?
                    props.search ?
                        props.listings.map((item, index) => (
                            item.item.toLocaleLowerCase().includes(props.search.toLocaleLowerCase()) ?
                                <Card id={item.id} name={item.item} price={item.price} url={item.url} key={index} />
                                : false
                        ))
                        :
                        props.listings.map((item, index) => (
                            <Card id={item.id} name={item.item} price={item.price} url={item.url} key={index} />
                        ))
                    :
                    <h1>Нет результатов</h1>
            }
        </div>
    )
}

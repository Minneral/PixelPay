import React from 'react'
import { DropdownPropsType } from '../../types/commonTypes';
import { NavigationTree } from '../../types/apiTypes';
import s from "./Dropdown.module.scss";

export default function Dropdown(props: DropdownPropsType) {

    const renderList = (items: NavigationTree[], isFirstLevel: boolean = true) => {
        return items.map((item, index) => (
            <li key={item.id} className={s.menu__item + " " + (isFirstLevel ? s.menu__firstLevel : '')}>
                <div className={`${s.menu__itemTitle} ${isFirstLevel ? s.menu__firstTitle : ''}`}>
                    {item.name}
                    {isFirstLevel && index === 0 && <span className={s.triangle}> &#9654;</span>}
                </div>
                {item.children && <ul className={s.submenu}>{renderList(item.children, false)}</ul>}
            </li>
        ));
    };

    return (
        <ul className={s.menu}>
            {renderList(props.data)}
        </ul>
    )
}

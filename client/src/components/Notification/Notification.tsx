import React, { useEffect, useState } from 'react'
import { NotificationPropsType } from '../../types/commonTypes'
import s from "./Notification.module.scss";

export default function Notification(props: NotificationPropsType) {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    }

    return (
        <div className={`${s.notification} ${isVisible ? 'visible' : s.hidden}`}>
            <div className={s.notification__message}>
                {
                    props.message
                }
            </div>

            <div className={s.notification__close} onClick={handleClose}>Закрыть</div>
        </div>
    )
}

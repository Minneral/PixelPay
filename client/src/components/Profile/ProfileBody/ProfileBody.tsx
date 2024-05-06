import React, { useEffect, useState } from 'react'

import s from "./ProfileBody.module.scss";
import ProfileSettings from '../ProfileSettings/ProfileSettings';
import ProfilePurchases from '../ProfilePurchases/ProfilePurchases';
import ProfileTransactions from '../ProfileTransactions/ProfileTransactions';
import { getUserInfo } from '../../../services/sessionStorage';

export default function ProfileBody() {

  const nameToComponents: Record<string, React.ReactElement> = {
    'Настройки': <ProfileSettings />,
    'Мои покупки': <ProfilePurchases />,
    'Транзакции': <ProfileTransactions />,
  }

  const [page, setPage] = useState('Настройки');
  const [bodyView, setBodyView] = useState<React.ReactElement>(nameToComponents[page]);

  useEffect(() => {
    var elements = document.querySelectorAll(`.${s.profile__navLink}`);
    elements.forEach((item) => {

      item.classList.remove(s.profile__navLink_active);

      if (item.innerHTML == page) {
        item.classList.add(s.profile__navLink_active)
      }
    })
  }, [page])

  const handleChangeView = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    const name = element.innerHTML;

    setPage(name);
    setBodyView(nameToComponents[name]);
  }

  return (
    <div className={s.profile}>
      <div className="profile__container">
        <div className={s.profile__inner}>
          <div className={s.profile__info}>
            <div className={s.profile__title}>
              {page}
            </div>

            <div className={s.profile__nav}>
              <div className={s.profile__navLink} onClick={handleChangeView}>
                Настройки
              </div>
              <div className={s.profile__navLink} onClick={handleChangeView}>
                Мои покупки
              </div>
              <div className={s.profile__navLink} onClick={handleChangeView}>
                Транзакции
              </div>
            </div>
          </div>

          <div className={s.profile__body}>
            {getUserInfo() ? bodyView : ""}
          </div>

        </div>
      </div>

    </div>
  )
}

import { useState } from "react";
import { getUserInfo, removeToken, removeUserInfo, setUserInfo } from "../../../services/sessionStorage";
import s from "./ProfileSettings.module.scss";
import { api_changeAvatar, api_changePassword, api_updateTradeLink } from "../../../services/authService";
import Notification from '../../Notification/Notification';

import okIcon from "../../../assets/icons/ok.png";
import { ApiResponseType } from "../../../types/apiTypes";
import Button from "../../Button/Button";

export default function ProfileSettings() {

  const [tradelink, setTradeLink] = useState(getUserInfo().tradelink ? getUserInfo().tradelink : "");
  const [avatarState, setAvatarState] = useState<boolean>(true);
  const [notification, setNotification] = useState({
    message: "",
    isVisible: false
  });
  // Данные для отправки в запросе
  const [credentials, setCredentials] = useState({
    "oldPass": "",
    "newPass": "",
    "newConf": "",
  });

  // Очистить данные для отправки
  const resetCredentials = () => {
    setCredentials({
      "oldPass": "",
      "newPass": "",
      "newConf": "",
    });
  }

  const handleUpdateTradeLink = (e: React.FormEvent) => {
    e.preventDefault();

    if (tradelink && tradelink !== getUserInfo().tradelink)
      api_updateTradeLink(tradelink)
        .then(Response => Response.data)
        .then((response: ApiResponseType) => {
          if (response.status === "OK") {
            const quick: any = [{ ...getUserInfo(), "tradelink": tradelink }]

            setUserInfo(quick);
            showNotification("Ссылка на обмен установлена!", 3000);
          }
        })
  }

  const handleChangeAvatarState = (e: React.MouseEvent) => {
    resetCredentials();
    setAvatarState(prev => !prev);
  }

  const handleChangeAvatar = () => {
    const form = document.createElement('form');
    const input = document.createElement('input');

    input.type = "file";
    input.click();

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target?.files?.length) {
        const file = target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file); // Читаем файл как base64 строку

        reader.onload = (readerEvent) => {
          const content: string | null = readerEvent.target?.result as string | null;
          if (content) {
            api_changeAvatar(content)
              .then(() => {
                window.location.reload();
              });
          }
        };
      }
    };
  };

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

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    api_changePassword(credentials)
      .then(res => res.data)
      .then((res: ApiResponseType) => {
        if (res.status == "OK") {
          showNotification("Пароль изменен", 3000);
          resetCredentials();
        }
        else {
          showNotification(res.message, 3000);
        }
      })
  }

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

  // Метод деавторизации
  const handleLogout = () => {
    try {
      removeUserInfo();
      removeToken();
      window.location.reload();
    }
    catch (ex) {

    }
  }

  return (
    <>
      {notification.isVisible && <Notification message={notification.message} />}

      <div className={s.body}>
        <div className={s.body__inner}>
          <div className={s.body__general}>
            <div className={s.body__title}>
              <span>Общее</span>

              <span id={s.change_password} onClick={handleChangeAvatarState}>{avatarState ? "Изменить пароль" : "Изменить аватар"}</span>
            </div>

            <div className={s.item}>
              <div className={s.item__title}>
                Имя пользователя:
              </div>

              <div className={s.item__value}>
                {getUserInfo().name}
              </div>
            </div>

            <div className={s.item}>
              <div className={s.item__title}>
                Email:
              </div>

              <div className={s.item__value}>
                {getUserInfo().email}
              </div>
            </div>

            <div className={s.item}>
              <div className={s.item__title}>
                Ссылка на обмен:
              </div>

              <div className={s.item__value}>
                <form className={s.TradeLinkform} onSubmit={handleUpdateTradeLink}>
                  <input type="text" value={tradelink} onChange={(e) => { setTradeLink(e.target.value) }} />

                  <button type="submit"><img src={okIcon} /></button>
                </form>
              </div>
            </div>

            <Button title="Выйти из учетной записи" fw={500} fz={20} stretch={true} callBack={handleLogout}/>

          </div>

          <div className={s.body__social}>
            <div className={s.body__socialContent}>
              <div className={s.body__title}>
                <span>{avatarState ? "Аватар" : "Обновите пароль"}</span>
              </div>

              {avatarState ?
                <div className={s.body__avatar}>
                  <img src={"data:image/png;base64," + getUserInfo().avatar} alt="avatar" />

                  <Button title="Обновить аватар" fz={20} fw={500} stretch={true} callBack={handleChangeAvatar} />
                </div>
                :
                <div className={s.body__changePassword}>
                  <form onSubmit={handleChangePassword}>

                    <div className={s.form__item}>
                      <input type="password" placeholder="Старый пароль" name="oldPass" value={credentials.oldPass} onChange={handleInputChange} />
                    </div>

                    <div className={s.form__item}>
                      <input type="password" placeholder="Новый пароль" name="newPass" value={credentials.newPass} onChange={handleInputChange} />
                    </div>

                    <div className={s.form__item}>
                      <input type="password" placeholder="Повторите новый пароль" name="newConf" value={credentials.newConf} onChange={handleInputChange} />
                    </div>

                    <div className={s.form__item}>
                      <input type="submit" />
                    </div>
                  </form>
                </div>
              }
            </div>
          </div>


        </div>
      </div>

    </>
  )
}

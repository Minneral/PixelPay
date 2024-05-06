import React, { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

import "../styles/CartView.scss";
import Button from '../components/Button/Button';
import { api_buyCart, api_cartPop, api_clearCart, api_getCart } from '../services/authService';
import { ApiResponseType, CartType } from '../types/apiTypes';
import Notification from '../components/Notification/Notification';

import cs2Icon from "../assets/icons/cs2.png";
import dota2Icon from "../assets/icons/dota2.png";
import rustIcon from "../assets/icons/rust.png";
import trashIcon from "../assets/icons/trash.png";

export default function CartView() {

  const [cartGames, setCartGames] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartType[]>([]);

  const game_to_icon = {
    "CS2": cs2Icon,
    "Dota2": dota2Icon,
    "Rust": rustIcon,
  }

  // Объект сообщения
  const [notification, setNotification] = useState({
    message: "",
    isVisible: false
  });

  const handleDeleteItem = (e: React.MouseEvent) => {
    const element = e.currentTarget as HTMLElement;
    const listing_id = element.getAttribute('data-id');

    if (listing_id !== null)
      api_cartPop({ "listing_id": listing_id })
        .then(response => response.data)
        .then((Response: ApiResponseType) => {
          if (Response.status === "OK") {
            window.location.reload();
          }
          else {
            showNotification(Response.message, 3000)
          }
        })
  }

  const handleClearCart = (e: React.MouseEvent) => {
    api_clearCart()
      .then(response => response.data)
      .then((response: ApiResponseType) => {
        if (response.status === "ERROR") {
          showNotification(response.message, 3000);
        }
        else {
          window.location.reload();
        }
      })
  }

  const handleBuyCart = () => {
    api_buyCart()
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

  useEffect(() => {
    try {
      api_getCart()
        .then(response => response.data)
        .then((response: ApiResponseType) => {
          if (response.status === "OK") {
            const data: CartType[] = response.data;

            const uniqueGamesSet = new Set(data.map(item => item.game));
            const uniqueGamesArray = Array.from(uniqueGamesSet);
            setCartGames(uniqueGamesArray);
            setCartItems(data);
          }
          else {
            showNotification(response.message, 3000);
          }
        })
    }
    catch (ex) {

    }
  }, []);

  return (
    <div className="wrap">

      <Header />

      {notification.isVisible && <Notification message={notification.message} />}

      <main className="cart">
        <div className="cart__container">
          <div className="cart__inner">

            <div className="cart__info">

              {cartItems.length === 0 ? <p className='cart__empty'>Здесь пока ничего нет</p> :
                cartGames.map(currentGame => (

                  <div className="cart__game">
                    <div className="cart__game-header">
                      <div className="cart__game-name">
                        <img src={game_to_icon['CS2']} alt="icon" />
                        <p>{currentGame}</p>
                      </div>

                      <div className="cart__game-amount">
                        {cartItems.map(item => item.game === currentGame).length + " предмета"}
                      </div>
                    </div>

                    <div className="cart__game-body">

                      {cartItems.filter(item => (item.game === currentGame)).map((currentItem: CartType) => (

                        <div className="cart__game-item">
                          <div className="cart__game-item-left">
                            <div className="cart__game-item-img">
                              <img src={currentItem.url} alt="icon" />
                            </div>

                            <div className="cart__game-item-info">
                              <p>{currentItem.item}</p>
                            </div>
                          </div>

                          <div className="cart__game-item-right">
                            <div className="cart__game-item-price">
                              {currentItem.price} <span>BYN</span>
                            </div>

                            <div className="cart__game-item-delete" data-id={currentItem.id} onClick={handleDeleteItem}>
                              <img src={trashIcon} alt="junk" />
                              <p>Удалить</p>
                            </div>
                          </div>
                        </div>

                      ))}

                    </div>

                  </div>
                ))

              }

              <div className="cart__clear" onClick={handleClearCart}>
                Очистить корзину
              </div>
            </div>

            <div className="cart__offer">
              <div className="cart__offer-title">
                Подтвердите заказ
              </div>

              <div className="cart__offer-total-amount">
                {cartItems.length + " предмета в корзине"}
              </div>

              <div className="cart__offer-total-price">
                <p>Всего</p>
                <p>
                  {cartItems.reduce((acc: number, item: CartType) => acc + parseFloat(item.price), 0)} <span>BYN</span>
                </p>
              </div>


              <Button title='ПЕРЕЙТИ К ОПЛАТЕ' callBack={handleBuyCart} fw={600} fz={16} stretch={true} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

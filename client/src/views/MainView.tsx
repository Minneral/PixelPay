import React, { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import Card from '../components/Card/Card'
import banner from "../assets/img/banner.png";

import cs2Icon from "../assets/icons/cs2.png";
import dota2Icon from "../assets/icons/dota2.png";
import rustIcon from "../assets/icons/rust.png";

import "../styles//MainView.scss";
import Footer from '../components/Footer/Footer';
import GameStrip from '../components/GameStrip/GameStrip';
import { api_getCart } from '../services/authService';
import { ApiResponseType } from '../types/apiTypes';
import { setCart } from '../services/sessionStorage';

export default function MainView() {

  useEffect(() => {
    try {
      api_getCart()
        .then(response => response.data)
        .then((response: ApiResponseType) => {
          if (response.status === "OK") {
            setCart(response.data);
          }
        })
    }
    catch (ex) {

    }
  }, [])

  return (
    <div className="wrap">
      <Header />

      <div className="banner">
        <div className="banner__container">
          <div className="banner__inner">
            <img src={banner} alt="banner" />
            <div className="banner__info">
              <div className="banner__title">
                Выбери свою игру
              </div>

              <div className="banner__subtitle">
                Добро пожаловать на нашу торговую площадку
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="games">
        <div className="games__container">
          <div className="strips-list">
            <GameStrip game='CS2' iconUrl={cs2Icon}/>
            <GameStrip game='Dota2' iconUrl={dota2Icon}/>
            <GameStrip game='Rust' iconUrl={rustIcon} />
          </div>
        </div>
      </div>


      <Footer />
    </div>
  )
}

import React from 'react';
import logo from '../../assets/icons/logo.png';
import s from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className="footer__container">
        <div className={s.footer__inner}>
          <div className={s.footer__info}>
            <div className={s.footer__logo}>
              <img src={logo} alt="logo" />
            </div>

            <div className={s.footer__company}>
              PixelPay. Все права защищены
            </div>
          </div>

          <div className={s.footer__copyright}>
            <p>Copyright© 2023</p>
            <p>Работает на технологии Steam. Не связан с Valve Corp.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

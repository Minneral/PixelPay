import React, { useEffect } from 'react'
import Header from '../components/Header/Header'
import ProfileBody from '../components/Profile/ProfileBody/ProfileBody'
import { useNavigate } from 'react-router-dom';
import { getToken, getUserInfo } from '../services/sessionStorage';
import { jwtDecode } from 'jwt-decode';
import Footer from '../components/Footer/Footer';

export default function ProfileView() {

  const navigation = useNavigate();

  useEffect(() => {
    const token = getToken();

    try {
      const serverTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Minsk' });
      const millisecondsSinceEpoch = new Date(serverTime).getTime();
      const seconds = Math.floor(millisecondsSinceEpoch / 1000);

      if (token != null) {
        let payload = jwtDecode(token);
        let exp = payload.exp ? payload.exp : 0;
        if (!(exp >= Number(seconds) && getUserInfo() != null)) {
          throw Error();
        }
      }
      else
        throw Error();
    }
    catch (ex) {
      navigation('/');
    }
  }, [])

  return (
    <div className="wrap">
      <Header />
      <ProfileBody />
      <Footer />
    </div>
  )
}

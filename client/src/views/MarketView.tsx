import React, { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import ListingsList from '../components/ListingsList/ListingsList'
import { getMarketGame, setCart } from '../services/sessionStorage'
import "../styles/MarketView.scss";
import { api_getCart } from '../services/authService'
import { ApiResponseType, ListingType } from '../types/apiTypes'
import Filter from '../components/Filter/Filter'
import { api_getListings } from '../services/api'

export default function MarketView() {

  const [listings, setListings] = useState<ListingType[]>([]);
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  const [search, setSearch] = useState<string>(searchParam ? searchParam : "");

  useEffect(() => {
    try {
      api_getCart()
        .then(response => response.data)
        .then((response: ApiResponseType) => {
          if (response.status === "OK") {
            setCart(response.data);
          }
        })

      const marketGame = getMarketGame() || "";
      api_getListings(marketGame)
        .then(response => response.data)
        .then((response: ApiResponseType) => {
          if (response.status === "OK") {
            setListings(response.data);
          }
        })
    }
    catch (ex) {

    }
  }, [])

  return (
    <div className="wrap">
      <Header />

      <main className="main">
        <div className="market__container">
          <div className="main__inner">
            <div className="filter">
              <Filter setListings={setListings} maxPrice={1000} minPrice={0} />
            </div>

            <div className="market">
              <div className="market__title">
                {getMarketGame()}
              </div>

              <div className="market__listings">
                <ListingsList listings={listings} search={search}/>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

import { useEffect, useState } from "react";
import s from "./ProfilePurchases.module.scss";
import { api_getUserPurchases } from "../../../services/authService";
import { ApiResponseType, PurchaseType } from "../../../types/apiTypes";

export default function ProfilePurchases() {

  const [purchases, setPurchases] = useState<PurchaseType[]>([]);

  useEffect(() => {
    try {
      api_getUserPurchases()
        .then(response => response.data)
        .then((response: ApiResponseType) => {
          if (response.status === "OK") {
            const data: PurchaseType[] = response.data;
            setPurchases([...data]);
          }
        })
    }
    catch (ex) {

    }
  }, [])
  return (
    <div className={s.body}>
      <div className={s.body__header}>
        <p>Предмет:</p>
        <p>Дата:</p>
        <p>Стоимость:</p>
      </div>

      {purchases.map(item => (
        <div className={s.body__item}>
          <div className={s.body__itemInfo}>
            <img src={item.url} alt="icon" />

            <span>{item.item}</span>
          </div>

          <div className={s.body__itemDate}>
            {item.date}
          </div>

          <div className={s.body__itemPrice}>
            {item.price} <span>BYN</span>
          </div>

        </div>
      ))}

    </div>
  )
}

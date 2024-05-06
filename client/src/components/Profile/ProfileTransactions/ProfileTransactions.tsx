import { useEffect, useState } from 'react'

import s from "./ProfileTransactions.module.scss";
import { ApiResponseType, TransactionType } from '../../../types/apiTypes';
import { api_getUserTransactions } from '../../../services/authService';

export default function ProfileTransactions() {

  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  useEffect(() => {
    try {
      api_getUserTransactions()
        .then(response => response.data)
        .then((response: ApiResponseType) => {
          if (response.status === "OK") {
            const data: TransactionType[] = response.data;
            setTransactions([...data]);
          }
        })
    }
    catch (ex) {

    }
  }, [])

  return (
    <div className={s.body}>
      <div className={s.body__header}>
        <p>Действие:</p>
        <p>Дата:</p>
        <p>Сумма:</p>
      </div>

      {transactions.map(item => (
        <div className={s.body__item}>
          <div className={s.body__itemAction}>
            {item.type}
          </div>

          <div className={s.body__itemDate}>
            {item.date}
          </div>

          <div className={s.body__itemPrice}>
            {item.value} <span className={item.type === "Вывод" ? s.red : s.green}>BYN</span>
          </div>

        </div>
      ))}

    </div>
  )
}

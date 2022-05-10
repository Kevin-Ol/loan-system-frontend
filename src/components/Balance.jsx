import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import DepositWithdrawModal from "./DepositWithdrawModal";
import "../styles/Balance.scss";

function Balance() {
  const convertBRL = useCallback(
    (price) =>
      price.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
    []
  );

  const [yearlyBalance, setYearlyBalance] = useState(0);
  const [monthlyBalance, setMonthlyBalance] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleModal = useCallback(
    () => setModalIsOpen((oldState) => !oldState),
    []
  );

  useEffect(() => {
    const fetchClients = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const BASE_URL = "http://localhost:3001/ledger/balance?start=";
      try {
        const balancePromises = [
          api.get(`${BASE_URL}${year}-01-01`),
          api.get(`${BASE_URL}${year}-${month + 1}-01`),
        ];
        const [yearly, monthly] = await Promise.all(balancePromises);
        setYearlyBalance(yearly.data);
        setMonthlyBalance(monthly.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClients();
  }, []);

  return (
    <section className="balance-section">
      <div>
        <h2>Saldo Anual</h2>
        <p>{convertBRL(yearlyBalance)}</p>
      </div>
      <div>
        <h2>Saldo Mensal</h2>
        <p>{convertBRL(monthlyBalance)}</p>
      </div>
      <DepositWithdrawModal
        modalIsOpen={modalIsOpen}
        handleModal={handleModal}
      />
      <button type="button" onClick={handleModal}>
        Sacar / Depositar
      </button>
    </section>
  );
}

export default Balance;

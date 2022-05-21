import { useState, useEffect, useCallback } from "react";
import PendingLoanItem from "./PendingLoanItem";
import api from "../services/api";
import "../styles/LoanList.scss";

function PendingLoanList() {
  const [loanList, setLoanList] = useState([]);

  const dateToString = useCallback((date) => {
    const [dateString] = date.toISOString().split("T");
    return dateString;
  });

  const [endDate, setEndDate] = useState(() => {
    const currentDate = new Date();
    return dateToString(currentDate);
  });

  const [startDate, setStartDate] = useState(() => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() - 1);
    return dateToString(futureDate);
  });

  const handleStartDate = useCallback(({ target }) =>
    setStartDate(target.value)
  );

  const handlePaymentDate = useCallback(({ target }) =>
    setEndDate(target.value)
  );

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await api.get("loan/list");
        const openLoans = data.filter(({ status }) => status === "em aberto");
        setLoanList(openLoans);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClients();
  }, []);

  const handleSearch = useCallback(async () => {
    try {
      const { data } = await api.get(
        `loan/list?start=${startDate}&end=${endDate}`
      );
      const openLoans = data.filter(({ status }) => status === "em aberto");
      setLoanList(openLoans);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <section className="loan-table">
      <div>
        <label htmlFor="start-date">Data inicial</label>
        <input
          type="date"
          id="start-date"
          name="start-date"
          required
          value={startDate}
          onChange={handleStartDate}
        />
        <label htmlFor="payment-date">Data final</label>
        <input
          type="date"
          id="payment-date"
          name="payment-date"
          required
          value={endDate}
          onChange={handlePaymentDate}
        />
        <button type="button" onClick={handleSearch}>
          Buscar
        </button>
      </div>
      <ul>
        <h2>Lista de Empréstimos</h2>
        <li>
          <span>Nome</span>
          <span>Empréstimo inicial</span>
          <span>Percentual</span>
          <span>Juros mensal</span>
          <span>Data empréstimo</span>
          <span>Data vencimento</span>
          <span>Total devido</span>
          <span>Status</span>
        </li>
        {loanList.map((loan) => (
          <PendingLoanItem key={loan.id} loan={loan} />
        ))}
      </ul>
    </section>
  );
}

export default PendingLoanList;

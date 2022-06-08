import { useState, useEffect, useCallback, useMemo } from "react";
import PendingLoanItem from "./PendingLoanItem";
import api from "../services/api";
import "../styles/LoanList.scss";

function PendingLoanList() {
  const [loanList, setLoanList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [borrowed, setBorrowed] = useState(0);
  const [receivable, setReceivable] = useState(0);
  const [displayBalance, setDisplayBalance] = useState(false);
  const [selectDay, setSelectDay] = useState("");

  const handleSelectDay = useCallback(({ target }) => {
    setSelectDay(target.value);
  });

  useEffect(() => {
    setBorrowed(
      filteredList
        .reduce((acc, cur) => acc + cur.amount, 0)
        .toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })
    );
    setReceivable(
      filteredList
        .reduce((acc, cur) => acc + cur.monthlyInterest, 0)
        .toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })
    );
  }, [filteredList]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await api.get("loan/list");
        const openLoans = data.filter(
          ({ status }) => status === "em dia" || status === "em atraso"
        );
        console.log(data);
        setLoanList(openLoans);
        setFilteredList(openLoans);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClients();
  }, []);

  const handleSearch = useCallback(async () => {
    setFilteredList(
      loanList.filter((loan) => {
        const day = `${loan.paymentDate[8]}${loan.paymentDate[9]}`;
        return day === selectDay;
      })
    );
    setDisplayBalance(true);
  });

  const handleReset = useCallback(async () => setFilteredList(loanList));

  const numbers = useMemo(
    () =>
      Array.from({ length: 31 }, (_, i) => {
        if (i + 1 < 10) {
          return `0${i + 1}`;
        }
        return `${i + 1}`;
      }),
    []
  );

  return (
    <section className="loan-table">
      <div className="search-date">
        <label htmlFor="day">Dia</label>
        <select id="day" value={selectDay} onChange={handleSelectDay}>
          <option value="">Selecione</option>
          {numbers.map((number) => (
            <option value={number} key={number}>
              {number}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleSearch}>
          Buscar
        </button>
        <button type="button" onClick={handleReset}>
          Resetar
        </button>
      </div>
      {displayBalance && (
        <div className="search-balance">
          <div>
            Total emprestado:
            {borrowed}
          </div>
          <div>
            Total a receber:
            {receivable}
          </div>
        </div>
      )}
      <ul>
        <h2>Lista de Empréstimos</h2>
        <li>
          <span>Nome</span>
          <span>Empréstimo inicial</span>
          <span>Data empréstimo</span>
          <span>Data vencimento</span>
          <span>Percentual</span>
          <span>Juros mensal</span>
          <span>Total devido</span>
          <span>Status</span>
        </li>
        {filteredList.map((loan) => (
          <PendingLoanItem key={loan.id} loan={loan} />
        ))}
      </ul>
    </section>
  );
}

export default PendingLoanList;

import { useState, useEffect } from "react";
import LoanItem from "./LoanItem";
import api from "../services/api";
import "../styles/LoanList.scss";

function LoanList() {
  const [loanList, setLoanList] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await api.get("loan/list");
        setLoanList(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClients();
  }, []);

  return (
    <section className="loan-table">
      <ul>
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
          <LoanItem key={loan.id} loan={loan} />
        ))}
      </ul>
    </section>
  );
}

export default LoanList;

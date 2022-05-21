import { useState, useEffect } from "react";
import PendingSettlementItem from "./PendingSettlementItem";
import api from "../services/api";
import "../styles/LoanList.scss";

function PendingSettlementList() {
  const [settlementList, setSettlementList] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await api.get("settlement/list");
        const openSettlements = data.filter(
          ({ status }) => status !== "quitado"
        );
        setSettlementList(openSettlements);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClients();
  }, []);

  return (
    <section className="loan-table">
      <ul>
        <h2>Lista de Acordos</h2>
        <li>
          <span>Nome</span>
          <span>Acordo inicial</span>
          <span>Data acordo</span>
          <span>Data vencimento</span>
          <span>Valor mensal</span>
          <span>Parcelas</span>
          <span>Total devido</span>
          <span>Status</span>
        </li>
        {settlementList.map((loan) => (
          <PendingSettlementItem key={loan.id} settlement={loan} />
        ))}
      </ul>
    </section>
  );
}

export default PendingSettlementList;

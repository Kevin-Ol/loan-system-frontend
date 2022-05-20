import AllSettlementsItem from "./AllSettlementsItem";

function AllSettlementsList({ settlementList }) {
  return (
    <section className="transaction-table">
      <ul>
        <h2>Lista de Acordos</h2>
        <li>
          <span>Acordo inicial</span>
          <span>Data acordo</span>
          <span>Data vencimento</span>
          <span>Valor mensal</span>
          <span>Parcelas</span>
          <span>Total devido</span>
          <span>Status</span>
        </li>
        {settlementList.map((settlement) => (
          <AllSettlementsItem key={settlement.id} settlement={settlement} />
        ))}
      </ul>
    </section>
  );
}

export default AllSettlementsList;

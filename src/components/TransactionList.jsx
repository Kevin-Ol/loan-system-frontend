import TransactionItem from "./TransactionItem";

function TransactionList({ loanList }) {
  return (
    <section className="transaction-table">
      <ul>
        <h2>Lista de Empréstimos</h2>
        <li>
          <span>Empréstimo inicial</span>
          <span>Percentual</span>
          <span>Juros mensal</span>
          <span>Data empréstimo</span>
          <span>Data vencimento</span>
          <span>Total devido</span>
          <span>Status</span>
        </li>
        {loanList.map((loan) => (
          <TransactionItem key={loan.id} loan={loan} />
        ))}
      </ul>
    </section>
  );
}

export default TransactionList;

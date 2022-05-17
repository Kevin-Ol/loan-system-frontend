/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState, useCallback } from "react";

function TransactionItem({ loan }) {
  const {
    // id,
    // client,
    amount,
    rate,
    monthlyInterest,
    totalOwned,
    totalPaid,
    startDate,
    paymentDate,
    status,
    ledgers,
  } = loan;

  const [showHistory, setShowHistory] = useState(false);

  const dateToString = useCallback((date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  });

  const convertBRL = useCallback(
    (price) =>
      price.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
    []
  );

  const handleShowHistory = () =>
    setShowHistory((previousState) => !previousState);

  return (
    <li onClick={handleShowHistory}>
      <div>
        <span>{convertBRL(amount)}</span>
        <span>{`${rate.toFixed(2)}%`}</span>
        <span>{convertBRL(monthlyInterest)}</span>
        <span>{dateToString(startDate)}</span>
        <span>{dateToString(paymentDate)}</span>
        <span>{convertBRL(totalOwned - totalPaid)}</span>
        <span>{status}</span>
      </div>
      {showHistory && (
        <ul>
          <li>
            <span>Tipo</span>
            <span>Valor</span>
            <span>Data</span>
          </li>
          {ledgers.map((ledger) => (
            <li key={ledger.id}>
              <span>{ledger.amount < 0 ? "Empréstimo" : "Pagamento"}</span>
              <span>{convertBRL(ledger.amount)}</span>
              <span>{dateToString(ledger.date)}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default TransactionItem;

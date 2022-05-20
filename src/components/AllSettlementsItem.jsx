import { useMemo, useState, useCallback } from "react";

function AllSettlementsItem({ settlement }) {
  const {
    amount,
    startDate,
    installments,
    monthlyPayment,
    totalPaid,
    status,
    months,
    ledgers,
    loans,
  } = settlement;

  const [showHistory, setShowHistory] = useState(false);

  const paymentDate = useMemo(() => {
    const futureDate = new Date(startDate);
    return futureDate.setMonth(futureDate.getMonth() + installments);
  });

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
        <span>{dateToString(startDate)}</span>
        <span>{dateToString(paymentDate)}</span>
        <span>{convertBRL(monthlyPayment)}</span>
        <span>{`${months}/${installments}`}</span>
        <span>{convertBRL(amount - totalPaid)}</span>
        <span>{status}</span>
      </div>
      {showHistory && (
        <ul>
          <li>
            <span>Tipo</span>
            <span>Valor</span>
            <span>Data</span>
          </li>
          {loans.map((loan) => (
            <li key={loan.id}>
              <span>Acordo</span>
              <span>{convertBRL(loan.amount)}</span>
              <span>{dateToString(loan.startDate)}</span>
            </li>
          ))}
          {ledgers.map((ledger) => (
            <li key={ledger.id}>
              <span>Pagamento</span>
              <span>{convertBRL(ledger.amount)}</span>
              <span>{dateToString(ledger.date)}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default AllSettlementsItem;

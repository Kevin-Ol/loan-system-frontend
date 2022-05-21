import { useState, useCallback } from "react";
import ClientPaymentModal from "./ClientPaymentModal";

function PendingLoanItem({ loan }) {
  const {
    id,
    client,
    amount,
    rate,
    monthlyInterest,
    totalOwned,
    totalPaid,
    startDate,
    paymentDate,
    status,
  } = loan;

  const dateToString = useCallback((date) => {
    const dateObj = new Date(date);
    const [onlyDate] = dateObj.toISOString().split("T");
    const [year, month, day] = onlyDate.split("-");
    return `${day}/${month}/${year}`;
  });

  const className = totalOwned > amount ? "red-btn" : "";

  const convertBRL = useCallback(
    (price) =>
      price.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
    []
  );

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleModal = useCallback(
    () => setModalIsOpen((oldState) => !oldState),
    []
  );

  return (
    <li>
      <span>{client.name}</span>
      <span>{convertBRL(amount)}</span>
      <span>{dateToString(startDate)}</span>
      <span>{dateToString(paymentDate)}</span>
      <span>{`${rate.toFixed(2)}%`}</span>
      <span>{convertBRL(monthlyInterest)}</span>
      <span>{convertBRL(totalOwned - totalPaid)}</span>
      <span>{status}</span>
      {status === "em aberto" && (
        <button type="button" className={className} onClick={handleModal}>
          Pagar
        </button>
      )}
      <ClientPaymentModal
        id={id}
        monthlyInterest={monthlyInterest}
        debt={totalOwned - totalPaid}
        modalIsOpen={modalIsOpen}
        handleModal={handleModal}
      />
    </li>
  );
}

export default PendingLoanItem;

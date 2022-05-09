import { useState, useCallback } from "react";
import ClientPaymentModal from "./ClientPaymentModal";

function LoanItem({ loan }) {
  const {
    id,
    clientId,
    amount,
    rate,
    monthlyInterest,
    totalOwned,
    startDate,
    paymentDate,
    status,
  } = loan;

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

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleModal = useCallback(
    () => setModalIsOpen((oldState) => !oldState),
    []
  );

  return (
    <li>
      <span>{clientId}</span>
      <span>{convertBRL(amount)}</span>
      <span>{`% ${rate.toFixed(2)}`}</span>
      <span>{convertBRL(monthlyInterest)}</span>
      <span>{dateToString(startDate)}</span>
      <span>{dateToString(paymentDate)}</span>
      <span>{convertBRL(totalOwned)}</span>
      <span>{status}</span>
      <button type="button" onClick={handleModal}>
        Pagar
      </button>
      <ClientPaymentModal
        id={id}
        monthlyInterest={monthlyInterest}
        totalOwned={totalOwned}
        modalIsOpen={modalIsOpen}
        handleModal={handleModal}
      />
    </li>
  );
}

export default LoanItem;

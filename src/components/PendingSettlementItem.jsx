import { useMemo, useState, useCallback } from "react";
import ClientPaymentModal from "./ClientPaymentModal";

function PendingSettlementItem({ settlement }) {
  const {
    id,
    amount,
    startDate,
    installments,
    client,
    monthlyPayment,
    totalPaid,
    status,
    months,
  } = settlement;

  const dateToString = useCallback((date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  });

  const paymentDate = useMemo(() => {
    const futureDate = new Date(startDate);
    return futureDate.setMonth(futureDate.getMonth() + installments);
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
      <span>{client.name}</span>
      <span>{convertBRL(amount)}</span>
      <span>{dateToString(startDate)}</span>
      <span>{dateToString(paymentDate)}</span>
      <span>{convertBRL(monthlyPayment)}</span>
      <span>{`${months}/${installments}`}</span>
      <span>{convertBRL(amount - totalPaid)}</span>
      <span>{status}</span>
      <button type="button" onClick={handleModal}>
        Pagar
      </button>
      <ClientPaymentModal
        id={id}
        monthlyInterest={monthlyPayment}
        debt={amount - totalPaid}
        modalIsOpen={modalIsOpen}
        handleModal={handleModal}
        settlement
      />
    </li>
  );
}

export default PendingSettlementItem;

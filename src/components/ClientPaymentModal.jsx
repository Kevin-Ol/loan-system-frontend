import { useState, useCallback } from "react";
import Modal from "react-modal";
import CurrencyInput from "react-currency-input-field";
import api from "../services/api";
import "../styles/ClientPaymentModal.scss";

Modal.setAppElement("#root");

function ClientPaymentModal({
  id,
  monthlyInterest,
  debt,
  modalIsOpen,
  handleModal,
  settlement,
}) {
  const numberWithDot = useCallback((text) =>
    text.replace(/[^0-9,]/g, "").replace(",", ".")
  );

  const [payment, setPayment] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  const monthlyPayment = useCallback(() =>
    setPayment(
      monthlyInterest
        .toLocaleString("pt-br", {
          minimumFractionDigits: 2,
        })
        .replace(".", "")
    )
  );

  const payOffDebt = useCallback(() =>
    setPayment(
      debt
        .toLocaleString("pt-br", {
          minimumFractionDigits: 2,
        })
        .replace(".", "")
    )
  );

  const handlePayment = useCallback((value = "") => {
    const numberValue = parseFloat(numberWithDot(value));

    if (numberValue > debt) {
      payOffDebt();
    } else {
      setPayment(value);
    }
  });

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const amount = parseFloat(numberWithDot(payment));

    if (amount === 0) {
      return global.alert("Valor do pagamento não pode ser zero");
    }

    try {
      const today = new Date();
      const [date] = today.toISOString().split("T");

      const paymentInfo = settlement
        ? {
            settlementId: id,
            date,
            amount,
          }
        : {
            loanId: id,
            date,
            amount,
          };

      setBtnDisabled(true);
      await api.post("ledger/create", paymentInfo);
      global.alert("Pagamento efetuado com sucesso!");
      return window.location.reload();
    } catch (error) {
      setBtnDisabled(false);
      return global.alert("Erro no sistema");
    }
  });

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleModal}
      contentLabel="Payment Modal"
      className="payment-modal"
    >
      <button type="button" className="close-modal" onClick={handleModal}>
        X
      </button>
      <form onSubmit={handleSubmit}>
        <label htmlFor="payment">Valor</label>
        <CurrencyInput
          id="payment"
          name="payment"
          autoComplete="off"
          placeholder="0,00"
          required
          value={payment}
          decimalScale={2}
          allowNegativeValue={false}
          onValueChange={handlePayment}
        />
        <div>
          <button type="button" onClick={monthlyPayment}>
            {settlement ? "Parcela" : "Juros mensal"}
          </button>
          <button type="button" onClick={payOffDebt}>
            Quitar dívida
          </button>
        </div>
        <button type="submit" disabled={btnDisabled}>
          Confirmar
        </button>
      </form>
    </Modal>
  );
}

export default ClientPaymentModal;

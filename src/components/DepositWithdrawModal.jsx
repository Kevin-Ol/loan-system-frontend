import { useState, useCallback } from "react";
import Modal from "react-modal";
import CurrencyInput from "react-currency-input-field";
import api from "../services/api";
import "../styles/DepositWithdrawModal.scss";

Modal.setAppElement("#root");

function DepositWithdrawModal({ modalIsOpen, handleModal }) {
  const numberWithDot = useCallback((text) =>
    text.replace(/[^0-9,-]/g, "").replace(",", ".")
  );

  const [transactionValue, setTransactionValue] = useState("");
  const [transactionType, setTransactionType] = useState("withdraw");
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleTransactionValue = useCallback((value = "") =>
    setTransactionValue(value)
  );

  const handleTransactionType = useCallback(({ target }) =>
    setTransactionType(target.value)
  );

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (transactionValue === "0") {
      return global.alert("Valor da movimentação não pode ser zero");
    }

    let amount = transactionValue;

    if (transactionType === "withdraw") {
      amount = -parseFloat(numberWithDot(amount));
    } else {
      amount = parseFloat(numberWithDot(amount));
    }

    try {
      const today = new Date();
      const [date] = today.toISOString().split("T");

      const transactionInfo = {
        date,
        amount,
      };

      setBtnDisabled(true);
      await api.post("ledger/create", transactionInfo);
      global.alert("Transação efetuada com sucesso!");
      return window.location.reload();
    } catch (error) {
      setBtnDisabled(false);
      console.log(error);
      return global.alert("Erro no sistema");
    }
  });

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleModal}
      contentLabel="Deposit and Withdraw Modal"
      className="withdraw-modal"
    >
      <button type="button" className="close-modal" onClick={handleModal}>
        X
      </button>
      <form onSubmit={handleSubmit}>
        <label htmlFor="transaction-value">Valor</label>
        <CurrencyInput
          id="transaction-value"
          name="transaction-value"
          autoComplete="off"
          placeholder="0,00"
          required
          value={transactionValue}
          decimalScale={2}
          allowNegativeValue={false}
          onValueChange={handleTransactionValue}
        />
        <label htmlFor="transaction-type">Transação</label>
        <select
          id="transaction-type"
          value={transactionType}
          onChange={handleTransactionType}
        >
          <option value="withdraw">Saque</option>
          <option value="deposit">Depósito</option>
        </select>
        <button type="submit" disabled={btnDisabled}>
          Confirmar
        </button>
      </form>
    </Modal>
  );
}

export default DepositWithdrawModal;

import { useState, useCallback, useEffect } from "react";
import Modal from "react-modal";
import CurrencyInput from "react-currency-input-field";
import api from "../services/api";
import "../styles/CreateSettlementModal.scss";

Modal.setAppElement("#root");

function CreateSettlementModal({
  modalIsOpen,
  handleModal,
  loanList,
  clientId,
}) {
  const numberWithDot = useCallback((text) =>
    text.replace(/[^0-9,-]/g, "").replace(",", ".")
  );

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

  const pendingLoans = loanList.filter(({ status }) => status === "em aberto");

  const [installments, setInstallments] = useState(1);
  const [loanToSettlement, setLoanToSettlement] = useState([]);
  const [settlementValue, setSettlementValue] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const currentDate = new Date();
    const [dateString] = currentDate.toISOString().split("T");
    return dateString;
  });

  const handleStartDate = useCallback(({ target }) =>
    setStartDate(target.value)
  );

  const handleLoanToSettlement = useCallback(({ target }, loan) => {
    setLoanToSettlement((previousState) => {
      if (target.checked) {
        return [...previousState, loan];
      }
      return previousState.filter(({ id }) => id !== loan.id);
    });
  });

  const handleSettlementValue = useCallback((value = "") => {
    setSettlementValue(value);
  });

  const handleInstallments = useCallback((value = "") => {
    setInstallments(value);
  });

  const isChecked = useCallback((loan) =>
    loanToSettlement.some(({ id }) => id === loan.id)
  );

  useEffect(() => {
    setSettlementValue(
      loanToSettlement
        .reduce((acc, cur) => acc + (cur.totalOwned - cur.totalPaid), 0)
        .toLocaleString("pt-br", {
          minimumFractionDigits: 2,
        })
        .replace(".", "")
    );
  }, [loanToSettlement]);

  const handleSubmit = useCallback(async () => {
    try {
      const loanToSettleIds = loanToSettlement.map(({ id }) => id);
      const amount = parseFloat(numberWithDot(settlementValue));

      const settlementInfo = {
        clientId,
        loanToSettleIds,
        startDate,
        installments,
        amount,
      };

      await api.post("settlement/create", settlementInfo);
      global.alert("Acordo criado com sucesso!");
      return window.location.reload();
    } catch (error) {
      console.log(error);
      return global.alert("Erro no sistema");
    }
  });

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleModal}
      contentLabel="Settlement Modal"
      className="settlement-modal"
    >
      <button type="button" className="close-modal" onClick={handleModal}>
        X
      </button>
      <form>
        <h2>Gerar Acordo</h2>
        <ul>
          <li>
            <span>Data empréstimo</span>
            <span>Data vencimento</span>
            <span>Total devido</span>
          </li>
          {pendingLoans.map((loan) => (
            <li key={loan.id}>
              <label htmlFor={`loan-${loan.id}`}>
                <span>{dateToString(loan.startDate)}</span>
                <span>{dateToString(loan.paymentDate)}</span>
                <span>{convertBRL(loan.totalOwned - loan.totalPaid)}</span>
              </label>
              <input
                type="checkbox"
                id={`loan-${loan.id}`}
                checked={isChecked(loan)}
                onChange={(event) => handleLoanToSettlement(event, loan)}
              />
            </li>
          ))}
        </ul>
        <label htmlFor="settlement-value">Valor Total</label>
        <CurrencyInput
          id="settlement-value"
          name="settlement-value"
          autoComplete="off"
          placeholder="0,00"
          required
          value={settlementValue}
          decimalScale={2}
          allowNegativeValue={false}
          onValueChange={handleSettlementValue}
        />
        <label htmlFor="start-date">Data inicial</label>
        <input
          type="date"
          id="start-date"
          name="start-date"
          required
          value={startDate}
          onChange={handleStartDate}
        />
        <label htmlFor="installment">Parcelas</label>
        <CurrencyInput
          id="installment"
          name="installment"
          autoComplete="off"
          placeholder="1"
          required
          value={installments}
          allowDecimals={false}
          allowNegativeValue={false}
          onValueChange={handleInstallments}
        />

        <p>
          Total por parcela:
          {` ${convertBRL(
            parseFloat(numberWithDot(settlementValue)) /
              parseInt(installments, 10) || 0
          )}`}
        </p>
        <button type="button" onClick={handleSubmit}>
          Finalizar Acordo
        </button>
      </form>
    </Modal>
  );
}

export default CreateSettlementModal;

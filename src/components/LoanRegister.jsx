import { useState, useCallback } from "react";
import CurrencyInput from "react-currency-input-field";

function LoanRegister() {
  const dateToString = useCallback((date) => {
    const currentYear = date.getFullYear();
    const currentMonth =
      (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1);
    const currentDay = (date.getDate() < 10 ? "0" : "") + date.getDate();
    return `${currentYear}-${currentMonth}-${currentDay}`;
  });

  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(30);
  const [days, setDays] = useState(30);

  const [startDate, setStartDate] = useState(() => {
    const currentDate = new Date();
    return dateToString(currentDate);
  });

  const [paymentDate, setPaymentDate] = useState(() => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    return dateToString(futureDate);
  });

  const handleAmount = useCallback((value) => setAmount(value));
  const handleRate = useCallback((value) => setRate(value));

  const handleStartDate = useCallback(({ target }) =>
    setStartDate(target.value)
  );

  const handlePaymentDate = useCallback(({ target }) =>
    setPaymentDate(target.value)
  );

  const handleDays = useCallback((value) => {
    const currentDate = new Date();
    if (!value) {
      setPaymentDate(dateToString(currentDate));
    } else {
      currentDate.setDate(currentDate.getDate() + parseInt(value, 10));
      setPaymentDate(dateToString(currentDate));
    }

    setDays(value);
  });

  return (
    <form>
      <label htmlFor="amount">Valor</label>
      <CurrencyInput
        id="amount"
        name="amount"
        required
        value={amount}
        decimalScale={2}
        allowNegativeValue={false}
        onValueChange={handleAmount}
      />
      <label htmlFor="rate">Percentual</label>
      <CurrencyInput
        id="rate"
        name="rate"
        required
        value={rate}
        decimalsLimit={20}
        allowNegativeValue={false}
        onValueChange={handleRate}
      />
      <label htmlFor="days">Dias</label>
      <CurrencyInput
        id="days"
        name="days"
        value={days}
        allowDecimals={false}
        allowNegativeValue={false}
        onValueChange={handleDays}
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
      <label htmlFor="payment-date">Data de pagamento</label>
      <input
        type="date"
        id="payment-date"
        name="payment-date"
        required
        value={paymentDate}
        onChange={handlePaymentDate}
      />
      <button type="submit">Finalizar</button>
    </form>
  );
}

export default LoanRegister;

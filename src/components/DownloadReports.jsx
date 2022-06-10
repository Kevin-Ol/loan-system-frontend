import { useState, useCallback, useMemo } from "react";
import api from "../services/api";

function DownloadReports() {
  const [selectedReport, setSelectedReport] = useState("loan");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState("");

  const handleReport = useCallback(({ target }) => {
    setSelectedReport(target.value);
  });

  const dateToString = useCallback((date) => {
    const [dateString] = date.toISOString().split("T");
    return dateString;
  }, []);

  const brazilianDate = useCallback((date) => {
    const [dateString] = date.split("T");
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }, []);

  const [startDate, setStartDate] = useState(() => {
    const currentDate = new Date();
    return dateToString(currentDate);
  });

  const [paymentDate, setPaymentDate] = useState(() => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    return dateToString(futureDate);
  });

  const handleStartDate = useCallback(
    ({ target }) => setStartDate(target.value),
    []
  );

  const handlePaymentDate = useCallback(
    ({ target }) => setPaymentDate(target.value),
    []
  );

  const download = useCallback((data, fileName) => {
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "true");
    a.setAttribute("href", url);
    a.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const objectToCsv = useCallback((data, title, portugueseHeaders, type) => {
    const csvRows = [];

    const headers = Object.keys(data[0]);
    csvRows.push(title);
    csvRows.push(portugueseHeaders);

    const positiveIncome = [];
    const negativeIncome = [];

    const sumArray = (array) => array.reduce((acc, cur) => acc + cur, 0);

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = row[header].toString().replace(/"/g, '\\"');

        if (header === "monthlyInterest" || header === "entry") {
          positiveIncome.push(row[header]);
        }

        if (header === "totalOwned" || header === "out") {
          negativeIncome.push(row[header]);
        }

        return `"${escaped}"`;
      });
      csvRows.push(values);
    }

    const totals =
      type === "ledger"
        ? ["Total recebido", "Saídas totais"]
        : ["Total a receber", "Total faltante"];

    csvRows.push("");
    csvRows.push(totals);
    csvRows.push([sumArray(positiveIncome), sumArray(negativeIncome)]);

    return csvRows.join("\n");
  }, []);

  const handleLoanReport = useCallback((reportData) => {
    const openLoans = reportData.filter(
      ({ status }) => status === "em dia" || status === "em atraso"
    );

    const data = openLoans.map((loan) => ({
      name: loan.client.name,
      amount: loan.amount,
      rate: loan.rate,
      monthlyInterest: loan.monthlyInterest,
      startDate: brazilianDate(loan.startDate),
      paymentDate: brazilianDate(loan.paymentDate),
      totalOwned: loan.totalOwned,
    }));

    const portugueseHeaders = [
      "Nome",
      "Valor pego",
      "Taxa",
      "Juros",
      "Data que pegou",
      "Data de pagamento",
      "Total devido",
    ];

    const title = "Tabela de Devedores";
    download(
      objectToCsv(data, title, portugueseHeaders, "loan"),
      "emprestimos"
    );
  }, []);

  const handleSettlementReport = useCallback((reportData) => {
    const openSettlements = reportData.filter(
      ({ status }) => status !== "quitado"
    );

    const calcDate = (date, installments) => {
      const futureDate = new Date(date);
      futureDate.setMonth(futureDate.getMonth() + installments);
      return futureDate.toISOString();
    };

    const data = openSettlements.map((settlement) => ({
      name: settlement.client.name,
      amount: settlement.amount,
      startDate: brazilianDate(settlement.startDate),
      paymentDate: brazilianDate(
        calcDate(settlement.startDate, settlement.installments)
      ),
      installments: `${parseInt(
        settlement.totalPaid / settlement.monthlyPayment,
        10
      )}/${settlement.installments}`,
      monthlyInterest: settlement.monthlyPayment,
      totalOwned: settlement.balance * -1,
    }));

    const portugueseHeaders = [
      "Nome",
      "Acordo",
      "Data inicial",
      "Data de pagamento",
      "Parcelas",
      "Valor mensal",
      "Total devido",
    ];

    const title = "Tabela de Devedores";
    download(
      objectToCsv(data, title, portugueseHeaders, "settlement"),
      "acordos"
    );
  }, []);

  const handleLedgerReport = useCallback((reportData) => {
    const data = reportData.map((ledger) => {
      const entry = ledger.amount > 0 ? ledger.amount : 0;
      const out = ledger.amount < 0 ? ledger.amount * -1 : 0;
      const name =
        ledger.loan?.client.name ||
        ledger.settlement?.client.name ||
        "Operação manual";

      return {
        name,
        date: brazilianDate(ledger.date),
        entry,
        out,
      };
    });

    const portugueseHeaders = ["Nome", "Data da ação", "Entrada", "Saída"];

    const title = "Tabela livro caixa";
    download(
      objectToCsv(data, title, portugueseHeaders, "ledger"),
      "livro caixa"
    );
  }, []);

  const availableReports = useMemo(
    () => ({
      loan: {
        url: `loan/list?start=${startDate}&end=${paymentDate}`,
        handler: handleLoanReport,
      },
      settlement: {
        url: `settlement/list?start=${startDate}&end=${paymentDate}`,
        handler: handleSettlementReport,
      },
      ledger: {
        url: `ledger/list?start=${startDate}&end=${paymentDate}`,
        handler: handleLedgerReport,
      },
    }),
    [startDate, paymentDate]
  );

  const handleDownload = useCallback(
    async (event) => {
      event.preventDefault();
      setBtnDisabled(true);
      setEmptyMessage("");

      try {
        const { data } = await api.get(availableReports[selectedReport].url);
        if (data[0]) {
          availableReports[selectedReport].handler(data);
        } else {
          setEmptyMessage("Não há dados para essa data");
        }
      } catch (error) {
        console.log(error);
      }
      setBtnDisabled(false);
    },
    [availableReports, selectedReport]
  );

  // useEffect(() => {
  //   if (reportData[0]) {
  //     availableReports[selectedReport].handler();
  //   } else {
  //     setEmptyMessage("Não há dados para essa data");
  //   }
  // }, [reportData]);

  return (
    <section className="reports-section">
      <div>
        <label htmlFor="start-date">Data inicial</label>
        <input
          type="date"
          id="start-date"
          name="start-date"
          required
          value={startDate}
          onChange={handleStartDate}
        />
        <label htmlFor="payment-date">Data final</label>
        <input
          type="date"
          id="payment-date"
          name="payment-date"
          required
          value={paymentDate}
          onChange={handlePaymentDate}
        />
      </div>
      <div>
        <label htmlFor="report">Tipo</label>
        <select
          id="report"
          value={selectedReport}
          required
          onChange={handleReport}
        >
          <option value="loan">Empréstimos</option>
          <option value="settlement">Acordos</option>
          <option value="ledger">Livro Caixa</option>
        </select>
      </div>
      <button type="button" onClick={handleDownload} disabled={btnDisabled}>
        Download
      </button>
      <p>{emptyMessage}</p>
    </section>
  );
}

export default DownloadReports;

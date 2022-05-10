import LoanRegister from "../components/LoanRegister";
import Header from "../components/Header";
import "../styles/Loan.scss";

function Loan() {
  return (
    <main className="loan-page">
      <Header title="Cadastro de empréstimo" />
      <LoanRegister />
    </main>
  );
}

export default Loan;

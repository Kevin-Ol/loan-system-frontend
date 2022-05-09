import LoanList from "../components/LoanList";
import Header from "../components/Header";
import Balance from "../components/Balance";

function Register() {
  return (
    <main>
      <Header title="Listagem de empréstimos" />
      <Balance />
      <LoanList />
    </main>
  );
}

export default Register;

import PendingLoanList from "../components/PendingLoanList";
import PendingSettlementList from "../components/PendingSettlementList";
import Header from "../components/Header";
import Balance from "../components/Balance";

function GeneralInfo() {
  return (
    <main>
      <Header title="Listagem de empréstimos" />
      <Balance />
      <PendingLoanList />
      <PendingSettlementList />
    </main>
  );
}

export default GeneralInfo;

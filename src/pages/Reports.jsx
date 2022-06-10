import DownloadReports from "../components/DownloadReports";
import Header from "../components/Header";
import "../styles/Reports.scss";

function Reports() {
  return (
    <main className="reports-page">
      <Header title="Relatórios" />
      <DownloadReports />
    </main>
  );
}

export default Reports;

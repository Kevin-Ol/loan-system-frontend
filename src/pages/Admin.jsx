import CreateAdmin from "../components/CreateAdmin";
import Header from "../components/Header";
import "../styles/Admin.scss";

function Admin() {
  return (
    <main className="admin-page">
      <Header title="Cadastro de administrador" />
      <CreateAdmin />
    </main>
  );
}

export default Admin;

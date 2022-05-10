import ClientRegister from "../components/ClientRegister";
import Header from "../components/Header";
import "../styles/Register.scss";

function Register() {
  return (
    <main className="register-page">
      <Header title="Cadastro de cliente" />
      <ClientRegister />
    </main>
  );
}

export default Register;

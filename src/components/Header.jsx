import { Link } from "react-router-dom";
import { useCallback } from "react";
import { useAuth } from "../context/Auth";

function Header({ title }) {
  const { setUser } = useAuth();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("@loan-system");
    setUser(false);
  });

  return (
    <header>
      <h1>{title}</h1>
      <Link to="/loan/list">Página Inicial</Link>
      <Link to="/client/register">Cadastrar Cliente</Link>
      <Link to="/loan/register">Cadastrar Empréstimo</Link>
      <button type="button" onClick={handleLogout}>
        Sair
      </button>
    </header>
  );
}

export default Header;

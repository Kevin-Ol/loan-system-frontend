import { Link } from "react-router-dom";
import { useCallback } from "react";
import { useAuth } from "../context/Auth";
import "../styles/Header.scss";

function Header({ title }) {
  const { user, setUser } = useAuth();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("@loan-system");
    setUser(false);
  });

  return (
    <header>
      <h1>{title}</h1>
      <div>
        <Link to="/loan/list">Página Inicial</Link>
        <Link to="/client/register">Cadastrar Cliente</Link>
        <Link to="/client/search">Buscar Cliente</Link>
        <Link to="/loan/register">Cadastrar Empréstimo</Link>
        <span>{user.email}</span>
        <button type="button" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  );
}

export default Header;

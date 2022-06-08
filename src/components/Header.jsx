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
        <div>
          <Link to="/loan/list">Página Inicial</Link>
          <Link to="/client/search">Buscar Cliente</Link>
          <Link to="/client/register">Cadastrar Cliente</Link>
        </div>
        <div>
          <Link to="/loan/register">Cadastrar Empréstimo</Link>
          <Link to="/admin/register">Cadastrar Administrador</Link>
          <Link to="/reports">Relatórios</Link>
        </div>
      </div>
      <span>{user.email}</span>
      <button type="button" onClick={handleLogout}>
        Sair
      </button>
    </header>
  );
}

export default Header;

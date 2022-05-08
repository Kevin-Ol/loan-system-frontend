import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);

  const handleEmail = useCallback(({ target }) => setEmail(target.value));
  const handlePassword = useCallback(({ target }) => setPassword(target.value));
  const [errorMessage, setErrorMessage] = useState("");

  const handleRevealPassord = useCallback(({ target }) =>
    setRevealPassword(target.checked)
  );

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post("login", { email, password });

      localStorage.setItem("@loan-system", data.token);
      setUser(true);
      navigate("/loan/list");
    } catch (error) {
      setErrorMessage("Usuário ou senha incorretos");
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        required
        placeholder="seu.email@gmail.com"
        value={email}
        onChange={handleEmail}
      />
      <label htmlFor="password">Senha</label>
      <input
        type={revealPassword ? "text" : "password"}
        id="password"
        required
        placeholder="senha123"
        value={password}
        onChange={handlePassword}
      />
      <label htmlFor="reveal-password">Mostrar senha</label>
      <input
        type="checkbox"
        id="reveal-password"
        onChange={handleRevealPassord}
      />
      <p>{errorMessage}</p>
      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;

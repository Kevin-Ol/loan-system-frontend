import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import api from "../services/api";

function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmail = useCallback(({ target }) => {
    setEmail(target.value);
    setErrorMessage("");
  });
  const handlePassword = useCallback(({ target }) => {
    setPassword(target.value);
    setErrorMessage("");
  });

  const handleRevealPassord = useCallback(({ target }) =>
    setRevealPassword(target.checked)
  );

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post("login", { email, password });

      localStorage.setItem("@loan-system", data.token);
      api.defaults.headers.common.authorization = data.token;
      setUser(true);
      navigate("/loan/list");
    } catch (error) {
      setErrorMessage("Usuário ou senha incorretos");
    }
  });

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>Login</h1>
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
      <div>
        <label htmlFor="reveal-password">Mostrar senha</label>
        <input
          type="checkbox"
          id="reveal-password"
          onChange={handleRevealPassord}
        />
      </div>
      <p>{errorMessage}</p>
      <button type="submit">Entrar</button>
    </form>
  );
}

export default LoginForm;

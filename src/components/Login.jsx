import { useState, useCallback } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);

  const handleEmail = useCallback(({ target }) => setEmail(target.value));
  const handlePassword = useCallback(({ target }) => setPassword(target.value));
  const handleRevealPassord = useCallback(({ target }) =>
    setRevealPassword(target.checked)
  );

  return (
    <form>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        placeholder="seu.email@gmail.com"
        value={email}
        onChange={handleEmail}
      />
      <label htmlFor="password">Senha</label>
      <input
        type={revealPassword ? "text" : "password"}
        placeholder="senha123"
        id="password"
        value={password}
        onChange={handlePassword}
      />
      <label htmlFor="reveal-password">Mostrar senha</label>
      <input
        type="checkbox"
        id="reveal-password"
        onChange={handleRevealPassord}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;

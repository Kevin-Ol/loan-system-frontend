import { useState, useCallback } from "react";
import api from "../services/api";

function CreateAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleEmail = useCallback(({ target }) => {
    setEmail(target.value);
    setErrorMessage("");
  });

  const handlePassword = useCallback(({ target }) => {
    setPassword(target.value);
    setErrorMessage("");
  });

  const handleConfirmPassword = useCallback(({ target }) => {
    setConfirmPassword(target.value);
    setErrorMessage("");
  });

  const handleRevealPassord = useCallback(({ target }) =>
    setRevealPassword(target.checked)
  );

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      return setErrorMessage("A senha deve ter pelo menos 6 caracteres");
    }

    if (password !== confirmPassword) {
      return setErrorMessage("Senhas não são iguais");
    }

    try {
      setBtnDisabled(true);
      await api.post("login/create", { email, password });
      global.alert("Administrador cadastrado com sucesso!");
      return window.location.reload();
    } catch (error) {
      setBtnDisabled(false);
      const { status } = error.response;

      if (status === 409) {
        return global.alert("Usuário já cadastrado");
      }

      return console.log(error);
    }
  });

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Cadastrar Administrador</h2>
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
      <label htmlFor="confirm-password">Confirmar Senha</label>
      <input
        type={revealPassword ? "text" : "password"}
        id="confirm-password"
        required
        placeholder="senha123"
        value={confirmPassword}
        onChange={handleConfirmPassword}
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
      <button type="submit" disabled={btnDisabled}>
        Entrar
      </button>
    </form>
  );
}

export default CreateAdmin;

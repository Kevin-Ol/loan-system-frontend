import { useState, useCallback, useEffect } from "react";
import InputMask from "react-input-mask";
import axios from "axios";

function ClientRegister() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [tel, setTel] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [notes, setNotes] = useState("");

  const handleName = useCallback(({ target }) => setName(target.value));
  const handleAddress = useCallback(({ target }) => setAddress(target.value));
  const handleCpf = useCallback(({ target }) => setCpf(target.value));
  const handleRg = useCallback(({ target }) => setRg(target.value));
  const handleTel = useCallback(({ target }) => setTel(target.value));
  const handleNotes = useCallback(({ target }) => setNotes(target.value));

  const fetchCities = useCallback(async (uf) => {
    const CITIES_URL = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;
    const { data } = await axios.get(CITIES_URL);
    data.sort((a, b) => a.nome.localeCompare(b.nome));
    setCities(data);
  });

  const handleState = useCallback(({ target }) => {
    setSelectedState(target.value);
    fetchCities(target.value);
  });

  const handleCity = useCallback(({ target }) => {
    setSelectedCity(target.value);
  });

  useEffect(() => {
    const fetchStates = async () => {
      const STATES_URL =
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
      const { data } = await axios.get(STATES_URL);
      data.sort((a, b) => a.nome.localeCompare(b.nome));
      setStates(data);
    };

    fetchStates();
  }, []);

  return (
    <form>
      <label htmlFor="name">Nome</label>
      <input type="text" id="name" value={name} onChange={handleName} />
      <label htmlFor="address">Endereço</label>
      <input
        type="text"
        id="address"
        value={address}
        onChange={handleAddress}
      />
      <label htmlFor="cpf">CPF</label>
      <InputMask
        mask="999.999.999-99"
        placeholder="123.456.789-00"
        type="text"
        id="cpf"
        value={cpf}
        onChange={handleCpf}
      />
      <label htmlFor="rg">RG</label>
      <InputMask
        mask="99.999.999-9"
        placeholder="12.345.789-0"
        type="text"
        id="rg"
        value={rg}
        onChange={handleRg}
      />
      <label htmlFor="tel">Telefone</label>
      <InputMask
        mask="(99) 99999-9999"
        placeholder="(00) 98765-4321"
        type="text"
        id="tel"
        value={tel}
        onChange={handleTel}
      />
      <label htmlFor="state">Estado</label>
      <select id="state" value={selectedState} onChange={handleState}>
        <option>Selecione</option>
        {states.map(({ id, sigla, nome }) => (
          <option key={id} value={sigla}>
            {nome}
          </option>
        ))}
      </select>
      <label htmlFor="city">Cidade</label>
      <select id="city" value={selectedCity} onChange={handleCity}>
        <option>Selecione</option>
        {cities.map(({ id, sigla, nome }) => (
          <option key={id} value={sigla}>
            {nome}
          </option>
        ))}
      </select>
      <label htmlFor="notes">OBS:</label>
      <textarea value={notes} onChange={handleNotes} rows="5" cols="50" />
      <button type="submit">Finalizar Cadastro</button>
    </form>
  );
}

export default ClientRegister;

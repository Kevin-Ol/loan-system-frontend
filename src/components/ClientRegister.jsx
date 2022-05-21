import { useState, useCallback, useEffect } from "react";
import InputMask from "react-input-mask";
import axios from "axios";
import api from "../services/api";

function ClientRegister() {
  const onlyNumbers = useCallback((text) => text.replace(/[^0-9]/g, ""));

  const [name, setName] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [notes, setNotes] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleName = useCallback(({ target }) => setName(target.value));
  const handleStreet = useCallback(({ target }) => setStreet(target.value));
  const handleNeighborhood = useCallback(({ target }) =>
    setNeighborhood(target.value)
  );
  const handleCpf = useCallback(({ target }) =>
    setCpf(onlyNumbers(target.value))
  );
  const handleRg = useCallback(({ target }) =>
    setRg(onlyNumbers(target.value))
  );
  const handlePhone = useCallback(({ target }) =>
    setPhone(onlyNumbers(target.value))
  );
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

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      const clientInfo = {
        name,
        rg,
        cpf,
        phone,
        street,
        neighborhood,
        state: selectedState,
        city: selectedCity,
        notes,
      };

      setBtnDisabled(true);
      await api.post("client/create", clientInfo);
      setName("");
      setRg("");
      setCpf("");
      setPhone("");
      setStreet("");
      setNeighborhood("");
      setNotes("");
      global.alert("Cliente cadastrado com sucesso!");
    } catch (error) {
      setBtnDisabled(false);
      console.log(error);
      const { status } = error.response;

      if (status === 409) {
        global.alert("Usuário já cadastrado");
      }
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Nome</label>
      <input
        type="text"
        id="name"
        autoComplete="off"
        required
        value={name}
        onChange={handleName}
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
      <label htmlFor="cpf">CPF</label>
      <InputMask
        mask="999.999.999-99"
        placeholder="123.456.789-00"
        type="text"
        id="cpf"
        value={cpf}
        onChange={handleCpf}
      />
      <label htmlFor="phone">Telefone</label>
      <InputMask
        mask="(99) 99999-9999"
        placeholder="(00) 98765-4321"
        type="text"
        id="phone"
        value={phone}
        onChange={handlePhone}
      />
      <label htmlFor="street">Endereço</label>
      <input
        type="text"
        required
        autoComplete="off"
        id="street"
        value={street}
        onChange={handleStreet}
      />
      <label htmlFor="neighborhood">Bairro</label>
      <input
        type="text"
        id="neighborhood"
        required
        value={neighborhood}
        onChange={handleNeighborhood}
      />
      <label htmlFor="state">Estado</label>
      <select id="state" value={selectedState} required onChange={handleState}>
        <option value="">Selecione</option>
        {states.map(({ id, sigla, nome }) => (
          <option key={id} value={sigla}>
            {nome}
          </option>
        ))}
      </select>
      <label htmlFor="city">Cidade</label>
      <select id="city" value={selectedCity} required onChange={handleCity}>
        <option value="">Selecione</option>
        {cities.map(({ id, sigla, nome }) => (
          <option key={id} value={sigla}>
            {nome}
          </option>
        ))}
      </select>
      <label htmlFor="notes">OBS:</label>
      <textarea
        value={notes}
        onChange={handleNotes}
        autoComplete="off"
        rows="5"
      />
      <button type="submit" disabled={btnDisabled}>
        Finalizar Cadastro
      </button>
    </form>
  );
}

export default ClientRegister;

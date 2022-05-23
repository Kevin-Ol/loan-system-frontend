import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import InputMask from "react-input-mask";
import api from "../services/api";

function ClientEditDetails({ clientData, handleEditMode }) {
  const {
    id: clientId,
    name,
    rg,
    cpf,
    phone,
    street,
    neighborhood,
    state,
    city,
    notes,
  } = clientData;

  const onlyNumbers = useCallback((text) => text.replace(/[^0-9]/g, ""));

  const [editName, setEditName] = useState(name);
  const [editRg, setEditRg] = useState(rg);
  const [editCpf, setEditCpf] = useState(cpf);
  const [editPhone, setEditPhone] = useState(phone);
  const [editStreet, setEditStreet] = useState(street);
  const [editNeighborhood, setEditNeighborhood] = useState(neighborhood);
  const [editNotes, setEditNotes] = useState(notes);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(state);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(city);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleName = useCallback(({ target }) => setEditName(target.value));
  const handleRg = useCallback(({ target }) =>
    setEditRg(onlyNumbers(target.value))
  );
  const handleCpf = useCallback(({ target }) =>
    setEditCpf(onlyNumbers(target.value))
  );
  const handlePhone = useCallback(({ target }) =>
    setEditPhone(onlyNumbers(target.value))
  );
  const handleStreet = useCallback(({ target }) => setEditStreet(target.value));
  const handleNeighborhood = useCallback(({ target }) =>
    setEditNeighborhood(target.value)
  );
  const handleNotes = useCallback(({ target }) => setEditNotes(target.value));

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

  const handleClientEdit = useCallback(async () => {
    try {
      const clientInfo = {
        name: editName,
        rg: editRg,
        cpf: editCpf,
        phone: editPhone,
        street: editStreet,
        neighborhood: editNeighborhood,
        state: selectedState,
        city: selectedCity,
        notes: editNotes,
      };

      setBtnDisabled(true);
      await api.put(`client/${clientId}`, clientInfo);
      global.alert("Cliente atualizado com sucesso!");
      return window.location.reload();
    } catch (error) {
      setBtnDisabled(false);
      console.log(error);
      return global.alert("Erro no sistema");
    }
  });

  useEffect(() => {
    const fetchStates = async () => {
      const STATES_URL =
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
      const CITIES_URL = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`;

      const promises = [axios.get(STATES_URL), axios.get(CITIES_URL)];
      const [statesResponse, citiesResponse] = await Promise.all(promises);
      statesResponse.data.sort((a, b) => a.nome.localeCompare(b.nome));

      setStates(statesResponse.data);
      setCities(citiesResponse.data);
    };

    fetchStates();
  }, []);

  return (
    <section className="client-details">
      <h2>Dados Pessoais</h2>
      <p>
        <label htmlFor="name">Nome: </label>
        <input
          type="text"
          id="name"
          autoComplete="off"
          required
          value={editName}
          onChange={handleName}
        />
      </p>
      <p>
        <label htmlFor="rg">RG: </label>
        <InputMask
          mask="99.999.999-9"
          placeholder="12.345.789-0"
          type="text"
          id="rg"
          value={editRg}
          onChange={handleRg}
        />
      </p>
      <p>
        <label htmlFor="cpf">CPF: </label>
        <InputMask
          mask="999.999.999-99"
          placeholder="123.456.789-00"
          type="text"
          id="cpf"
          value={editCpf}
          onChange={handleCpf}
        />
      </p>
      <p>
        <label htmlFor="phone">Telefone: </label>
        <InputMask
          mask="(99) 99999-9999"
          placeholder="(00) 98765-4321"
          type="text"
          id="phone"
          value={editPhone}
          onChange={handlePhone}
        />
      </p>
      <p>
        <label htmlFor="street">Endereço: </label>
        <input
          type="text"
          required
          autoComplete="off"
          id="street"
          value={editStreet}
          onChange={handleStreet}
        />
      </p>
      <p>
        <label htmlFor="neighborhood">Bairro: </label>
        <input
          type="text"
          id="neighborhood"
          required
          value={editNeighborhood}
          onChange={handleNeighborhood}
        />
      </p>
      <p>
        <label htmlFor="state">Estado: </label>
        <select
          id="state"
          value={selectedState}
          required
          onChange={handleState}
        >
          <option value="">Selecione</option>
          {states.map(({ id, sigla, nome }) => (
            <option key={id} value={sigla}>
              {nome}
            </option>
          ))}
        </select>
      </p>
      <p>
        <label htmlFor="city">Cidade: </label>
        <select id="city" value={selectedCity} required onChange={handleCity}>
          <option value="">Selecione</option>
          {cities.map(({ id, sigla, nome }) => (
            <option key={id} value={sigla}>
              {nome}
            </option>
          ))}
        </select>
      </p>
      <p>
        <label htmlFor="notes">OBS: </label>
        <textarea
          value={editNotes}
          onChange={handleNotes}
          autoComplete="off"
          rows="5"
        />
      </p>
      <div>
        <button type="button" onClick={handleEditMode}>
          Cancelar
        </button>
        <button type="button" disabled={btnDisabled} onClick={handleClientEdit}>
          Salvar
        </button>
      </div>
    </section>
  );
}

export default ClientEditDetails;

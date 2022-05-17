import { useState, useCallback, useEffect } from "react";
import api from "../services/api";
import TransactionList from "./TransactionList";
import "../styles/SearchClient.scss";

function SearchClient() {
  const [client, setClient] = useState("");
  const [clientId, setClientId] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [loanList, setLoanList] = useState([]);

  const handleClient = useCallback(({ target }) => {
    setClient(target.value);
    const clientInfo = clientList.find(({ name }) => name === target.value);
    if (clientInfo) {
      setClientId(clientInfo.id);
    } else {
      setClientId(null);
    }
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await api.get("client/list");
        setClientList(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.get(`loan/list/${clientId}`);
      setLoanList(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <form onSubmit={handleSubmit} className="search-bar">
        <label htmlFor="client">Cliente</label>
        <input
          type="text"
          name="client"
          required
          autoComplete="off"
          list="clientName"
          onChange={handleClient}
          value={client}
        />
        <datalist id="clientName">
          {clientList.map(({ id, name }) => (
            <option key={id} value={name}>
              {name}
            </option>
          ))}
        </datalist>
        <button type="submit">Buscar</button>
      </form>
      {loanList.length > 0 && <TransactionList loanList={loanList} />}
    </>
  );
}

export default SearchClient;

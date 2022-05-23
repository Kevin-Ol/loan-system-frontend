import { useState, useCallback, useEffect } from "react";
import api from "../services/api";
import AllLoansList from "./AllLoansList";
import AllSettlementsList from "./AllSettlementsList";
import CreateSettlementModal from "./CreateSettlementModal";
import ClientDetails from "./ClientDetails";
import ClientEditDetails from "./ClientEditDetails";
import "../styles/SearchClient.scss";

function SearchClient() {
  const [client, setClient] = useState("");
  const [clientId, setClientId] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [loanList, setLoanList] = useState([]);
  const [settlementList, setSettlementList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleEditMode = () => setEditMode((previousState) => !previousState);

  const handleModal = useCallback(
    () => setModalIsOpen((oldState) => !oldState),
    []
  );

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
      const promises = [
        api.get(`loan/list/${clientId}`),
        api.get(`settlement/list/${clientId}`),
        api.get(`client/${clientId}`),
      ];
      const [loans, settlements, clientResponse] = await Promise.all(promises);
      setLoanList(loans.data);
      setSettlementList(settlements.data);
      setClientData(clientResponse.data);
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
      {clientData && !editMode && (
        <ClientDetails
          clientData={clientData}
          handleEditMode={handleEditMode}
        />
      )}
      {clientData && editMode && (
        <ClientEditDetails
          clientData={clientData}
          handleEditMode={handleEditMode}
        />
      )}
      {loanList.length > 0 && (
        <>
          <AllLoansList loanList={loanList} />
          <button
            type="button"
            onClick={handleModal}
            className="generate-settlement"
          >
            Gerar acordo
          </button>
          <CreateSettlementModal
            modalIsOpen={modalIsOpen}
            handleModal={handleModal}
            loanList={loanList}
            clientId={clientId}
          />
        </>
      )}
      {settlementList.length > 0 && (
        <AllSettlementsList settlementList={settlementList} />
      )}
    </>
  );
}

export default SearchClient;

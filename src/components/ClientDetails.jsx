import states from "../utils/states";

function ClientDetails({ clientData, handleEditMode }) {
  const { name, rg, cpf, phone, street, neighborhood, state, city, notes } =
    clientData;

  const { nome } = states.find((document) => document.sigla === state);

  return (
    <section className="client-details">
      <h2>Dados Pessoais</h2>
      <p>
        <span>Nome: </span>
        {name}
      </p>
      <p>
        <span>RG: </span>
        {rg}
      </p>
      <p>
        <span>CPF: </span>
        {cpf}
      </p>
      <p>
        <span>Telefone: </span>
        {phone}
      </p>
      <p>
        <span>Endereço: </span>
        {street}
      </p>
      <p>
        <span>Bairro: </span>
        {neighborhood}
      </p>
      <p>
        <span>Estado: </span>
        {nome}
      </p>
      <p>
        <span>Cidade: </span>
        {city}
      </p>
      <p>
        <span>OBS: </span>
        {notes}
      </p>
      <button type="button" onClick={handleEditMode}>
        Editar
      </button>
    </section>
  );
}

export default ClientDetails;

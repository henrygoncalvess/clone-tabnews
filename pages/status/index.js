/* eslint-disable no-unused-vars */

import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function Highlight({ children }) {
  return (
    <mark
      style={{
        backgroundColor: "rgba(19, 128, 237, 0.33)",
        padding: "2px 8px",
        borderRadius: "15px",
        border: "1px solid rgba(0, 94, 188, 0.81)",
        fontWeight: "normal",
      }}
    >
      {children}
    </mark>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    // refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <div>
      <strong>Última atualização:</strong>{" "}
      <Highlight>{updatedAtText}</Highlight>
    </div>
  );
}

function Database() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI);

  let { version, max_connections, opened_connections } = "Carregando...";

  if (!isLoading && data) {
    version = data.dependencies.database.version;
    max_connections = data.dependencies.database.max_connections;
    opened_connections = data.dependencies.database.opened_connections;
  }

  return (
    <div>
      <strong style={{ marginLeft: "12px" }}>Banco de Dados:</strong>
      <p style={{ margin: "5px 5px 5px 24px" }}>
        Versão: <Highlight>{version}</Highlight>
      </p>
      <p style={{ margin: "5px 5px 5px 24px" }}>
        Conexões máximas: <Highlight>{max_connections}</Highlight>
      </p>
      <p style={{ margin: "5px 5px 5px 24px" }}>
        Conexões abertas: <Highlight>{opened_connections}</Highlight>
      </p>
    </div>
  );
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <strong>Dependências:</strong>
      <Database />
    </>
  );
}

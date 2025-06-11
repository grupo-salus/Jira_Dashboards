import { Card, Response } from "../types/backlog";

const API_URL = "http://localhost:8000";

// Funções de API
export async function fetchBacklogTable(filters?: {
  area?: string;
  status?: string;
  prioridade?: string;
  grupo_solicitante?: string;
  solicitante?: string;
  projeto?: string;
}): Promise<Card.Backlog[]> {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          // Decodifica o valor antes de adicionar aos parâmetros
          const decodedValue = decodeURIComponent(value);
          queryParams.append(key, decodedValue);
        }
      });
    }

    const url = `${API_URL}/api/backlog/tabela${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch backlog table");
    }

    const data: Response.Backlog = await response.json();

    // Decodifica os caracteres especiais nos dados retornados
    return (data.tabela_backlog ?? []).map((item) => ({
      ...item,
      Título: decodeURIComponent(item.Título || ""),
      Projeto: decodeURIComponent(item.Projeto || ""),
      "Unidade / Departamento": decodeURIComponent(
        item["Unidade / Departamento"] || ""
      ),
      Solicitante: decodeURIComponent(item.Solicitante || ""),
      Prioridade: decodeURIComponent(item.Prioridade || ""),
    }));
  } catch (error) {
    console.error("Error fetching backlog table:", error);
    throw error;
  }
}

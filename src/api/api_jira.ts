import { BacklogItem, BacklogResponse } from "../types/backlog";

const API_URL = "http://localhost:8000";

// Funções de API
export async function fetchBacklogTable(filters?: {
  departamento?: string;
  status?: string;
  prioridade?: string;
  grupo_solicitante?: string;
  solicitante?: string;
  epico?: string;
}): Promise<BacklogItem[]> {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    const url = `${API_URL}/api/backlog/tabela${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch backlog table");
    }

    const data: BacklogResponse = await response.json();
    return data.tabela_backlog;
  } catch (error) {
    console.error("Error fetching backlog table:", error);
    throw error;
  }
}

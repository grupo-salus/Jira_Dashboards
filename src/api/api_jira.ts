import { BacklogProjectsSummary } from "../types/backlog";

const API_URL = "http://localhost:8000";

export interface BacklogSummary {
  total: number;
  tempo_medio: number;
  mais_antigo: {
    chave: string;
    titulo: string;
    dias_no_backlog: number;
  };
  fila_de_espera: Array<{
    Chave: string;
    Título: string;
    dias: number;
  }>;
  por_departamento: Record<string, number>;
  por_solicitante: Record<string, number>;
  por_prioridade: Record<string, number>;
  por_status: Record<string, number>;
  tempo_medio_por_departamento: Record<string, number>;
  por_mes_criacao: Array<{
    mes: string;
    total: number;
  }>;
  acima_de_15_dias: number;
  sem_prioridade_calculada: number;
}

export interface SprintResumoGeral {
  total_cards: number;
  entregues_no_prazo: number;
  fora_do_prazo: number;
  percentual_no_prazo: number;
}

export interface SprintDevResumo {
  "Responsável (Dev)": string;
  qtd_cards: number;
  horas_estimadas: number;
  horas_gastas: number;
  entregues_no_prazo: number;
  fora_do_prazo: number;
  percentual_no_prazo: number;
}

export interface SprintMaisEstourados {
  Chave: string;
  Título: string;
  "Responsável (Dev)": string;
  "Estimativa Original (horas)": number;
  "Tempo Gasto (horas)": number;
}

export interface SprintSummary {
  resumo_geral: SprintResumoGeral;
  por_desenvolvedor: SprintDevResumo[];
  por_status: Record<string, number>;
  top_5_mais_estourados: SprintMaisEstourados[];
}

export async function fetchBacklogSummary(filters?: {
  departamento?: string;
  status?: string;
  prioridade?: string;
  grupo_solicitante?: string;
  solicitante?: string;
  epico?: string;
}): Promise<BacklogProjectsSummary> {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    const url = `${API_URL}/api/backlog/por-projetos${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch backlog summary");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching backlog summary:", error);
    throw error;
  }
}

export async function fetchSprintSummary(): Promise<SprintSummary> {
  try {
    const response = await fetch("http://localhost:8000/api/sprint/resumo");
    if (!response.ok) {
      throw new Error("Failed to fetch sprint summary");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching sprint summary:", error);
    throw error;
  }
}

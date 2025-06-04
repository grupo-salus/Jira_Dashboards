import { BacklogItem } from '../types/backlog';

const API_URL = 'http://localhost:8000';

export interface BacklogSummary {
  total: number;
  tempo_medio: number;
  mais_antigo: {
    chave: string;
    titulo: string;
    dias_no_backlog: number;
  };
  top_5_fila: Array<{
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

export async function fetchBacklogData(): Promise<BacklogItem[]> {
  try {
    const response = await fetch(`${API_URL}/api/backlog/raw`);
    if (!response.ok) {
      throw new Error('Failed to fetch backlog data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching backlog data:', error);
    throw error;
  }
}

export async function fetchSprintData(): Promise<BacklogItem[]> {
  try {
    const response = await fetch(`${API_URL}/api/sprint`);
    if (!response.ok) {
      throw new Error('Failed to fetch sprint data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sprint data:', error);
    throw error;
  }
}

export async function fetchBacklogSummary(filters?: {
  departamento?: string;
  status?: string;
  prioridade?: string;
  grupo_solicitante?: string;
  solicitante?: string;
}): Promise<BacklogSummary> {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    const url = `${API_URL}/api/backlog/resumo${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch backlog summary');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching backlog summary:', error);
    throw error;
  }
}
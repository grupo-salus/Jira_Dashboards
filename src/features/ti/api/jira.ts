import { TIApiResponse, TIApiError } from "../types";

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("API_BASE_URL:", API_BASE_URL);

// Função utilitária para fazer fetch seguro
async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    throw error;
  }
}

// API específica para Acompanhamento TI
export const tiApi = {
  /**
   * Busca dados da tabela de acompanhamento TI
   */
  async getTabelaTI(): Promise<TIApiResponse> {
    return safeFetch<TIApiResponse>(
      `${API_BASE_URL}/api/acompanhamento_ti/tabela`
    );
  },
};

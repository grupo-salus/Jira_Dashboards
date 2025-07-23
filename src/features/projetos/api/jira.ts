import { ProjetosApiResponse } from "../types/index";

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
    throw new Error(`Erro na requisição: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

// API específica para Espaço de Projetos
export const projetosApi = {
  /**
   * Busca dados da tabela de espaço de projetos
   */
  async getTabelaProjetos(): Promise<ProjetosApiResponse> {
    return safeFetch<ProjetosApiResponse>(
      `${API_BASE_URL}/api/espaco_de_projetos/tabela`
    );
  },

  /**
   * Busca opções de um campo customizado específico para projetos
   */
  async getOpcoesCampoCustomizado(
    fieldId: string
  ): Promise<{ opcoes_campo_customizado: string[] }> {
    return safeFetch<{ opcoes_campo_customizado: string[] }>(
      `${API_BASE_URL}/api/jira/opcoes-campo-customizado/${fieldId}`
    );
  },
};

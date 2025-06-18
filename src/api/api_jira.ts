/**
 * api_jira.ts
 *
 * Este arquivo contém as funções para comunicação com a API do Jira:
 * 1. Funções para buscar dados do backlog
 * 2. Tratamento de erros e respostas
 * 3. Gerenciamento de parâmetros de filtro
 *
 * Principais funções:
 * - fetchBacklogTable: Busca a tabela de backlog com suporte a filtros
 * - fetchAcompanhamentoTI: Busca a tabela de acompanhamento TI com suporte a filtros
 * - fetchEspacoDeProjetos: Busca a tabela de espaço de projetos com suporte a filtros
 *
 * O arquivo também lida com:
 * - Decodificação de caracteres especiais
 * - Tratamento de erros de rede
 * - Validação de respostas
 */
import {
  ResultApi,
  AcompanhamentoTI,
  EspacoDeProjetos,
} from "../types/Typesjira";

interface BacklogResponse {
  tabela_backlog: ResultApi[];
}

interface AcompanhamentoTIResponse {
  tabela_dashboard_ti: AcompanhamentoTI[];
}

interface EspacoDeProjetosResponse {
  tabela_dashboard_ep: EspacoDeProjetos[];
}

const API_URL = "http://localhost:8000";

// Funções de API
export async function fetchBacklogTable(filters?: {
  area?: string;
  status?: string;
  prioridade?: string;
  grupo_solicitante?: string;
  solicitante?: string;
  projeto?: string;
}): Promise<ResultApi[]> {
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

    const data: BacklogResponse = await response.json();

    // Decodifica os caracteres especiais nos dados retornados
    return (data.tabela_backlog ?? []).map((item: ResultApi) => ({
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

export async function fetchAcompanhamentoTI(filters?: {
  responsavel?: string;
  prioridade?: string;
  periodo_dias?: number;
}): Promise<AcompanhamentoTI[]> {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          // Converte o valor para string e decodifica antes de adicionar aos parâmetros
          const decodedValue = decodeURIComponent(String(value));
          queryParams.append(key, decodedValue);
        }
      });
    }

    const url = `${API_URL}/api/acompanhamento_ti/tabela${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch acompanhamento TI table");
    }

    const data: AcompanhamentoTIResponse = await response.json();

    // Decodifica os caracteres especiais nos dados retornados
    return (data.tabela_dashboard_ti ?? []).map((item: AcompanhamentoTI) => ({
      ...item,
      Título: decodeURIComponent(item.Título || ""),
      Responsável: decodeURIComponent(item.Responsável || ""),
      Relator: decodeURIComponent(item.Relator || ""),
      Prioridade: decodeURIComponent(item.Prioridade || ""),
      Time: decodeURIComponent(item.Time || ""),
      Categoria: decodeURIComponent(item.Categoria || ""),
    }));
  } catch (error) {
    console.error("Error fetching acompanhamento TI table:", error);
    throw error;
  }
}

export async function fetchEspacoDeProjetos(filters?: {
  area?: string;
  projeto?: string;
  status?: string;
  prioridade?: string;
  grupo_solicitante?: string;
  solicitante?: string;
}): Promise<EspacoDeProjetos[]> {
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

    const url = `${API_URL}/api/espaco_de_projetos/tabela${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch espaco de projetos table");
    }

    const data: EspacoDeProjetosResponse = await response.json();

    // Decodifica os caracteres especiais nos dados retornados
    return (data.tabela_dashboard_ep ?? []).map((item: EspacoDeProjetos) => ({
      ...item,
      Título: decodeURIComponent(item.Título || ""),
      Descrição: item.Descrição ? decodeURIComponent(item.Descrição) : null,
      "Benefícios Esperados": item["Benefícios Esperados"]
        ? decodeURIComponent(item["Benefícios Esperados"])
        : null,
      "Grupo Solicitante": decodeURIComponent(item["Grupo Solicitante"] || ""),
      "Departamento Solicitante": decodeURIComponent(
        item["Departamento Solicitante"] || ""
      ),
      Solicitante: item.Solicitante
        ? decodeURIComponent(item.Solicitante)
        : null,
      Responsável: decodeURIComponent(item.Responsável || ""),
      Relator: decodeURIComponent(item.Relator || ""),
      Prioridade: decodeURIComponent(item.Prioridade || ""),
      Categoria: item.Categoria ? decodeURIComponent(item.Categoria) : null,
    }));
  } catch (error) {
    console.error("Error fetching espaco de projetos table:", error);
    throw error;
  }
}

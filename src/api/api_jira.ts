/**
 * api_jira.ts
 *
 * Este arquivo contém as funções para comunicação com a API do Jira:
 * 1. Funções para buscar dados de acompanhamento TI
 * 2. Funções para buscar dados de espaço de projetos
 * 3. Tratamento de erros e respostas
 * 4. Gerenciamento de parâmetros de filtro
 *
 * Principais funções:
 * - fetchAcompanhamentoTI: Busca a tabela de acompanhamento TI com suporte a filtros
 * - fetchEspacoDeProjetos: Busca a tabela de espaço de projetos com suporte a filtros
 *
 * O arquivo também lida com:
 * - Decodificação de caracteres especiais
 * - Tratamento de erros de rede
 * - Validação de respostas
 */
import { AcompanhamentoTI, EspacoDeProjetos } from "../types/Typesjira";
import { normalizarStatusDisplay } from "../components/DashProjetos/kanbanUtils";

interface AcompanhamentoTIResponse {
  tabela_dashboard_ti: AcompanhamentoTI[];
}

interface EspacoDeProjetosResponse {
  tabela_dashboard_ep: EspacoDeProjetos[];
}

const API_URL = import.meta.env.VITE_API_URL;

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
      Status: normalizarStatusDisplay(item.Status),
      Título: decodeURIComponent(item.Título || ""),
      Responsável: decodeURIComponent(item.Responsável || ""),
      Relator: decodeURIComponent(item.Relator || ""),
      Prioridade: decodeURIComponent(item.Prioridade || ""),
      Time: decodeURIComponent(item.Time || ""),
      Squad: decodeURIComponent(item.Squad || ""),
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
      Status: normalizarStatusDisplay(item.Status),
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
      Squad: item.Squad ? decodeURIComponent(item.Squad) : null,
      PosicaoBacklog: item.PosicaoBacklog,
    }));
  } catch (error) {
    console.error("Error fetching espaco de projetos table:", error);
    throw error;
  }
}

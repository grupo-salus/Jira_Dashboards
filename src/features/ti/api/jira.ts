// API temporariamente desabilitada - Dashboard TI em desenvolvimento
import { TIApiResponse } from "../types";

// Configuração base da API
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API específica para Acompanhamento TI (desabilitada)
export const tiApi = {
  /**
   * Busca dados da tabela de acompanhamento TI
   * Temporariamente desabilitada - Dashboard em desenvolvimento
   */
  async getTabelaTI(): Promise<TIApiResponse> {
    console.log("API TI desabilitada - Dashboard em desenvolvimento");
    throw new Error("Dashboard TI em desenvolvimento");
  },
};

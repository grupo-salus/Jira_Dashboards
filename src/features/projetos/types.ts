import { EspacoDeProjetos } from "../../types/Typesjira";

export type ProjetosTableData = EspacoDeProjetos[];

export interface ProjetosApiResponse {
  tabela_dashboard_ep: ProjetosTableData;
}

export interface ProjetosApiError {
  erro: string;
}

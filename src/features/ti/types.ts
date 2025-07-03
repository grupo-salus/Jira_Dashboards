import { AcompanhamentoTI } from "../../types/Typesjira";

export type TITableData = AcompanhamentoTI[];

export interface TIApiResponse {
  tabela_dashboard_ti: TITableData;
}

export interface TIApiError {
  erro: string;
}

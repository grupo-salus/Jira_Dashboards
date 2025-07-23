/**
 * Interface para os dados do acompanhamento TI
 * Representa os dados retornados pela API de acompanhamento
 */
export interface AcompanhamentoTI {
  ID: string;
  Chave: string;
  Título: string;
  Status: JiraStatus;
  Tipo: string;
  Prioridade: string;
  Responsável: string;
  Relator: string;
  Time: string;
  Squad: string;
  "Criado em": string;
  "Atualizado em": string;
  "Data de Início": string | null;
  "Data Prevista de Término": string | null;
  "Data Limite": string | null;
  "Data de Conclusão": string | null;
  "Tempo Gasto (segundos)": number;
  "Controle de tempo": string | null;
  "Estimativa (segundos)": number;
  "Esforço Registrado Total": number;
  Labels: string | null;
  "Dias no Backlog": number;
  "Dias até Entrega (estimado)": number | null;
}

export type TITableData = AcompanhamentoTI[];

export interface TIApiResponse {
  tabela_dashboard_ti: TITableData;
}

export interface TIApiError {
  erro: string;
}

// Tipos compartilhados que podem ser usados por outras features
export type JiraStatus =
  | "Backlog"
  | "Bloqueado"
  | "Backlog Priorizado"
  | "Cancelado"
  | "Em Andamento"
  | "Em Homologação"
  | "Operação Assistida"
  | "Concluído";

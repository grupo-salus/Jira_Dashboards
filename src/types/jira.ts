/**
 * Interface base para cards do Jira
 * Representa os dados brutos que vêm da API
 */
export interface ResultApi {
  ID: string;
  Chave: string;
  Título: string;
  Projeto: string;
  Tipo: string;
  Status: string;
  "Data de Criação": string;
  "Última Atualização": string;
  "Relator Técnico": string;
  "Grupo Solicitante": string;
  "Unidade / Departamento": string;
  Solicitante: string;
  Sprint: string | null;
  "Responsável (Dev)": string;
  "Estimativa Original (segundos)": number;
  "Controle de Tempo (segundos)": number;
  Prioridade: string;
  Branch: string | null;
  "versões afetadas": string | null;
  "versões corrigidas": string | null;
  "Backlog (nome)": string | null;
  "Dias no Backlog": number;
}

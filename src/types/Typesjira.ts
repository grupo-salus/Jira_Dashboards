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

/**
 * Interface para os dados do acompanhamento TI
 * Representa os dados retornados pela API de acompanhamento
 */
export interface AcompanhamentoTI {
  ID: string;
  Chave: string;
  Título: string;
  Status: string;
  Tipo: string;
  Prioridade: string;
  Responsável: string;
  Relator: string;
  Time: string;
  Categoria: string;
  "Criado em": string;
  "Atualizado em": string;
  "Data de Início": string | null;
  "Data Prevista de Término": string | null;
  "Data Limite": string | null;
  "Data de Conclusão": string | null;
  "Tempo Gasto (segundos)": number;
  "Tempo Gasto (formatado)": string | null;
  "Estimativa (segundos)": number;
  "Esforço Registrado Total": number;
  Labels: string | null;
  "Dias no Backlog": number;
  "Dias até Entrega (estimado)": number | null;
}

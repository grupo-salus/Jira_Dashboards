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

/**
 * Interface para os dados do Espaço de Projetos
 * Representa os dados retornados pela API de espaço de projetos
 */
export interface EspacoDeProjetos {
  ID: string;
  Tipo: string;
  Chave: string;
  Título: string;
  Prioridade: string;
  Descrição: string | null;
  "Aprovador por (diretor)": string | null;
  "Benefícios Esperados": string | null;
  Status: string;
  "Grupo Solicitante": string;
  "Departamento Solicitante": string;
  Solicitante: string | null;
  "Telefone do Solicitante": string | null;
  "Email do Solicitante": string | null;
  Responsável: string;
  Relator: string;
  Categoria: string | null;
  "Estimativa original (segundos)": number;
  "Tempo Gasto (formatado)": string | null;
  "Investimento Esperado": string | null;
  "Data de criação": string;
  "Data de atualização": string;
  "Target start": string | null;
  "Target end": string | null;
  "Data de término": string | null;
  "Dias no Backlog": number;
  "Dias até Entrega (estimado)": number | null;
}

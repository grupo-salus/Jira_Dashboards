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

/**
 * Interface para os dados do Espaço de Projetos
 * Representa os dados retornados pela API de espaço de projetos
 */
export interface EspacoDeProjetos {
  ID: string; // ID interno da issue no Jira
  Tipo: string; // Tipo da issue (ex: Tarefa, Bug, Épico)
  Chave: string; // Chave da issue (ex: EP-123)
  Título: string; // Título resumido da tarefa ou projeto
  Prioridade: string; // Prioridade definida no Jira (Estratégica, Alta, Média, Baixa, Baixíssima)
  PosicaoBacklog: number | null; // Posição no backlog priorizado (baseada no Rank do Jira)
  Descrição: string | null; // Descrição da issue (primeiro parágrafo do rich text)
  "Aprovador por (diretor)": string | null; // Diretor responsável pela aprovação (campo customizado)
  "Benefícios Esperados": string | null; // Texto inserido no campo de benefícios do projeto
  Status: JiraStatus; // Status atual no fluxo do Jira (ex: Em desenvolvimento, Entregue)

  "Grupo Solicitante": string; // Unidade, time ou grupo que solicitou o projeto
  "Departamento Solicitante": string; // Área ou diretoria à qual o grupo pertence
  "Responsável Atual": string | null; // Pessoa responsável pelo projeto
  Solicitante: string | null; // Nome da pessoa que abriu o chamado
  "Telefone do Solicitante": string | null; // Telefone de contato
  "Email do Solicitante": string | null; // E-mail para retorno

  Responsável: string; // Pessoa atribuída ao desenvolvimento da tarefa
  Relator: string; // Pessoa que criou o card no Jira
  Squads: string[]; // Array com todos os squads associados ao projeto

  "Estimativa original (segundos)": number; // Tempo inicialmente estimado no Jira, em segundos
  "Tempo registrado (segundos)": number | null; // Tempo total já registrado via controle (ex: Clockify), em segundos
  "Tempo restante (segundos)": number | null; // Tempo restante estimado, em segundos
  "Investimento Esperado": string | null; // Valor estimado para o projeto (R$ ou outro), se aplicável

  "Data de criação": string; // Data em que o card foi criado no Jira
  "Data de atualização": string; // Última modificação registrada no card
  "Target start": string | null; // Data planejada de início do projeto
  "Target end": string | null; // Data planejada de término do projeto
  "Data de término": string | null; // Data em que a issue foi finalizada no Jira

  // Estratégias de desenvolvimento e ideação
  "Status de ideação": IdeacaoStatus | null;
  "Status de prazo": PrazoStatus | null;

  "Data: Início Backlog"?: string | null;
  "Data: Fim Backlog"?: string | null;
  "Data: Início Backlog priorizado"?: string | null;
  "Data: Fim Backlog priorizado"?: string | null;
  "Data: Início Análise técnica e negócios"?: string | null;
  "Data: Fim Análise técnica e negócios"?: string | null;
  "Data: Início Em desenvolvimento"?: string | null;
  "Data: Fim Em desenvolvimento"?: string | null;
  "Data: Início Em homologação"?: string | null;
  "Data: Fim Em homologação"?: string | null;
  "Data: Início Operação assistida"?: string | null;
  "Data: Fim Operação assistida"?: string | null;
  "Data: Início Entregue"?: string | null;
  "Data: Fim Entregue"?: string | null;
  "Data: Início Cancelado"?: string | null;
  "Data: Fim Cancelado"?: string | null;
  "Motivo para Cancelamento de Projeto"?: string | null;
  "Data: Início Bloqueado"?: string | null;
  "Data: Fim Bloqueado"?: string | null;
  "Motivo para Bloqueio de Projeto"?: string | null;

  // Colunas calculadas de tempo por fase
  "Tempo na fase Ideação (dias)"?: number | null;
  "Tempo na fase Backlog Priorizado (dias)"?: number | null;
  "Tempo na fase Análise técnica e negócios (dias)"?: number | null;
  "Tempo na fase Em desenvolvimento (dias)"?: number | null;
  "Tempo na fase Em homologação (dias)"?: number | null;
  "Tempo na fase Operação assistida (dias)"?: number | null;
  "Tempo na fase Entregue (dias)"?: number | null;
  "Tempo na fase Cancelado (dias)"?: number | null;
  "Tempo na fase Bloqueado (dias)"?: number | null;

  // Colunas de status e controle
  "Dias na fase atual"?: number | null;
  "Status da fase atual"?: string | null;
}

export type JiraStatus =
  | "Backlog"
  | "Bloqueado"
  | "Backlog Priorizado"
  | "Análise técnica e negócios"
  | "Análise Técnica E Negócios"
  | "Cancelado"
  | "Em Desenvolvimento"
  | "Em Homologação"
  | "Operação Assistida"
  | "Entregue";

// Status de ideação
export type IdeacaoStatus = "Recente" | "Rever" | "Quase obsoleto" | "Obsoleto";

// Status de prazo
export type PrazoStatus = "No prazo" | "Em risco" | "Atrasado";

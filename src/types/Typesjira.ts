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
  Categoria: string;
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
  Prioridade: string; // Prioridade definida no Jira (Estratégico, Alta, Média, Baixa, Muito Baixa)
  PosicaoBacklog: number | null; // Posição no backlog priorizado (baseada no Rank do Jira)
  Descrição: string | null; // Descrição da issue (primeiro parágrafo do rich text)
  "Aprovador por (diretor)": string | null; // Diretor responsável pela aprovação (campo customizado)
  "Benefícios Esperados": string | null; // Texto inserido no campo de benefícios do projeto
  Status: JiraStatus; // Status atual no fluxo do Jira (ex: Em andamento, Concluído)

  "Grupo Solicitante": string; // Unidade, time ou grupo que solicitou o projeto
  "Departamento Solicitante": string; // Área ou diretoria à qual o grupo pertence
  Solicitante: string | null; // Nome da pessoa que abriu o chamado
  "Telefone do Solicitante": string | null; // Telefone de contato
  "Email do Solicitante": string | null; // E-mail para retorno

  Responsável: string; // Pessoa atribuída à execução da tarefa
  Relator: string; // Pessoa que criou o card no Jira
  Categoria: string | null; // Categoria do projeto (vinda das labels do Jira)

  "Estimativa original (segundos)": number; // Tempo inicialmente estimado no Jira, em segundos
  "Tempo registrado (segundos)": number | null; // Tempo total já registrado via controle (ex: Clockify), em segundos
  "Tempo restante (segundos)": number | null; // Tempo restante estimado, em segundos
  "Investimento Esperado": string | null; // Valor estimado para o projeto (R$ ou outro), se aplicável

  "Data de criação": string; // Data em que o card foi criado no Jira
  "Data de atualização": string; // Última modificação registrada no card
  "Target start": string | null; // Data planejada de início do projeto
  "Target end": string | null; // Data planejada de término do projeto
  "Data de término": string | null; // Data em que a issue foi finalizada no Jira

  // Estratégias de execução e ideação
  "Dias desde criação": number | null;
  "Status de ideação": IdeacaoStatus | null;
  "Dias planejados": number | null;
  "Dias desde o início": number | null;
  "Dias restantes": number | null;
  "% do tempo decorrido": number | null;
  "Status de prazo": PrazoStatus | null;
  "% da estimativa usada": number | null;
  "Status de esforço": EsforcoStatus | null;
}

export type JiraStatus =
  | "Backlog"
  | "Bloqueado"
  | "Backlog Priorizado"
  | "Cancelado"
  | "Em andamento"
  | "Em Homologação"
  | "OPERAÇÃO ASSISTIDA"
  | "Concluído";

// Status de ideação
export type IdeacaoStatus = "Recente" | "Rever" | "Quase obsoleto" | "Obsoleto";

// Status de prazo
export type PrazoStatus = "No prazo" | "Fora do prazo";

// Status de esforço
export type EsforcoStatus =
  | "Dentro do estimado"
  | "Próximo do limite"
  | "Estourou a estimativa";

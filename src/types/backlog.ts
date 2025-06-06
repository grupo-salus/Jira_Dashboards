// Interfaces base para métricas de tempo
export interface TimeMetric {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Tipos básicos
export type PriorityType = string;
export type GroupType = string;
export type DepartmentType = string;

// Interface para saúde do backlog
export interface BacklogHealth {
  idade_media_dias: number;
  card_mais_antigo_dias: number;
  distribuicao_por_idade: {
    "0-30 dias": number;
    "31-60 dias": number;
    "61-90 dias": number;
    "91+ dias": number;
  };
}

// Interface para carga de trabalho
export interface WorkloadByDepartment {
  total_cards: Record<string, number>;
  horas_estimadas: Record<string, number>;
}

// Interface para relação departamento vs prioridade
export interface DepartmentPriorityRelation {
  [department: string]: {
    [priority: string]: number;
  };
}

// Interface para distribuição de prioridade por épico
export interface PriorityDistributionByEpic {
  [epic: string]: {
    [priority: string]: number;
  };
}

// Interface para card resumido
export interface CardSummary {
  Chave: string;
  Título: string;
  Prioridade: string;
  Épico: string;
  "Unidade / Departamento": string;
}

// Interface principal para resumo do backlog por projetos
export interface BacklogSummary {
  // Métricas principais
  total_cards: number;
  total_epicos_unicos: number;
  total_cards_sem_epico: number;
  
  // Primeiros cards na fila
  primeiro_card_na_fila: CardSummary | null;
  primeiro_projeto_na_fila: CardSummary | null;
  
  // Distribuições e análises
  distribuicao_prioridade_por_epico: PriorityDistributionByEpic;
  saude_do_backlog: BacklogHealth;
  distribuicao_por_status: Record<string, number>;
  carga_de_trabalho_por_departamento: WorkloadByDepartment;
  distribuicao_geral_de_prioridade: Record<string, number>;
  relacao_departamento_vs_prioridade: DepartmentPriorityRelation;
  
  // Detalhes das filas
  detalhes_cards_com_epico: CardSummary[];
  resumo_geral_cards: CardSummary[];
}

// Interface base para cards do Jira
export interface BaseJiraCard {
  ID: string;
  Chave: string;
  Título: string;
  Tipo: string;
  Status: string;
  "Data de Criação": string;
  "Última Atualização": string;
  "Prioridade Calculada": number;
  "Relator Técnico": string;
  "Grupo Solicitante": string;
  "Unidade / Departamento": string;
  Solicitante: string;
  Sprint: string;
  "Responsável (Dev)": string;
  "Estimativa Original (segundos)": number;
  "Controle de Tempo (segundos)": number;
  Prioridade: string;
  Branch: string;
  "Backlog (nome)": string;
  Versão: string;
  Descrição: string;
}

// Interface para cards do backlog com campos calculados
export interface BacklogItem extends BaseJiraCard {
  timeInQueue?: string;
  progressPercentage?: number;
  estimatedCompletion?: string;
}

// Interface para cards em projetos
export interface ProjectCard {
  Chave: string;
  Título: string;
  Solicitante: string;
  "Unidade / Departamento": string;
  "Dias no Backlog": number;
  Prioridade: string;
}

// Interface para projetos
export interface Project {
  epico: string;
  total_cards: number;
  prioridade_distribuicao: Record<string, number>;
  media_dias_backlog: number;
  mais_antigo: string;
  estimativa_total_horas: number;
  cards: ProjectCard[];
}

// Interface para projetos por departamento
export interface DepartmentProject {
  epico: string;
  total_cards: number;
  cards: Array<{
    Chave: string;
    Título: string;
    "Dias no Backlog": number;
  }>;
}

// Interface para informações de departamento
export interface DepartmentInfo {
  total_projetos: number;
  projetos: DepartmentProject[];
}

// Interface para resumo de departamento
export interface DepartmentSummary {
  total_projetos: number;
  total_cards: number;
  projetos: Array<{
    epico: string;
    total_cards: number;
    cards: Array<{
      Chave: string;
      Título: string;
      "Dias no Backlog": number;
    }>;
  }>;
}

// Interface para análise de épicos
export interface EpicAnalysis {
  epicos_por_departamento: Record<string, number>;
  epicos_sem_departamento: string[];
  departamentos_sem_epicos: string[];
}

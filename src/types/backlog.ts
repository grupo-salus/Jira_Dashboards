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

// Interface principal para resumo do backlog
export interface BacklogSummary {
  total_geral_cards: number;
  total_projetos: number;
  total_cards_sem_projeto: number;
  projetos: Project[];
  departamentos: Record<string, DepartmentSummary>;
  analise_epicos: EpicAnalysis;
  tempo_medio: number;
  mais_antigo: {
    chave: string;
    titulo: string;
    dias_no_backlog: number;
  };
  fila_de_espera: Array<{
    Chave: string;
    Título: string;
    dias: number;
  }>;
  cards_por_departamento: Record<string, number>;
  por_solicitante: Record<string, number>;
  por_prioridade: Record<string, number>;
  por_status: Record<string, number>;
  tempo_medio_por_departamento: Record<string, number>;
  por_mes_criacao: Array<{
    mes: string;
    total: number;
  }>;
  acima_de_15_dias: number;
  sem_prioridade_calculada: number;
}

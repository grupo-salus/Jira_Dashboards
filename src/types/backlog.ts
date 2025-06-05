export interface BacklogItem {
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

  // Derived fields (calculated)
  timeInQueue?: string;
  progressPercentage?: number;
  estimatedCompletion?: string;
}

export type PriorityType = string;
export type GroupType = string;
export type DepartmentType = string;

export interface TimeMetric {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface ProjectCard {
  Chave: string;
  Título: string;
  Solicitante: string;
  "Unidade / Departamento": string;
  "Dias no Backlog": number;
  Prioridade: string;
}

export interface Project {
  epico: string;
  total_cards: number;
  prioridade_distribuicao: Record<string, number>;
  media_dias_backlog: number;
  mais_antigo: string;
  estimativa_total_horas: number;
  cards: ProjectCard[];
}

export interface DepartmentProject {
  epico: string;
  total_cards: number;
  cards: Array<{
    Chave: string;
    Título: string;
    "Dias no Backlog": number;
  }>;
}

export interface DepartmentInfo {
  total_projetos: number;
  projetos: DepartmentProject[];
}

export interface BacklogProjectsSummary {
  total_geral_cards: number;
  total_projetos: number;
  projetos: Project[];
  por_departamento: Record<string, DepartmentInfo>;
}

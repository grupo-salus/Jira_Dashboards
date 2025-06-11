/**
 * backlog.ts
 *
 * Este arquivo define os tipos do sistema, organizados em duas categorias principais:
 * 1. Tipos da API: Representam os dados que vêm diretamente do backend
 * 2. Tipos de Métricas: Representam os dados processados para visualização
 */

/**
 * Tipos e interfaces para o sistema de Backlog
 * Este arquivo é a fonte única de verdade para todas as definições de tipos relacionados ao backlog
 */

// ==================== Tipos Base ====================

/**
 * Tipos básicos para categorização
 */
export type PriorityType = string;
export type GroupType = string;
export type DepartmentType = string;

// ==================== Tipos da API ====================

/**
 * Interface base para cards do Jira
 * Representa os dados brutos que vêm da API
 */
export interface JiraCard {
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
  Sprint: string | null;
  "Responsável (Dev)": string;
  "Estimativa Original (segundos)": number;
  "Controle de Tempo (segundos)": number;
  Prioridade: string;
  Branch: string | null;
  "Backlog (nome)": string | null;
  Versão: string | null;
  Descrição: string;
  Projeto: string | null;
  "versões afetadas": string | null;
  "versões corrigidas": string | null;
  "Dias no Backlog": number;
}

/**
 * Resposta da API de backlog
 */
export interface BacklogResponse {
  tabela_backlog: JiraCard[];
}

// ==================== Tipos de Métricas ====================

/**
 * Interface para métricas de tempo
 */
export interface TimeMetric {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Interface para saúde do backlog
 */
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

/**
 * Interface para métricas básicas
 */
export interface BasicMetrics {
  total_cards: number;
  total_projetos: number;
  primeiro_projeto: {
    projeto: string;
    departamento: string;
    prioridade: string;
    chave: string;
  } | null;
}

/**
 * Interface para distribuição de prioridade
 */
export interface PriorityDistribution {
  [key: string]: number;
}

/**
 * Interface para distribuição de prioridade por projeto
 */
export interface PriorityDistributionByProject {
  [project: string]: PriorityDistribution;
}

/**
 * Interface para carga de trabalho por departamento
 */
export interface WorkloadByDepartment {
  total_cards: Record<string, number>;
  horas_estimadas: Record<string, number>;
}

/**
 * Interface para relação entre departamento e prioridade
 */
export interface DepartmentPriorityRelation {
  [department: string]: PriorityDistribution;
}

// ==================== Tipos de Visualização ====================

/**
 * Interface para card resumido
 * Usada em visualizações compactas
 */
export interface CardSummary {
  chave: string;
  titulo: string;
  prioridade: string;
  projeto: string | null;
  area: string;
}

/**
 * Interface para item de fila
 */
export interface QueueItem {
  chave: string;
  titulo: string;
  prioridade: string;
  projeto: string | null;
  area: string;
}

/**
 * Interface para resumo do backlog
 */
export interface BacklogSummary {
  // Métricas principais
  total_cards: number;
  total_projetos_unicos: number;
  total_cards_sem_projeto: number;

  // Primeiros cards na fila
  primeiro_card_na_fila: CardSummary | null;
  primeiro_projeto_na_fila: CardSummary | null;

  // Distribuições e análises
  distribuicao_prioridade_por_projeto: PriorityDistributionByProject;
  saude_do_backlog: BacklogHealth;
  distribuicao_por_status: Record<string, number>;
  carga_de_trabalho_por_departamento: WorkloadByDepartment;
  distribuicao_geral_de_prioridade: PriorityDistribution;
  relacao_departamento_vs_prioridade: DepartmentPriorityRelation;

  // Detalhes das filas
  detalhes_cards_com_projeto: CardSummary[];
  resumo_geral_cards: CardSummary[];
}

// ==================== Exports para compatibilidade ====================

// Exportando tipos principais para manter compatibilidade
export type BacklogItem = JiraCard;

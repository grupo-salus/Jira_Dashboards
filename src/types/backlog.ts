/**
 * backlog.ts
 *
 * Este arquivo é a fonte única de verdade para todas as definições de tipos relacionados ao backlog.
 * Ele organiza os tipos em namespaces para melhor organização e manutenção:
 *
 * Namespaces:
 * - Card: Interfaces para cards do Jira (Base, Backlog, Project, Summary, Queue)
 * - Metrics: Interfaces para métricas (Basic, BacklogHealth, WorkloadByDepartment, etc.)
 * - Project: Interfaces para projetos e suas relações
 * - Department: Interfaces para departamentos e suas relações
 * - Analysis: Interfaces para análises de dados
 * - Response: Interfaces para respostas da API
 * - Summary: Interfaces para resumos e dashboards
 *
 * O arquivo também exporta tipos principais para manter compatibilidade com código existente.
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

// ==================== Namespace: Card ====================

/**
 * Namespace para todas as interfaces relacionadas a cards
 */
export namespace Card {
  /**
   * Interface base para cards do Jira
   * Contém todos os campos comuns a qualquer card
   */
  export interface Base {
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

  /**
   * Interface para cards do backlog
   * Estende a interface base com campos específicos do backlog
   */
  export interface Backlog
    extends Omit<Base, "Sprint" | "Branch" | "Backlog (nome)" | "Versão"> {
    Projeto: string | null;
    Sprint: string | null;
    Branch: string | null;
    "versões afetadas": string | null;
    "versões corrigidas": string | null;
    "Backlog (nome)": string | null;
    "Dias no Backlog": number;
  }

  /**
   * Interface para cards em projetos
   * Versão simplificada para visualização em listas de projeto
   */
  export interface Project {
    Chave: string;
    Título: string;
    Solicitante: string;
    "Unidade / Departamento": string;
    "Dias no Backlog": number;
    Prioridade: string;
  }

  /**
   * Interface para card resumido
   * Usada em visualizações compactas e dashboards
   */
  export interface Summary {
    Chave: string;
    Título: string;
    Prioridade: string;
    Projeto: string;
    "Unidade / Departamento": string;
  }

  /**
   * Interface para itens da fila
   * Usada para visualização em listas e filas
   */
  export interface Queue {
    chave: string;
    titulo: string;
    prioridade: string;
    projeto: string | null;
    area: string;
  }
}

// ==================== Namespace: Metrics ====================

/**
 * Namespace para todas as interfaces relacionadas a métricas
 */
export namespace Metrics {
  /**
   * Interface base para métricas de tempo
   * Usada para representar durações em diferentes unidades
   */
  export interface TimeMetric {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }

  /**
   * Interface para saúde do backlog
   * Contém métricas sobre a idade e distribuição dos cards
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
    [department: string]: {
      [priority: string]: number;
    };
  }

  /**
   * Interface para distribuição de prioridade por projeto
   */
  export interface PriorityDistributionByProject {
    [project: string]: {
      [priority: string]: number;
    };
  }

  /**
   * Interface para métricas básicas do backlog
   */
  export interface Basic {
    total_cards: number;
    total_projetos: number;
    primeiro_projeto: {
      projeto: string;
      departamento: string;
      prioridade: string;
      chave: string;
    } | null;
  }
}

// ==================== Namespace: Project ====================

/**
 * Namespace para todas as interfaces relacionadas a projetos
 */
export namespace Project {
  /**
   * Interface para projetos
   */
  export interface Info {
    projeto: string;
    total_cards: number;
    prioridade_distribuicao: Record<string, number>;
    media_dias_backlog: number;
    mais_antigo: string;
    estimativa_total_horas: number;
    cards: Card.Project[];
  }

  /**
   * Interface para projetos por departamento
   */
  export interface Department {
    projeto: string;
    total_cards: number;
    cards: Array<{
      Chave: string;
      Título: string;
      "Dias no Backlog": number;
    }>;
  }
}

// ==================== Namespace: Department ====================

/**
 * Namespace para todas as interfaces relacionadas a departamentos
 */
export namespace Department {
  /**
   * Interface para informações de departamento
   */
  export interface Info {
    total_projetos: number;
    projetos: Project.Department[];
  }

  /**
   * Interface para resumo de departamento
   */
  export interface Summary {
    total_projetos: number;
    total_cards: number;
    projetos: Array<{
      projeto: string;
      total_cards: number;
      cards: Array<{
        Chave: string;
        Título: string;
        "Dias no Backlog": number;
      }>;
    }>;
  }
}

// ==================== Namespace: Analysis ====================

/**
 * Namespace para todas as interfaces relacionadas a análises
 */
export namespace Analysis {
  /**
   * Interface para análise de projetos
   */
  export interface Project {
    projetos_por_departamento: Record<string, number>;
    projetos_sem_departamento: string[];
    departamentos_sem_projetos: string[];
  }
}

// ==================== Namespace: Response ====================

/**
 * Namespace para todas as interfaces relacionadas a respostas da API
 */
export namespace Response {
  /**
   * Interface para resposta da API de backlog
   */
  export interface Backlog {
    tabela_backlog: Card.Backlog[];
  }

  /**
   * Interface para resposta de itens
   */
  export interface Items {
    items: Card.Backlog[];
  }
}

// ==================== Namespace: Summary ====================

/**
 * Namespace para todas as interfaces relacionadas a resumos
 */
export namespace Summary {
  /**
   * Interface principal para resumo do backlog por projetos
   */
  export interface Backlog {
    // Métricas principais
    total_cards: number;
    total_projetos_unicos: number;
    total_cards_sem_projeto: number;

    // Primeiros cards na fila
    primeiro_card_na_fila: Card.Summary | null;
    primeiro_projeto_na_fila: Card.Summary | null;

    // Distribuições e análises
    distribuicao_prioridade_por_projeto: Metrics.PriorityDistributionByProject;
    saude_do_backlog: Metrics.BacklogHealth;
    distribuicao_por_status: Record<string, number>;
    carga_de_trabalho_por_departamento: Metrics.WorkloadByDepartment;
    distribuicao_geral_de_prioridade: Record<string, number>;
    relacao_departamento_vs_prioridade: Metrics.DepartmentPriorityRelation;

    // Detalhes das filas
    detalhes_cards_com_projeto: Card.Summary[];
    resumo_geral_cards: Card.Summary[];
  }
}

// ==================== Exports para compatibilidade ====================

// Exportando interfaces principais para manter compatibilidade com código existente
export type BacklogItem = Card.Backlog;
export type BacklogResponse = Response.Backlog;
export type BacklogSummary = Summary.Backlog;
export type BacklogHealth = Metrics.BacklogHealth;
export type BacklogBasicMetrics = Metrics.Basic;
export type ItemsResponse = Response.Items;
export type ProjectCard = Card.Project;
export type CardSummary = Card.Summary;
export type BaseJiraCard = Card.Base;

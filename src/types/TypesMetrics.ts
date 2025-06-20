import { JiraStatus } from "./Typesjira";

/**
 * Interface para as métricas de visão geral (Top Cards Resumo)
 */
export interface VisaoGeralMetrics {
  concluidos: number;
  atualizados7d: number;
  criados7d: number;
  entregar24h: number;
}

/**
 * Interface para as métricas de status (Pizza/Rosca)
 */
export interface StatusMetrics {
  pendentes: number;
  emAndamento: number;
  bloqueados: number;
  concluidos: number;
  total: number;
}

/**
 * Interface para as métricas de prioridade (Radar/Bar)
 */
export interface PrioridadeMetrics {
  baixa: number;
  media: number;
  alta: number;
  critica: number;
}

/**
 * Interface para os filtros aplicáveis
 */
export interface AcompanhamentoTIFilters {
  responsavel?: string;
  periodo_dias?: number;
  prioridade?: string;
}

/**
 * Interface para atividade recente
 */
export interface AtividadeRecente {
  responsavel: string;
  chave: string;
  titulo: string;
  atualizadoEm: string;
  tempoAtras: string; // "há X minutos/horas/dias"
}

/**
 * Interface para card do Kanban
 */
export interface KanbanCard {
  titulo: string;
  chave: string;
  status: JiraStatus;
  diasNoBacklog: number;
  tempoGasto: string;
  dataInicio: string | null;
  dataPrevistaTermino: string | null;
  dataLimite: string | null;
  prioridade: string;
  responsavel: string;
  time: string;
  categoria: string;
}

/**
 * Interface completa com todas as métricas do dashboard
 */
export interface AcompanhamentoTIMetrics {
  visaoGeral: VisaoGeralMetrics;
  status: StatusMetrics;
  prioridade: PrioridadeMetrics;
  atividadesRecentes: AtividadeRecente[];
  kanbanCards: KanbanCard[];
}

import { AcompanhamentoTI } from "../types/Typesjira";
import {
  VisaoGeralMetrics,
  StatusMetrics,
  PrioridadeMetrics,
  AcompanhamentoTIFilters,
  KanbanCard,
  AcompanhamentoTIMetrics,
} from "../types/TypesMetrics";

/**
 * Função para calcular métricas de visão geral
 */
export function calcularVisaoGeral(
  dados: AcompanhamentoTI[],
  filtros: AcompanhamentoTIFilters
): VisaoGeralMetrics {
  const hoje = new Date();
  const seteDiasAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
  const amanha = new Date(hoje.getTime() + 24 * 60 * 60 * 1000);

  // Filtrar dados com base nos filtros
  let dadosFiltrados = [...dados];
  if (filtros.responsavel) {
    dadosFiltrados = dadosFiltrados.filter(
      (d) => d.Responsável === filtros.responsavel
    );
  }
  if (filtros.prioridade) {
    dadosFiltrados = dadosFiltrados.filter(
      (d) => d.Prioridade === filtros.prioridade
    );
  }
  if (filtros.periodo_dias) {
    const dataLimite = new Date(
      hoje.getTime() - filtros.periodo_dias * 24 * 60 * 60 * 1000
    );
    dadosFiltrados = dadosFiltrados.filter(
      (d) => new Date(d["Criado em"]) >= dataLimite
    );
  }

  return {
    concluidos: dadosFiltrados.filter((d) => d.Status === "Concluído").length,
    atualizados7d: dadosFiltrados.filter(
      (d) => new Date(d["Atualizado em"]) >= seteDiasAtras
    ).length,
    criados7d: dadosFiltrados.filter(
      (d) => new Date(d["Criado em"]) >= seteDiasAtras
    ).length,
    entregar24h: dadosFiltrados.filter(
      (d) =>
        d["Data Prevista de Término"] &&
        new Date(d["Data Prevista de Término"]) <= amanha &&
        d.Status !== "Concluído"
    ).length,
  };
}

/**
 * Função para calcular métricas de status
 */
export function calcularStatusMetrics(
  dados: AcompanhamentoTI[]
): StatusMetrics {
  const statusCounts = {
    pendentes: dados.filter((d) => d.Status === "Backlog").length,
    emAndamento: dados.filter((d) => d.Status === "Em Desenvolvimento").length,
    bloqueados: dados.filter((d) => d.Status === "Bloqueado").length,
    concluidos: dados.filter((d) => d.Status === "Concluído").length,
    total: dados.length,
  };

  return statusCounts;
}

/**
 * Função para calcular métricas de prioridade
 */
export function calcularPrioridadeMetrics(
  dados: AcompanhamentoTI[]
): PrioridadeMetrics {
  return {
    baixa: dados.filter((d) => d.Prioridade === "Baixa").length,
    media: dados.filter((d) => d.Prioridade === "Média").length,
    alta: dados.filter((d) => d.Prioridade === "Alta").length,
    critica: dados.filter((d) => d.Prioridade === "Estratégica").length,
  };
}

/**
 * Função para formatar tempo relativo
 */
export function formatarTempoRelativo(data: string): string {
  const agora = new Date();
  const dataAtualizacao = new Date(data);
  const diffMs = agora.getTime() - dataAtualizacao.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHrs = Math.floor(diffMin / 60);
  const diffDias = Math.floor(diffHrs / 24);

  if (diffDias > 0) return `há ${diffDias} dias`;
  if (diffHrs > 0) return `há ${diffHrs} horas`;
  return `há ${diffMin} minutos`;
}

/**
 * Função para converter dados em cards do Kanban
 */
export function converterParaKanbanCards(
  dados: AcompanhamentoTI[]
): KanbanCard[] {
  return dados.map((d) => ({
    titulo: d.Título,
    chave: d.Chave,
    status: d.Status,
    diasNoBacklog: d["Dias no Backlog"],
    tempoGasto: d["Controle de tempo"] || "0h",
    dataInicio: d["Data de Início"],
    dataPrevistaTermino: d["Data Prevista de Término"],
    dataLimite: d["Data Limite"],
    prioridade: d.Prioridade,
    responsavel: d.Responsável,
    time: d.Time,
    squad: d.Squad,
  }));
}

/**
 * Função para calcular todas as métricas do dashboard
 */
export function calcularTodasMetricas(
  dados: AcompanhamentoTI[],
  filtros: AcompanhamentoTIFilters
): AcompanhamentoTIMetrics {
  // Ordenar atividades recentes por data de atualização
  const atividadesRecentes = dados
    .sort(
      (a, b) =>
        new Date(b["Atualizado em"]).getTime() -
        new Date(a["Atualizado em"]).getTime()
    )
    .slice(0, 5)
    .map((d) => ({
      responsavel: d.Responsável,
      chave: d.Chave,
      titulo: d.Título,
      atualizadoEm: d["Atualizado em"],
      tempoAtras: formatarTempoRelativo(d["Atualizado em"]),
    }));

  return {
    visaoGeral: calcularVisaoGeral(dados, filtros),
    status: calcularStatusMetrics(dados),
    prioridade: calcularPrioridadeMetrics(dados),
    atividadesRecentes,
    kanbanCards: converterParaKanbanCards(dados),
  };
}

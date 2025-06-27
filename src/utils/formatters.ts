import { getPriorityConfig } from "./themeColors";

/**
 * Formata uma data ISO para o formato brasileiro
 * @param dateString Data no formato ISO (ex: 2024-07-12T10:01:39)
 * @returns Data formatada (ex: 12/07/2024 10:01)
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formata segundos em um formato legível (horas, minutos, segundos)
 * @param seconds Número de segundos
 * @returns String formatada (ex: 2h 30m 15s)
 */
export const formatSeconds = (seconds: number): string => {
  if (!seconds) return "-";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0)
    parts.push(`${remainingSeconds}s`);

  return parts.join(" ");
};

/**
 * Calcula a diferença entre estimativa e tempo real
 * @param estimativa Tempo estimado em segundos
 * @param tempoReal Tempo real em segundos
 * @returns Objeto com a diferença e status
 */
export const calcularDiferencaTempo = (
  estimativa: number,
  tempoReal: number
) => {
  if (!estimativa || !tempoReal) return { diferenca: 0, status: "neutral" };

  const diferenca = tempoReal - estimativa;
  const percentual = (diferenca / estimativa) * 100;

  let status: "under" | "over" | "neutral" = "neutral";
  if (percentual > 10) status = "over";
  else if (percentual < -10) status = "under";

  return {
    diferenca,
    percentual,
    status,
    formatado: formatSeconds(Math.abs(diferenca)),
  };
};

/**
 * Formata a prioridade para exibição
 * @param priority Prioridade do Jira (ex: Estratégica, Alta, Média, etc)
 * @returns Prioridade formatada
 */
export const formatPriority = (priority: string) => {
  return getPriorityConfig(priority) || getPriorityConfig("Média");
};

/**
 * Formata um número como moeda brasileira (Real)
 * @param value O número a ser formatado
 * @param compact Se deve usar o formato compacto (ex: 1.5k, 2M)
 * @returns String formatada como moeda (ex: R$ 1.500,00 ou R$ 1,5k)
 */
export const formatCurrency = (value: number, compact = false): string => {
  if (isNaN(value)) return "R$ 0,00";

  if (compact) {
    if (Math.abs(value) >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1).replace(".", ",")}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `R$ ${(value / 1000).toFixed(1).replace(".", ",")}k`;
    }
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

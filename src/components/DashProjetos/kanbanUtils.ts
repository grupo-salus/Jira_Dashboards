import {
  JiraStatus,
  PrazoStatus,
  EsforcoStatus,
  IdeacaoStatus,
} from "../../types/Typesjira";

// ============================================================================
// CONSTANTES
// ============================================================================

// Mapeamento de status para nomes das colunas
export const STATUS_COLUMNS: Record<JiraStatus, string> = {
  Backlog: "IDEAÇÃO",
  Bloqueado: "BLOQUEADO",
  "Backlog Priorizado": "BACKLOG PRIORIZADO",
  "Em andamento": "EM EXECUÇÃO",
  "Em Homologação": "EM HOMOLOGAÇÃO",
  "OPERAÇÃO ASSISTIDA": "OPERAÇÃO ASSISTIDA",
  Concluído: "ENTREGUE",
  Cancelado: "CANCELADO",
} as const;

// Ordem fixa das colunas do Kanban
export const COLUMN_ORDER: JiraStatus[] = [
  "Backlog",
  "Backlog Priorizado",
  "Em andamento",
  "Em Homologação",
  "OPERAÇÃO ASSISTIDA",
  "Concluído",
  "Cancelado",
  "Bloqueado",
];

// Mapeamento de status para nomes das colunas (normalização)
export const STATUS_MAP: Record<string, keyof typeof STATUS_COLUMNS> = {
  backlog: "Backlog",
  "backlog priorizado": "Backlog Priorizado",
  "tarefas pendentes": "Backlog Priorizado",
  bloqueado: "Bloqueado",
  "em andamento": "Em andamento",
  "em homologação": "Em Homologação",
  "operação assistida": "OPERAÇÃO ASSISTIDA",
  concluído: "Concluído",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Formata segundos em dias e horas
 */
export const formatarSegundos = (seg: number | null): string => {
  if (!seg) return "0d";
  const d = Math.floor(seg / 28800); // 1 dia = 8h
  const h = Math.floor((seg % 28800) / 3600);
  const m = Math.floor((seg % 3600) / 60);
  return `${d}d ${h}h${m > 0 ? ` ${m}m` : ""}`.trim();
};

/**
 * Formata data para o formato brasileiro
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Não definida";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  } catch {
    return "Data inválida";
  }
};

/**
 * Obtém a cor CSS para um status de prazo ou esforço
 */
export const getStatusColor = (
  status: PrazoStatus | EsforcoStatus | IdeacaoStatus
): string => {
  const statusColors: Record<
    PrazoStatus | EsforcoStatus | IdeacaoStatus,
    string
  > = {
    // Prazo
    "No prazo":
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Fora do prazo":
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",

    // Esforço
    "Dentro do estimado":
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Próximo do limite":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    "Estourou a estimativa":
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",

    // Ideação
    Recente:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Rever: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "Quase obsoleto":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Obsoleto: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    statusColors[status] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  );
};

/**
 * Normaliza status removendo acentos e encontrando correspondência
 */
export const normalizarStatus = (status: string): string => {
  if (!status) return "Backlog";
  const s = status.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const match = COLUMN_ORDER.find(
    (col) => col.toLowerCase() === s.toLowerCase()
  );
  return match || status;
};

/**
 * Capitaliza a primeira letra de uma string
 */
export const capitalizeFirst = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Verifica se um projeto está em execução
 */
export const isProjetoEmExecucao = (status: JiraStatus): boolean => {
  return (
    status === "Em andamento" ||
    status === "Em Homologação" ||
    status === "OPERAÇÃO ASSISTIDA"
  );
};

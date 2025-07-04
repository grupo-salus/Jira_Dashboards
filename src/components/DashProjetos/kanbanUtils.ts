import { JiraStatus, PrazoStatus, IdeacaoStatus } from "../../types/Typesjira";
import { themeColors } from "../../utils/themeColors";

// ============================================================================
// CONSTANTES
// ============================================================================

// Mapeamento de status para nomes das colunas
export const STATUS_COLUMNS: Record<JiraStatus, string> = {
  Backlog: "Ideação",
  Bloqueado: "Bloqueado",
  "Backlog Priorizado": "Backlog Priorizado",
  "Em Andamento": "Em Desenvolvimento",
  "Em Homologação": "Em Homologação",
  "Operação Assistida": "Operação Assistida",
  Concluído: "Entregue",
  Cancelado: "Cancelado",
} as const;

// Ordem fixa das colunas do Kanban
export const COLUMN_ORDER: JiraStatus[] = [
  "Backlog",
  "Backlog Priorizado",
  "Em Andamento",
  "Em Homologação",
  "Operação Assistida",
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
  "em andamento": "Em Andamento",
  "em homologação": "Em Homologação",
  "operação assistida": "Operação Assistida",
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
 * Obtém a cor CSS para um status de prazo ou ideação
 */
export const getStatusColor = (status: PrazoStatus | IdeacaoStatus): string => {
  // Mapeamento dos status de ideação para classes CSS
  const ideacaoColors: Record<IdeacaoStatus, string> = {
    Recente:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Rever: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "Quase obsoleto":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Obsoleto: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  // Se for status de ideação, retorna as classes CSS completas
  if (status in ideacaoColors) {
    return ideacaoColors[status as IdeacaoStatus];
  }

  // Para status de prazo, retorna a classe de texto apropriada
  if (status === "Em risco") {
    return "text-black"; // Texto preto para "Em risco" (fundo amarelo)
  }
  
  return "text-white"; // Texto branco para outros status de prazo
};

/**
 * Obtém a cor de fundo para um status de prazo
 */
export const getPrazoBackgroundColor = (
  status: PrazoStatus,
  theme: "light" | "dark"
): string => {
  const prazoColors = {
    "No prazo": themeColors.status.prazo.noPrazo.bg[theme],
    "Em risco": themeColors.status.prazo.emRisco.bg[theme],
    Atrasado: themeColors.status.prazo.foraPrazo.bg[theme],
  };

  return prazoColors[status];
};

/**
 * Normaliza um status para primeira letra maiúscula
 */
export const normalizarStatusDisplay = (status: string): string => {
  if (!status) return status;
  // Dividir por espaços e capitalizar cada palavra
  return status
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
 * Verifica se um projeto está em desenvolvimento
 */
export const isProjetoEmExecucao = (status: JiraStatus): boolean => {
  return (
    status === "Em Andamento" ||
    status === "Em Homologação" ||
    status === "Operação Assistida"
  );
};

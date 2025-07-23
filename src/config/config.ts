/**
 * Configurações globais do projeto
 */

// Configurações de sincronização de dados
export const DATA_SYNC_CONFIG = {
  // Intervalo de auto-refresh em milissegundos (1 hora = 3600000ms)
  AUTO_REFRESH_INTERVAL: 3600000,

  // Delay para mostrar estado de loading (1 segundo = 1000ms)
  REFRESH_LOADING_DELAY: 1000,

  // Intervalo para atualizar o timestamp "Agora mesmo" (1 minuto = 60000ms)
  TIMESTAMP_UPDATE_INTERVAL: 60000,
} as const;

// Configurações de API
export const API_CONFIG = {
  // Timeout para requisições (30 segundos = 30000ms)
  REQUEST_TIMEOUT: 30000,

  // Número máximo de tentativas de retry
  MAX_RETRY_ATTEMPTS: 3,

  // Delay entre tentativas de retry (2 segundos = 2000ms)
  RETRY_DELAY: 2000,
} as const;

// Configurações de UI
export const UI_CONFIG = {
  // Altura fixa dos containers com scroll
  SCROLL_CONTAINER_HEIGHT: {
    MOBILE: "h-80", // 320px
    DESKTOP: "h-[400px]", // 400px
  },

  // Largura mínima dos cards
  CARD_MIN_WIDTH: {
    PROJETO: "min-w-[250px]",
    RESPONSAVEL: "min-w-[280px]",
  },

  // Largura máxima dos cards
  CARD_MAX_WIDTH: {
    PROJETO: "max-w-[280px]",
    RESPONSAVEL: "max-w-[320px]",
  },
} as const;

// Configurações de paginação
export const PAGINATION_CONFIG = {
  // Itens por página padrão
  DEFAULT_ITEMS_PER_PAGE: 20,

  // Opções de itens por página
  ITEMS_PER_PAGE_OPTIONS: [10, 20, 50, 100],
} as const;

// Configurações de cache
export const CACHE_CONFIG = {
  // Tempo de vida do cache em milissegundos (5 minutos = 300000ms)
  CACHE_TTL: 300000,

  // Chave prefix para cache
  CACHE_KEY_PREFIX: "jira_dashboard_",
} as const;

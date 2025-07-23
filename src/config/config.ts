/**
 * Configurações globais do projeto
 */

// Configurações de cache
export const CACHE_CONFIG = {
  // Tempo de vida do cache em milissegundos (5 minutos = 300000ms)
  CACHE_TTL: 300000,

  // Chave prefix para cache
  CACHE_KEY_PREFIX: "jira_dashboard_",
} as const;

// Configurações de sincronização de dados
export const DATA_SYNC_CONFIG = {
  // Intervalo de atualização automática em milissegundos (5 minutos = 300000ms)
  AUTO_REFRESH_INTERVAL: 300000,

  // Delay para mostrar estado de loading durante refresh (1 segundo = 1000ms)
  REFRESH_LOADING_DELAY: 1000,

  // Intervalo de atualização do timestamp em milissegundos (1 minuto = 60000ms)
  TIMESTAMP_UPDATE_INTERVAL: 60000,
} as const;

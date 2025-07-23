import { useEffect } from "react";
import { useDataSync } from "../context/DataSyncContext";

interface UseAutoRefreshOptions {
  enabled?: boolean;
  interval?: number; // em milissegundos
}

/**
 * Hook para habilitar auto-refresh automaticamente em dashboards
 * Ideal para uso em TV ou quando você quer que os dados sejam atualizados automaticamente
 */
export const useAutoRefresh = (options: UseAutoRefreshOptions = {}) => {
  const { enabled = true } = options; // 1 hora por padrão
  const { enableAutoRefresh, isAutoRefreshEnabled } = useDataSync();

  useEffect(() => {
    if (enabled && !isAutoRefreshEnabled) {
      enableAutoRefresh(true);
    } else if (!enabled && isAutoRefreshEnabled) {
      enableAutoRefresh(false);
    }
  }, [enabled, isAutoRefreshEnabled, enableAutoRefresh]);

  return {
    isAutoRefreshEnabled,
    enableAutoRefresh,
  };
};

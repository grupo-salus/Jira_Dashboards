import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { cacheService } from "../services/cacheService";
import { Info, X } from "lucide-react";

/**
 * Componente de debug para mostrar informações sobre o cache
 * Só deve ser usado em desenvolvimento
 */
export const CacheDebug = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [cacheStats, setCacheStats] = useState<any>(null);

  useEffect(() => {
    const updateStats = () => {
      const stats = cacheService.getStats();
      setCacheStats(stats);
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  // Só mostra em desenvolvimento
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 p-2 rounded-lg shadow-lg z-50"
        style={{
          backgroundColor: theme.bg.surface,
          color: theme.text.subtitle,
          border: `1px solid ${theme.border.base}`,
        }}
        title="Cache Debug"
      >
        <Info size={16} />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 left-4 p-4 rounded-lg shadow-lg z-50 max-w-sm"
      style={{
        backgroundColor: theme.bg.surface,
        border: `1px solid ${theme.border.base}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium" style={{ color: theme.text.title }}>
          Cache Debug
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{ color: theme.text.subtitle }}
        >
          <X size={16} />
        </button>
      </div>

      {cacheStats ? (
        <div className="space-y-2 text-xs">
          <div style={{ color: theme.text.subtitle }}>
            <span className="font-medium">Itens:</span> {cacheStats.totalItems}
          </div>
          <div style={{ color: theme.text.subtitle }}>
            <span className="font-medium">Versão:</span> {cacheStats.version}
          </div>
          <div style={{ color: theme.text.subtitle }}>
            <span className="font-medium">Última limpeza:</span>{" "}
            {new Date(cacheStats.lastCleanup).toLocaleTimeString()}
          </div>
        </div>
      ) : (
        <div className="text-xs" style={{ color: theme.text.subtitle }}>
          Carregando estatísticas...
        </div>
      )}

      <div
        className="mt-3 pt-3 border-t"
        style={{ borderColor: theme.border.base }}
      >
        <button
          onClick={() => {
            cacheService.cleanupExpiredItems();
            const stats = cacheService.getStats();
            setCacheStats(stats);
          }}
          className="text-xs px-2 py-1 rounded"
          style={{
            backgroundColor: theme.bg.muted,
            color: theme.text.subtitle,
          }}
        >
          Limpar Expirados
        </button>
      </div>
    </div>
  );
};

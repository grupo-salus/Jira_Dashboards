import { useTheme } from "@/shared/context/ThemeContext";
import { useDataSync } from "@/shared/context/DataSyncContext";
import { Clock, RefreshCw } from "lucide-react";

export const LastUpdateInfo = () => {
  const { theme } = useTheme();
  const { lastRefresh, isAutoRefreshEnabled, enableAutoRefresh } = useDataSync();

  const formatLastUpdate = (date: Date | null) => {
    if (!date) return "Nunca";
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Agora mesmo";
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dias atrás`;
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-40 p-3 rounded-lg shadow-lg border backdrop-blur-sm"
      style={{
        backgroundColor: `${theme.bg.surface}CC`,
        borderColor: theme.border.base,
        color: theme.text.subtitle,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock size={14} />
        <span className="text-xs font-medium">Última atualização</span>
        <button
          onClick={() => enableAutoRefresh(!isAutoRefreshEnabled)}
          className="ml-2 p-1 rounded transition-colors hover:bg-opacity-50"
          style={{
            backgroundColor: isAutoRefreshEnabled ? theme.brand.primary : theme.bg.muted,
            color: isAutoRefreshEnabled ? theme.text.inverse : theme.text.subtitle,
          }}
          title={isAutoRefreshEnabled ? "Desabilitar auto-refresh" : "Habilitar auto-refresh (1h)"}
        >
          <RefreshCw size={12} className={isAutoRefreshEnabled ? "animate-spin" : ""} />
        </button>
      </div>
      
      <div className="text-xs space-y-1">
        <div className="font-semibold" style={{ color: theme.text.title }}>
          {formatLastUpdate(lastRefresh)}
        </div>
        {lastRefresh && (
          <div className="text-xs opacity-75">
            {formatDate(lastRefresh)} às {formatTime(lastRefresh)}
          </div>
        )}
        {isAutoRefreshEnabled && (
          <div className="text-xs opacity-75 flex items-center gap-1">
            <RefreshCw size={10} />
            Auto-refresh ativo (1h)
          </div>
        )}
      </div>
    </div>
  );
}; 
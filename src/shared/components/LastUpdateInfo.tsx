import { useTheme } from "@/shared/context/ThemeContext";
import { useDataSync } from "@/shared/context/DataSyncContext";
import { Clock, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export const LastUpdateInfo = () => {
  const { theme } = useTheme();
  const { lastRefresh, isAutoRefreshEnabled, enableAutoRefresh } =
    useDataSync();
  const [now, setNow] = useState(new Date());

  // Atualiza o estado 'now' a cada minuto para forçar re-render
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // 1 minuto
    return () => clearInterval(interval);
  }, []);

  const formatLastUpdate = (date: Date | null) => {
    if (!date) return "Nunca";

    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Agora mesmo";
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dias atrás`;
  };

  return (
    <div
      className="flex justify-center items-center gap-1 py-1 px-3 rounded-md shadow-sm border mx-auto w-fit"
      style={{
        backgroundColor: `${theme.bg.surface}80`,
        borderColor: theme.border.base,
        color: theme.text.subtitle,
      }}
    >
      <Clock size={12} />
      <span className="text-xs opacity-75">
        {formatLastUpdate(lastRefresh)}
      </span>
      <button
        onClick={() => enableAutoRefresh(!isAutoRefreshEnabled)}
        className="p-0.5 rounded transition-colors hover:bg-opacity-50"
        style={{
          backgroundColor: isAutoRefreshEnabled
            ? theme.brand.primary
            : "transparent",
          color: isAutoRefreshEnabled
            ? theme.text.inverse
            : theme.text.subtitle,
        }}
        title={
          isAutoRefreshEnabled
            ? "Desabilitar auto-refresh"
            : "Habilitar auto-refresh (1h)"
        }
      >
        <RefreshCw
          size={10}
          className={isAutoRefreshEnabled ? "animate-spin" : ""}
        />
      </button>
    </div>
  );
};

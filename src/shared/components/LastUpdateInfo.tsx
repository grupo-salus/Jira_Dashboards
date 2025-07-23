import { useTheme } from "@/shared/context/ThemeContext";
import { useDataSync } from "@/shared/context/DataSyncContext";
import { Clock, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { DATA_SYNC_CONFIG } from "../../config";

export const LastUpdateInfo = () => {
  const { theme } = useTheme();
  const { lastRefresh, refreshAllData } = useDataSync();
  const [now, setNow] = useState(new Date());

  // Atualiza o estado 'now' usando configuração
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, DATA_SYNC_CONFIG.TIMESTAMP_UPDATE_INTERVAL);
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
        onClick={refreshAllData}
        className="p-0.5 rounded transition-colors hover:bg-opacity-50"
        style={{
          backgroundColor: theme.brand.primary,
          color: theme.text.inverse,
        }}
        title="Atualizar agora"
      >
        <RefreshCw size={10} className="animate-spin" />
      </button>
    </div>
  );
};

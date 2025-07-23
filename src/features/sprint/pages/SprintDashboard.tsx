import { useTheme } from "@/shared/context/ThemeContext";
import { LastUpdateInfo } from "@/shared/components/LastUpdateInfo";
import { useAutoRefresh } from "@/shared/hooks/useAutoRefresh";
import { Construction, AlertTriangle } from "lucide-react";

export const SprintDashboard = () => {
  const { theme } = useTheme();

  // Auto-refresh habilitado automaticamente para dashboards
  useAutoRefresh({ enabled: true });

  return (
    <div
      className="min-h-screen p-6 space-y-8"
      style={{ backgroundColor: theme.bg.base }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: theme.text.title }}>
          Dashboard de Sprints
        </h1>
        <p className="text-lg" style={{ color: theme.text.subtitle }}>
          Acompanhamento e monitoramento de sprints
        </p>
      </div>

      {/* Informação da última atualização */}
      <LastUpdateInfo />

      {/* Placeholder - Em desenvolvimento */}
      <div
        className="flex flex-col items-center justify-center py-16 px-6 rounded-lg border-2 border-dashed"
        style={{
          backgroundColor: theme.bg.surface,
          borderColor: theme.border.base,
        }}
      >
        <Construction
          size={64}
          style={{ color: theme.text.subtitle }}
          className="mb-4"
        />
        <h2
          className="text-xl font-semibold mb-2"
          style={{ color: theme.text.title }}
        >
          Dashboard de Sprints em Desenvolvimento
        </h2>
        <p
          className="text-center max-w-md"
          style={{ color: theme.text.subtitle }}
        >
          O dashboard de sprints está sendo desenvolvido. Em breve estará
          disponível com dados em tempo real.
        </p>

        <div
          className="mt-6 p-4 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: theme.bg.muted }}
        >
          <AlertTriangle size={20} style={{ color: theme.text.subtitle }} />
          <span className="text-sm" style={{ color: theme.text.subtitle }}>
            Funcionalidade em construção
          </span>
        </div>
      </div>
    </div>
  );
};

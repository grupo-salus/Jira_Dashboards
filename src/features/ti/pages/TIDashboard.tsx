import { useTheme } from "@/shared/context/ThemeContext";
import { TITable } from "@/features/ti/components/TITable";
import { useTI } from "@/features/ti/hooks/useTI";
import { LastUpdateInfo } from "@/shared/components/LastUpdateInfo";
import { useAutoRefresh } from "@/shared/hooks/useAutoRefresh";
import { ErrorScreen } from "@/shared/components/ErrorScreen";
import { SUPPORT_CONFIG } from "@/shared/constants/support";

export const TIDashboard = () => {
  const { theme } = useTheme();
  const { data: tiData, loading, error, errorCode, refetch } = useTI();

  // Auto-refresh habilitado automaticamente para dashboards
  useAutoRefresh({ enabled: true });

  // Estados de loading e erro
  if (loading) {
    return (
      <div
        className="min-h-screen p-6 flex items-center justify-center"
        style={{ backgroundColor: theme.bg.base }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.brand.primary }}
          ></div>
          <p style={{ color: theme.text.base }}>Carregando dados de TI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorScreen
        error={error}
        errorCode={errorCode}
        onRetry={refetch}
        onContactSupport={() => {
          window.open(SUPPORT_CONFIG.website, "_blank");
        }}
      />
    );
  }

  if (!tiData) {
    return (
      <div
        className="min-h-screen p-6 flex items-center justify-center"
        style={{ backgroundColor: theme.bg.base }}
      >
        <div className="text-center">
          <p style={{ color: theme.text.base }}>Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 space-y-8"
      style={{ backgroundColor: theme.bg.base }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: theme.text.title }}>
          Dashboard de Acompanhamento TI
        </h1>
        <p className="text-lg" style={{ color: theme.text.subtitle }}>
          Monitoramento de issues e projetos de TI
        </p>
      </div>

      {/* Informação da última atualização */}
      <LastUpdateInfo />

      {/* Tabela de TI */}
      <section>
        <TITable data={tiData} />
      </section>
    </div>
  );
};

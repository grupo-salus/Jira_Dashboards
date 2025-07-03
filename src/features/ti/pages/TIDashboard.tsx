import { useTheme } from "@/shared/context/ThemeContext";
import { AlertCircle } from "lucide-react";
import { TITable } from "@/features/ti/components/TITable";
import { useTI } from "@/features/ti/hooks/useTI";
import { LastUpdateInfo } from "@/shared/components/LastUpdateInfo";
import { useAutoRefresh } from "@/shared/hooks/useAutoRefresh";

export const TIDashboard = () => {
  const { theme } = useTheme();
  const { data: tiData, loading, error, refetch } = useTI();
  
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
      <div
        className="min-h-screen p-6 flex items-center justify-center"
        style={{ backgroundColor: theme.bg.base }}
      >
        <div className="text-center max-w-md">
          <AlertCircle
            size={48}
            className="mx-auto mb-4"
            style={{ color: theme.text.base }}
          />
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: theme.text.title }}
          >
            Erro ao carregar dados
          </h2>
          <p className="mb-4" style={{ color: theme.text.base }}>
            {error}
          </p>
          <button
            onClick={refetch}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: theme.brand.primary,
              color: theme.text.inverse,
            }}
          >
            Tentar novamente
          </button>
        </div>
      </div>
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

      {/* Tabela de TI */}
      <section>
        <TITable data={tiData} />
      </section>

      {/* Informação da última atualização */}
      <LastUpdateInfo />
    </div>
  );
};

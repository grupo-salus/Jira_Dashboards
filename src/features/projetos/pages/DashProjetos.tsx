import { useState, useMemo, useEffect } from "react";
import { useTheme } from "@/shared/context/ThemeContext";
import { BarChart3, Kanban, Table, Eye, ChevronUp } from "lucide-react";
import { FilterPanel } from "@/features/projetos/components/Filters/FilterPanel";
import { TotalizadoresWrapper } from "@/features/projetos/components/Totalizadores/TotalizadoresWrapper";
import { ProjetosPorAreaChart } from "@/features/projetos/components/Charts/ProjetosPorAreaChart";
import { PrioridadeChart } from "@/features/projetos/components/Charts/PrioridadeChart";
import { KanbanWrapper } from "@/features/projetos/components/Kanban/KanbanWrapper";
import { ProjetosTable } from "@/features/projetos/components/Tabela/ProjetosTable";
import { ProximosProjetos } from "@/features/projetos/components/Proximos/ProximosProjetos";
import { useProjetos } from "@/features/projetos/hooks/useProjetos";
import { EspacoDeProjetos } from "@/types/Typesjira";
import { LastUpdateInfo } from "@/shared/components/LastUpdateInfo";
import { useAutoRefresh } from "@/shared/hooks/useAutoRefresh";
import { ErrorScreen } from "@/shared/components/ErrorScreen";
import { SUPPORT_CONFIG } from "@/shared/constants/support";

type ViewMode = "kanban" | "table";

export const DashProjetos = () => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Hook para buscar dados reais da API
  const { data: projetos, loading, error, errorCode, refetch } = useProjetos();

  // Auto-refresh habilitado automaticamente para dashboards
  useAutoRefresh({ enabled: true });

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Exemplo de cálculo de totalizadores a partir dos dados
  const totalizadores = useMemo(() => {
    if (!projetos) {
      return {
        projetosNoPrazo: 0,
        projetosAtrasados: 0,
        totalProjetos: 0,
        projetosEmAndamento: 0,
        projetosIdeacao: 0,
        projetosBacklog: 0,
        projetosEntreguesMes: 0,
        projetosEmRisco: 0,
      };
    }

    return {
      projetosNoPrazo: projetos.filter(
        (p) => p["Status de prazo"] === "No prazo"
      ).length,
      projetosAtrasados: projetos.filter(
        (p) => p["Status de prazo"] === "Atrasado"
      ).length,
      totalProjetos: projetos.length,
      projetosEmAndamento: projetos.filter((p) => p.Status === "Em Andamento")
        .length,
      projetosIdeacao: projetos.filter(
        (p) =>
          p["Status de ideação"] === "Recente" ||
          p["Status de ideação"] === "Rever"
      ).length,
      projetosBacklog: projetos.filter((p) => p.Status === "Backlog Priorizado")
        .length,
      projetosEntreguesMes: projetos.filter((p) => {
        if (!p["Data de término"]) return false;
        const data = new Date(p["Data de término"]);
        const agora = new Date();
        return (
          data.getMonth() === agora.getMonth() &&
          data.getFullYear() === agora.getFullYear()
        );
      }).length,
      projetosEmRisco: projetos.filter(
        (p) => p["Status de prazo"] === "Em risco"
      ).length,
    };
  }, [projetos]);

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
          <p style={{ color: theme.text.base }}>
            Carregando dados dos projetos...
          </p>
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

  if (!projetos) {
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
      {/* Header removido */}

      {/* Seção 1: Filtros */}
      <section>
        <FilterPanel projetos={projetos as any[]} />
      </section>

      {/* Seção 2: Totalizadores */}
      <section>
        <TotalizadoresWrapper
          projetosNoPrazo={totalizadores.projetosNoPrazo}
          projetosAtrasados={totalizadores.projetosAtrasados}
          totalProjetos={totalizadores.totalProjetos}
          projetosEmAndamento={totalizadores.projetosEmAndamento}
          projetosIdeacao={totalizadores.projetosIdeacao}
          projetosBacklog={totalizadores.projetosBacklog}
          projetosEntreguesMes={totalizadores.projetosEntreguesMes}
          projetosEmRisco={totalizadores.projetosEmRisco}
        />
      </section>

      {/* Seção 3: Próximos Projetos a Serem Executados */}
      <section>
        <ProximosProjetos projetos={projetos as any[]} />
      </section>

      {/* Seção 4: Gráficos */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={20} style={{ color: theme.text.title }} />
          <h2
            className="text-xl font-semibold"
            style={{ color: theme.text.title }}
          >
            Análises e Gráficos
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjetosPorAreaChart projetos={projetos as any[]} />
          <PrioridadeChart projetos={projetos as any[]} />
        </div>
      </section>

      {/* Seção 5: Kanban & Tabela */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          {viewMode === "kanban" ? (
            <Kanban size={20} style={{ color: theme.text.title }} />
          ) : (
            <Table size={20} style={{ color: theme.text.title }} />
          )}
          <h2
            className="text-xl font-semibold"
            style={{ color: theme.text.title }}
          >
            {viewMode === "kanban"
              ? "Visualização Kanban"
              : "Tabela de Projetos"}
          </h2>
        </div>

        {viewMode === "kanban" ? (
          <KanbanWrapper projetos={projetos as any[]} />
        ) : (
          <ProjetosTable projetos={projetos as any[]} />
        )}
      </section>
      {/* Botão flutuante para rolar ao topo */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 p-2 rounded-full shadow-lg transition-colors"
          style={{
            backgroundColor: theme.bg.surface,
            color: theme.brand.primary,
            border: `1px solid ${theme.border.base}`,
          }}
          title="Voltar ao topo"
        >
          <ChevronUp size={24} />
        </button>
      )}

      {/* Informação da última atualização */}
      <LastUpdateInfo />
    </div>
  );
};

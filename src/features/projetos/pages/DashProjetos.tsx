import { useState, useMemo } from "react";
import { useTheme } from "@/shared/context/ThemeContext";
import { BarChart3, Kanban, Table, Eye } from "lucide-react";
import { FilterPanel } from "@/features/projetos/components/Filters/FilterPanel";
import { TotalizadoresWrapper } from "@/features/projetos/components/Totalizadores/TotalizadoresWrapper";
import { ProjetosPorAreaChart } from "@/features/projetos/components/Charts/ProjetosPorAreaChart";
import { PrioridadeChart } from "@/features/projetos/components/Charts/PrioridadeChart";
import { KanbanWrapper } from "@/features/projetos/components/Kanban/KanbanWrapper";
import { ProjetosTable } from "@/features/projetos/components/Tabela/ProjetosTable";
import projetosMock from "./mockProjetos.json";
// import { EspacoDeProjetos } from "@/types/Typesjira"; // descomente quando usar tipagem real

type ViewMode = "kanban" | "table";

export const DashProjetos = () => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  // const [projetos, setProjetos] = useState<EspacoDeProjetos[]>(projetosMock as EspacoDeProjetos[]); // use quando tipar
  const [projetos] = useState<any[]>(projetosMock); // mock, troque para tipado depois

  // Exemplo de cálculo de totalizadores a partir dos dados
  const totalizadores = useMemo(() => {
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
    };
  }, [projetos]);

  return (
    <div
      className="min-h-screen p-6 space-y-8"
      style={{ backgroundColor: theme.bg.base }}
    >
      {/* Header removido */}

      {/* Seção 1: Filtros */}
      <section>
        <FilterPanel projetos={projetos} />
      </section>

      {/* Seção 2: Totalizadores */}
      <section>
        <TotalizadoresWrapper
          projetosNoPrazo={totalizadores.projetosNoPrazo}
          projetosAtrasados={totalizadores.projetosAtrasados}
          totalProjetos={totalizadores.totalProjetos}
          projetosEmAndamento={totalizadores.projetosEmAndamento}
        />
      </section>

      {/* Seção 3: Gráficos */}
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
          <ProjetosPorAreaChart projetos={projetos} />
          <PrioridadeChart projetos={projetos} />
        </div>
      </section>

      {/* Seção 4: Kanban & Tabela */}
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
          <KanbanWrapper projetos={projetos} />
        ) : (
          <ProjetosTable projetos={projetos} />
        )}
      </section>
    </div>
  );
};

import { useState } from "react";
import { useTheme } from "@/shared/context/ThemeContext";
import { EspacoDeProjetos } from "../../types/index";
import { Grid3X3, List } from "lucide-react";
import { ProximosColunas } from "./ProximosColunas";
import { ProximosLinhas } from "./ProximosLinhas";
import {
  processarProximosProjetos,
  ResponsavelProcessado,
} from "./logic/processarProximosProjetos";

interface Props {
  projetos: EspacoDeProjetos[];
}

type ViewMode = "columns" | "rows";

export const ProximosProjetos = ({ projetos }: Props) => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>("columns");

  // Processa os dados usando a lógica
  const responsaveisProcessados: ResponsavelProcessado[] =
    processarProximosProjetos(projetos);

  return (
    <div
      className="w-full rounded-2xl p-4 md:p-6"
      style={{ background: theme.bg.surface }}
    >
      {/* Header com título e toggle */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            className="text-xl md:text-2xl font-bold mb-2"
            style={{ color: theme.text.title }}
          >
            Fila de Projetos por Responsável
          </h2>
          <p
            className="text-sm md:text-base"
            style={{ color: theme.text.subtitle }}
          >
            Fila ordenada por backlog priorizado
          </p>
        </div>

        {/* Toggle de visualização */}
        <div className="flex items-center gap-2">
          <span className="text-sm mr-2" style={{ color: theme.text.subtitle }}>
            Visualização:
          </span>
          <div
            className="flex rounded-lg p-1"
            style={{
              backgroundColor: theme.bg.muted,
              border: `1px solid ${theme.border.base}`,
            }}
          >
            <button
              onClick={() => setViewMode("columns")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "columns" ? "shadow-sm" : "hover:bg-white/50"
              }`}
              style={{
                backgroundColor:
                  viewMode === "columns" ? theme.bg.base : "transparent",
                color:
                  viewMode === "columns"
                    ? theme.text.title
                    : theme.text.subtitle,
              }}
              title="Visualização em colunas"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("rows")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "rows" ? "shadow-sm" : "hover:bg-white/50"
              }`}
              style={{
                backgroundColor:
                  viewMode === "rows" ? theme.bg.base : "transparent",
                color:
                  viewMode === "rows" ? theme.text.title : theme.text.subtitle,
              }}
              title="Visualização em linhas"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Container com altura fixa e scroll */}
      <div
        className="h-80 md:h-[400px] overflow-auto"
        style={{
          backgroundColor: theme.bg.base,
          borderRadius: "12px",
          border: `1px solid ${theme.border.base}`,
        }}
      >
        <div className="p-4">
          {viewMode === "columns" ? (
            <ProximosColunas responsaveis={responsaveisProcessados} />
          ) : (
            <ProximosLinhas responsaveis={responsaveisProcessados} />
          )}
        </div>
      </div>
    </div>
  );
};

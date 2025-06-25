import React, { useEffect } from "react";
import { EspacoDeProjetos, JiraStatus } from "../../types/Typesjira";
import { getPriorityConfig } from "../../constants/priorities";
import {
  themeColors,
  getBackgroundColor,
  getTextColor,
  getBorderColor,
} from "../../utils/themeColors";
import {
  STATUS_COLUMNS,
  COLUMN_ORDER,
  normalizarStatus,
  capitalizeFirst,
} from "./kanbanUtils";
import { KanbanCardContent } from "./KanbanCards";
import { getFontSizes } from "../../constants/styleConfig";

import "./kanban-scrollbar.css";

// ============================================================================
// CONSTANTES E CONFIGURAÇÕES
// ============================================================================

interface ProjetosKanbanProps {
  data: EspacoDeProjetos[];
}

// Configurações visuais
const KANBAN_CONFIG = {
  COLUMN_WIDTH: "min-w-[200px] max-w-[230px] flex-shrink-0",
  COLUMN_MIN_HEIGHT: "min-h-96",
  CARD_MAX_HEIGHT: "max-h-[500px]",
} as const;

// ============================================================================
// COMPONENTES MENORES
// ============================================================================

/**
 * Componente principal do card do Kanban
 */
const KanbanCard: React.FC<{
  projeto: EspacoDeProjetos;
  currentTheme: "light" | "dark";
}> = ({ projeto, currentTheme }) => {
  const prioridadeConfig = getPriorityConfig(projeto.Prioridade || "");

  // Mapeamento de prioridade para cor usando as cores semânticas
  const getPriorityColor = (label: string) => {
    switch (label) {
      case "Muito Alta":
        return themeColors.error[600];
      case "Alta":
        return themeColors.warning[600];
      case "Média":
        return themeColors.primary[400];
      case "Baixa":
        return themeColors.success[600];
      case "Mínima":
        return themeColors.primary[100];
      default:
        return themeColors.secondary[400];
    }
  };

  const corBarra = getPriorityColor(prioridadeConfig.label);

  return (
    // essa div é o card do kanban
    <div
      className="group relative flex w-full rounded-lg p-2 shadow-sm transition-shadow cursor-pointer items-start"
      style={{
        backgroundColor: getBackgroundColor("card", currentTheme),
        border: `1px solid ${getBorderColor("primary", currentTheme)}`,
      }}
      tabIndex={0}
    >
      {/* Barra de prioridade */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
        style={{ background: corBarra }}
      />

      {/* Conteúdo do card */}
      <div className="pl-2 w-full text-left">
        {/* Conteúdo específico baseado no status */}
        <KanbanCardContent projeto={projeto} />
      </div>
    </div>
  );
};

/**
 * Componente do cabeçalho da coluna
 */
const ColunaHeader: React.FC<{
  status: JiraStatus;
  count: number;
  currentTheme: "light" | "dark";
}> = ({ status, count, currentTheme }) => {
  const fontSizes = getFontSizes();
  const nomeColuna = STATUS_COLUMNS[status]
    ? capitalizeFirst(STATUS_COLUMNS[status])
    : capitalizeFirst(status);

  return (
    <div className="flex items-center justify-between mb-4">
      <h3
        className={`font-semibold ${fontSizes.tituloColunaKanban}`}
        style={{ color: getTextColor("primary", currentTheme) }}
      >
        {nomeColuna}
      </h3>
      <span
        className={`px-2 py-1 rounded-full font-medium ${fontSizes.contadorColunaKanban}`}
        style={{
          backgroundColor: getBackgroundColor("card", currentTheme),
          color: getTextColor("secondary", currentTheme),
        }}
      >
        {count}
      </span>
    </div>
  );
};

/**
 * Componente de uma coluna do Kanban
 */
const KanbanColuna: React.FC<{
  status: JiraStatus;
  projetos: EspacoDeProjetos[];
  currentTheme: "light" | "dark";
}> = ({ status, projetos, currentTheme }) => (
  <div
    className={`border rounded-lg ${KANBAN_CONFIG.COLUMN_MIN_HEIGHT} p-1 ${KANBAN_CONFIG.COLUMN_WIDTH}`}
    style={{
      backgroundColor: getBackgroundColor("hover", currentTheme),
      border: `1px solid ${getBorderColor("primary", currentTheme)}`,
    }}
  >
    <ColunaHeader
      status={status}
      count={projetos.length}
      currentTheme={currentTheme}
    />

    <div
      className={`space-y-3 ${KANBAN_CONFIG.CARD_MAX_HEIGHT} overflow-y-auto hide-scrollbar`}
    >
      {projetos.map((projeto) => (
        <KanbanCard
          key={projeto.ID}
          projeto={projeto}
          currentTheme={currentTheme}
        />
      ))}
    </div>
  </div>
);

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * Componente principal do Kanban de Projetos
 */
const ProjetosKanban: React.FC<ProjetosKanbanProps> = ({ data }) => {
  // Hook para detectar o tema atual
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">(
    "light"
  );

  React.useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setCurrentTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Listener para mudanças no tamanho global
  useEffect(() => {
    const handleTamanhoChange = () => {
      // Força re-render quando o tamanho global muda
    };

    window.addEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    return () => {
      window.removeEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    };
  }, []);

  // Agrupar projetos por status
  const projetosPorStatus = data.reduce((acc, projeto) => {
    const statusNormalizado = normalizarStatus(projeto.Status);
    if (!acc[statusNormalizado]) {
      acc[statusNormalizado] = [];
    }
    acc[statusNormalizado].push(projeto);
    return acc;
  }, {} as Record<string, EspacoDeProjetos[]>);

  return (
    <div className="w-full">
      {/* Container com scroll horizontal */}
      <div className="flex gap-4 p-2 h-full overflow-x-auto">
        {COLUMN_ORDER.map((status) => {
          const projetos = projetosPorStatus[status] || [];
          return (
            <KanbanColuna
              key={status}
              status={status}
              projetos={projetos}
              currentTheme={currentTheme}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProjetosKanban;

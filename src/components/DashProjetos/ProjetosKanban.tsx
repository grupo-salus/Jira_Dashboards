import React, { useState, useEffect } from "react";
import { EspacoDeProjetos, JiraStatus } from "../../types/Typesjira";
import { getPriorityConfig } from "../../constants/priorities";
import { themeColors } from "../../utils/themeColors";
import {
  STATUS_COLUMNS,
  COLUMN_ORDER,
  STATUS_MAP,
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
  COLUMN_COLOR: "bg-gray-100 dark:bg-gray-800",
  COLUMN_WIDTH: "min-w-0 flex-1",
  COLUMN_MIN_HEIGHT: "min-h-96",
  CARD_MAX_HEIGHT: "max-h-[500px]",
} as const;

// Mapeamento de prioridade para cor do tema
const PRIORITY_COLORS: Record<string, string> = {
  "Muito Alta": themeColors.error,
  Alta: themeColors.warning,
  Média: themeColors.primary[400],
  Baixa: themeColors.success,
  Mínima: themeColors.primary[100],
  "Não definida": themeColors.gray,
};

// ============================================================================
// COMPONENTES MENORES
// ============================================================================

/**
 * Componente principal do card do Kanban
 */
const KanbanCard: React.FC<{ projeto: EspacoDeProjetos }> = ({ projeto }) => {
  const prioridadeConfig = getPriorityConfig(projeto.Prioridade || "");
  const corBarra = PRIORITY_COLORS[prioridadeConfig.label] || themeColors.gray;

  return (
    // essa div é o card do kanban
    <div
      className="group relative flex w-full bg-white dark:bg-gray-900 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-shadow cursor-pointer items-start"
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
const ColunaHeader: React.FC<{ status: JiraStatus; count: number }> = ({
  status,
  count,
}) => {
  const fontSizes = getFontSizes();
  const nomeColuna = STATUS_COLUMNS[status]
    ? capitalizeFirst(STATUS_COLUMNS[status])
    : capitalizeFirst(status);

  return (
    <div className="flex items-center justify-between mb-4">
      <h3
        className={`font-semibold text-gray-900 dark:text-white ${fontSizes.tituloColunaKanban}`}
      >
        {nomeColuna}
      </h3>
      <span
        className={`bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full font-medium ${fontSizes.contadorColunaKanban}`}
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
}> = ({ status, projetos }) => (
  <div
    className={`${KANBAN_CONFIG.COLUMN_COLOR} border border-gray-200 dark:border-gray-700 rounded-lg ${KANBAN_CONFIG.COLUMN_MIN_HEIGHT} p-4 ${KANBAN_CONFIG.COLUMN_WIDTH}`}
  >
    <ColunaHeader status={status} count={projetos.length} />

    <div
      className={`space-y-3 ${KANBAN_CONFIG.CARD_MAX_HEIGHT} overflow-y-auto hide-scrollbar`}
    >
      {projetos.map((projeto) => (
        <KanbanCard key={projeto.ID} projeto={projeto} />
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
  const [forceUpdate, setForceUpdate] = useState(0);

  // Listener para mudanças no tamanho global
  useEffect(() => {
    const handleTamanhoChange = () => {
      setForceUpdate((prev) => prev + 1); // Força re-render
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
      <div className="flex gap-4 p-4 h-full">
        {COLUMN_ORDER.map((status) => {
          const projetos = projetosPorStatus[status] || [];
          return (
            <KanbanColuna key={status} status={status} projetos={projetos} />
          );
        })}
      </div>
    </div>
  );
};

export default ProjetosKanban;

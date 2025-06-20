import React from "react";
import { EspacoDeProjetos, JiraStatus } from "../../types/Typesjira";
import { getPriorityConfig } from "../../constants/priorities";
import { themeColors } from "../../utils/themeColors";
import {
  STATUS_COLUMNS,
  COLUMN_ORDER,
  STATUS_MAP,
  formatarSegundos,
  formatDate,
  getStatusColor,
  normalizarStatus,
  capitalizeFirst,
  isProjetoEmExecucao,
} from "./kanbanUtils";

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
  COLUMN_WIDTH: "350px",
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
 * Componente para exibir informações de período do projeto
 */
const PeriodoProjeto: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  if (!projeto["Target start"] || !projeto["Target end"]) return null;

  return (
    <div className="text-gray-600 dark:text-gray-400">
      📅 {formatDate(projeto["Target start"])} →{" "}
      {formatDate(projeto["Target end"])}
    </div>
  );
};

/**
 * Componente para exibir progresso do prazo
 */
const ProgressoPrazo: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  if (
    projeto["Dias desde o início"] === null ||
    projeto["Dias restantes"] === null
  ) {
    return null;
  }

  return (
    <div className="text-gray-600 dark:text-gray-400">
      🗓️ {projeto["Dias desde o início"]} dias passados •{" "}
      {projeto["Dias restantes"]} restantes
    </div>
  );
};

/**
 * Componente para exibir status de prazo
 */
const StatusPrazo: React.FC<{ projeto: EspacoDeProjetos }> = ({ projeto }) => {
  if (projeto["% do tempo decorrido"] === null) return null;

  return (
    <div className="text-gray-600 dark:text-gray-400">
      ⏳ {projeto["% do tempo decorrido"]}% do tempo
      {projeto["Status de prazo"] && (
        <span
          className={`ml-1 px-1 py-0.5 rounded text-xs font-medium ${getStatusColor(
            projeto["Status de prazo"]
          )}`}
        >
          ({projeto["Status de prazo"]})
        </span>
      )}
    </div>
  );
};

/**
 * Componente para exibir controle de esforço
 */
const ControleEsforco: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  if (
    !projeto["Estimativa original (segundos)"] ||
    projeto["Tempo registrado (segundos)"] === null
  ) {
    return null;
  }

  return (
    <div className="text-gray-600 dark:text-gray-400">
      🕐 Estimativa:{" "}
      {formatarSegundos(projeto["Estimativa original (segundos)"])} •
      Registrado: {formatarSegundos(projeto["Tempo registrado (segundos)"])}
    </div>
  );
};

/**
 * Componente para exibir status de esforço
 */
const StatusEsforco: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  if (projeto["% da estimativa usada"] === null) return null;

  return (
    <div className="text-gray-600 dark:text-gray-400">
      📊 Esforço: {projeto["% da estimativa usada"]}%
      {projeto["Status de esforço"] && (
        <span
          className={`ml-1 px-1 py-0.5 rounded text-xs font-medium ${getStatusColor(
            projeto["Status de esforço"]
          )}`}
        >
          ({projeto["Status de esforço"]})
        </span>
      )}
    </div>
  );
};

/**
 * Componente para exibir informações básicas do projeto
 */
const InformacoesBasicas: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => (
  <>
    {projeto.Categoria && (
      <div className="text-gray-600 dark:text-gray-400">
        🔖 Categoria: {projeto.Categoria}
      </div>
    )}
    {projeto.Responsável && (
      <div className="text-gray-600 dark:text-gray-400">
        👤 Responsável: {projeto.Responsável}
      </div>
    )}
  </>
);

/**
 * Componente para exibir tag do departamento
 */
const TagDepartamento: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  const departamento = projeto["Departamento Solicitante"];
  if (!departamento || departamento.trim() === "" || departamento === "-") {
    return null;
  }

  return (
    <div className="inline-block text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium mt-3 break-words">
      {departamento}
    </div>
  );
};

/**
 * Componente principal do card do Kanban
 */
const KanbanCard: React.FC<{ projeto: EspacoDeProjetos }> = ({ projeto }) => {
  const prioridadeConfig = getPriorityConfig(projeto.Prioridade || "");
  const corBarra = PRIORITY_COLORS[prioridadeConfig.label] || themeColors.gray;
  const isEmExecucao = isProjetoEmExecucao(projeto.Status);

  return (
    <div
      className="group relative flex w-full bg-gray-50 dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-shadow cursor-pointer items-start"
      tabIndex={0}
    >
      {/* Barra de prioridade */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
        style={{ background: corBarra }}
      />

      {/* Conteúdo do card */}
      <div className="pl-3 w-full text-left">
        {/* Título do projeto */}
        <div className="font-medium text-gray-900 dark:text-white text-xs mb-3 break-words">
          {projeto.Título}
        </div>

        {/* Informações estratégicas para projetos em execução */}
        {isEmExecucao && (
          <div className="space-y-2 text-xs">
            <PeriodoProjeto projeto={projeto} />
            <ProgressoPrazo projeto={projeto} />
            <StatusPrazo projeto={projeto} />
            <ControleEsforco projeto={projeto} />
            <StatusEsforco projeto={projeto} />
            <InformacoesBasicas projeto={projeto} />
          </div>
        )}

        <TagDepartamento projeto={projeto} />
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
  const nomeColuna = STATUS_COLUMNS[status]
    ? capitalizeFirst(STATUS_COLUMNS[status])
    : capitalizeFirst(status);

  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
        {nomeColuna}
      </h3>
      <span className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
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
    className={`${KANBAN_CONFIG.COLUMN_COLOR} border border-gray-200 dark:border-gray-700 rounded-lg ${KANBAN_CONFIG.COLUMN_MIN_HEIGHT} p-4 flex-shrink-0`}
    style={{ width: KANBAN_CONFIG.COLUMN_WIDTH }}
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

const ProjetosKanban: React.FC<ProjetosKanbanProps> = ({ data }) => {
  // Agrupa projetos por status
  const projetosPorStatus = React.useMemo(() => {
    const grupos: Record<string, EspacoDeProjetos[]> = {};
    COLUMN_ORDER.forEach((status: JiraStatus) => {
      grupos[status] = [];
    });

    data.forEach((projeto) => {
      const statusNormalizado = normalizarStatus(projeto.Status || "Backlog");
      if (grupos[statusNormalizado]) {
        grupos[statusNormalizado].push(projeto);
      }
    });

    return grupos;
  }, [data]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-6 p-4 min-w-max">
        {COLUMN_ORDER.map((status: JiraStatus) => (
          <KanbanColuna
            key={status}
            status={status}
            projetos={projetosPorStatus[status] || []}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export { STATUS_MAP, COLUMN_ORDER, STATUS_COLUMNS };

export default ProjetosKanban;

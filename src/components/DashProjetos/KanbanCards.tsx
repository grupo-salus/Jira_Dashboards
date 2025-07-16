import React from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { normalizarStatus, formatDate } from "./kanbanUtils";
import { getFontSizes } from "../../constants/styleConfig";
import {
  CardIdeacao,
  CardAnaliseTecnicaNegocios,
  CardBacklogPriorizado,
  CardEmDesenvolvimento,
  CardEmHomologacao,
  CardOperacaoAssistida,
  CardEntregue,
  CardCancelado,
  CardBloqueado,
} from "./cards";

const fontSizes = getFontSizes();

// ============================================================================
// COMPONENTE PRINCIPAL QUE SELECIONA O CARD ADEQUADO
// ============================================================================

/**
 * Componente que renderiza o card adequado baseado no status do projeto
 */
export const KanbanCardContent: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  const statusNormalizado = normalizarStatus(projeto.Status);

  switch (statusNormalizado) {
    case "Backlog":
      return <CardIdeacao projeto={projeto} />;
    case "Bloqueado":
      return <CardBloqueado projeto={projeto} />;
    case "Backlog Priorizado":
      return <CardBacklogPriorizado projeto={projeto} />;
    case "Análise técnica e negócios":
    case "Análise Técnica E Negócios":
      return <CardAnaliseTecnicaNegocios projeto={projeto} />;
    case "Em Desenvolvimento":
      return <CardEmDesenvolvimento projeto={projeto} />;
    case "Em Homologação":
      return <CardEmHomologacao projeto={projeto} />;
    case "Operação Assistida":
      return <CardOperacaoAssistida projeto={projeto} />;
    case "Entregue":
      return <CardEntregue projeto={projeto} />;
    case "Cancelado":
      return <CardCancelado projeto={projeto} />;
    default:
      // Fallback para status não reconhecidos
      return (
        <div className={`space-y-2 ${fontSizes.corpoCardKanban}`}>
          <div
            className={`font-semibold text-gray-900 dark:text-white mb-2 break-words ${fontSizes.tituloCardKanban}`}
          >
            <span>{projeto.Título}</span>
          </div>
          {/* Informações Gerais */}
          {projeto["Departamento Solicitante"] && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-block bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-md dark:bg-blue-900 dark:text-blue-300 ${fontSizes.tagCardKanban}`}
              >
                {projeto["Departamento Solicitante"]}
              </span>
            </div>
          )}
          {projeto.Squads && projeto.Squads.length > 0 && (
            <div className="text-gray-600 dark:text-gray-200">
              Squads: {projeto.Squads.join(", ")}
            </div>
          )}
          {projeto.Responsável && (
            <div className="text-gray-600 dark:text-gray-200">
              Responsável: {projeto.Responsável}
            </div>
          )}

          <hr className="my-1 border-gray-300 dark:border-gray-600" />

          {/* Datas */}
          <div className="text-gray-600 dark:text-gray-200">
            Criado em: {formatDate(projeto["Data de criação"])}
          </div>
        </div>
      );
  }
};

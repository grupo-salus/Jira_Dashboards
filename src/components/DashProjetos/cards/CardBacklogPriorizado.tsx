import React from "react";
import { EspacoDeProjetos } from "../../../types/Typesjira";
import {
  formatDate,
  getStatusColor,
  getPrazoBackgroundColor,
} from "../kanbanUtils";
import { useTheme } from "../../../context/ThemeContext";
import { CardBase } from "./CardBase";
import { withJiraLink } from "./withJiraLink";
import { getFontSizes } from "../../../constants/styleConfig";

const fontSizes = getFontSizes();

/**
 * Card para projetos em BACKLOG PRIORIZADO
 */
export const CardBacklogPriorizado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  const { theme } = useTheme();

  // Usar o status da fase atual calculado no backend
  const statusFaseAtual = projeto["Status da fase atual"];

  return withJiraLink(
    projeto,
    <CardBase projeto={projeto} showBacklogPosition={true}>
      {/* Data prevista para entrar em desenvolvimento */}
      {projeto["Data: Fim Backlog priorizado"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Previsto para desenvolvimento:{" "}
          {formatDate(projeto["Data: Fim Backlog priorizado"])}
        </div>
      )}

      {/* Status da fase atual */}
      {statusFaseAtual &&
        statusFaseAtual !== "Não iniciado" &&
        statusFaseAtual !== "Em andamento" && (
          <>
            <hr className="my-1 border-gray-300 dark:border-gray-600" />
            <div className="flex items-center gap-2">
              <span className="font-medium">Prazo fase:</span>
              <span
                className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                  statusFaseAtual
                )} ${fontSizes.statusCardKanban}`}
                style={{
                  backgroundColor: getPrazoBackgroundColor(
                    statusFaseAtual,
                    theme
                  ),
                }}
              >
                {statusFaseAtual}
              </span>
            </div>
          </>
        )}

      {/* Status de prazo do projeto */}
      {projeto["Status de prazo"] && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="flex items-center gap-2">
            <span className="font-medium">Prazo projeto:</span>
            <span
              className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                projeto["Status de prazo"]
              )} ${fontSizes.statusCardKanban}`}
              style={{
                backgroundColor: getPrazoBackgroundColor(
                  projeto["Status de prazo"],
                  theme
                ),
              }}
            >
              {projeto["Status de prazo"]}
            </span>
          </div>
        </>
      )}
    </CardBase>
  );
};

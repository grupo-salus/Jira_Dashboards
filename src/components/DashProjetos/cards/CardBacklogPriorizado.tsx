import React from "react";
import { EspacoDeProjetos } from "../../../types/Typesjira";
import { formatDate } from "../kanbanUtils";
import { CardBase } from "./CardBase";
import { withJiraLink } from "./withJiraLink";

/**
 * Card para projetos em BACKLOG PRIORIZADO
 */
export const CardBacklogPriorizado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  return withJiraLink(
    projeto,
    <CardBase projeto={projeto} showBacklogPosition={true}>
      {/* Data que entrou em backlog priorizado */}
      {projeto["Data: Início Backlog priorizado"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Início: {formatDate(projeto["Data: Início Backlog priorizado"])}
        </div>
      )}

      {/* Dias em espera */}
      {projeto["Dias na fase atual"] !== null &&
        projeto["Dias na fase atual"] !== undefined && (
          <div className="text-gray-600 dark:text-gray-200">
            Tempo decorrido: {projeto["Dias na fase atual"]} dias
          </div>
        )}

      {/* Data fim backlog priorizado */}
      {projeto["Data: Fim Backlog priorizado"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Fim: {formatDate(projeto["Data: Fim Backlog priorizado"])}
        </div>
      )}
    </CardBase>
  );
}; 
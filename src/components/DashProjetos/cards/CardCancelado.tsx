import React from "react";
import { EspacoDeProjetos } from "../../../types/Typesjira";
import { formatDate } from "../kanbanUtils";
import { CardBase } from "./CardBase";
import { withJiraLink } from "./withJiraLink";
import { CustomTooltip } from "./CustomTooltip";

/**
 * Card para projetos CANCELADOS
 */
export const CardCancelado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  const justificativa = projeto["Motivo para Cancelamento de Projeto"];

  if (justificativa) {
    return withJiraLink(
      projeto,
      <CustomTooltip content={justificativa} priority={projeto.Prioridade}>
        <CardBase projeto={projeto} showTooltip={false}>
          {/* Data que entrou em cancelamento */}
          {projeto["Data: Início Cancelado"] && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Cancelado em: {projeto["Data: Início Cancelado"]}
            </div>
          )}
        </CardBase>
      </CustomTooltip>
    );
  }

  return withJiraLink(
    projeto,
    <CardBase projeto={projeto} showTooltip={false}>
      {/* Data que entrou em cancelamento */}
      {projeto["Data: Início Cancelado"] && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Cancelado em: {projeto["Data: Início Cancelado"]}
        </div>
      )}
    </CardBase>
  );
};

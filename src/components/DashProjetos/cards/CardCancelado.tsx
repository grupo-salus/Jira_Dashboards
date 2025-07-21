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
  // Buscar todos os motivos disponíveis
  const motivos = [];
  
    if (projeto["Motivo para Bloqueio de Projeto"]) {
    motivos.push(`**Motivo de Bloqueio:** ${projeto["Motivo para Bloqueio de Projeto"]}`);
  }

  if (projeto["Motivo para Cancelamento de Projeto"]) {
    motivos.push(`**Motivo de Cancelamento:** ${projeto["Motivo para Cancelamento de Projeto"]}`);
  }

  if (projeto["Motivo de Repriorização"]) {
    motivos.push(`**Motivo de Repriorização:** ${projeto["Motivo de Repriorização"]}`);
  }

  const justificativa = motivos.length > 0 ? motivos.join('\n\n') : "";

  if (justificativa) {
    return withJiraLink(
      projeto,
      <CustomTooltip content={justificativa} priority={projeto.Prioridade}>
        <CardBase projeto={projeto} showTooltip={false}>
          {/* Data que entrou em cancelamento */}
          {projeto["Data: Início Cancelado"] && (
            <div className="text-gray-600 dark:text-gray-200">
              Cancelado em: {formatDate(projeto["Data: Início Cancelado"])}
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
        <div className="text-gray-600 dark:text-gray-200">
          Cancelado em: {formatDate(projeto["Data: Início Cancelado"])}
        </div>
      )}
    </CardBase>
  );
};

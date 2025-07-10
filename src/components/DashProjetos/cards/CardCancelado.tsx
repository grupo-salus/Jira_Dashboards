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
  // Preparar conteúdo do tooltip incluindo motivo do cancelamento
  const tooltipContent = (() => {
    const descricao = projeto.Descrição || "Sem descrição disponível";
    const motivoCancelamento = projeto["Motivo para Cancelamento de Projeto"];

    if (motivoCancelamento) {
      return (
        <div>
          <div>{descricao}</div>
          <div className="mt-4">
            <strong>Justificativa:</strong>
            <br />
            {motivoCancelamento}
          </div>
        </div>
      );
    }

    return descricao;
  })();

  return withJiraLink(
    projeto,
    <CustomTooltip content={tooltipContent} priority={projeto.Prioridade}>
      <CardBase projeto={projeto} showTooltip={false}>
        {/* Data que entrou em cancelamento */}
        {projeto["Data: Início Cancelado"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Início: {formatDate(projeto["Data: Início Cancelado"])}
          </div>
        )}
        {/* Data que saiu do cancelamento */}
        {projeto["Data: Fim Cancelado"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Fim: {formatDate(projeto["Data: Fim Cancelado"])}
          </div>
        )}

        {/* Motivo do cancelamento */}
        {projeto["Motivo para Bloqueio de Projeto"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Motivo do cancelamento: {projeto["Motivo para Bloqueio de Projeto"]}
          </div>
        )}
      </CardBase>
    </CustomTooltip>
  );
}; 
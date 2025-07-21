import React from "react";
import { EspacoDeProjetos } from "../../../types/Typesjira";
import { formatDate } from "../kanbanUtils";
import { CardBase } from "./CardBase";
import { withJiraLink } from "./withJiraLink";

/**
 * Card para projetos em IDEAÇÃO
 */
export const CardIdeacao: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  return withJiraLink(
    projeto,
    <CardBase projeto={projeto} showTooltip={false}>
      {/* Data de ideação */}
      {projeto["Data: Início Ideação"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Início: {formatDate(projeto["Data: Início Ideação"])}
        </div>
      )}

      {/* Dias em espera */}
      {projeto["Dias na fase atual"] !== null &&
        projeto["Dias na fase atual"] !== undefined && (
          <div className="text-gray-600 dark:text-gray-200">
            Tempo decorrido: {projeto["Dias na fase atual"]} dias
          </div>
        )}

      {/* Data fim de ideação */}
      {projeto["Data: Fim Ideação"] && (
        <div className="text-gray-600 dark:text-gray-200">
          {(() => {
            const hoje = new Date();
            const fimIdeacao = new Date(projeto["Data: Fim Ideação"]);
            return hoje < fimIdeacao ? "Fim previsto:" : "Fim:";
          })()}{" "}
          {formatDate(projeto["Data: Fim Ideação"])}
        </div>
      )}

      {/* Status de ideação */}
      {projeto["Status de ideação"] && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="text-gray-600 dark:text-gray-200">
            Status de ideação: {projeto["Status de ideação"]}
          </div>
        </>
      )}
    </CardBase>
  );
};

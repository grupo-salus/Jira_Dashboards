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
    <CardBase projeto={projeto}>
      {/* Data de ideação */}
      {projeto["Data: Início Backlog"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Início: {formatDate(projeto["Data: Início Backlog"])}
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
      {projeto["Data: Fim Backlog"] && (
        <div className="text-gray-600 dark:text-gray-200">
          {(() => {
            const hoje = new Date();
            const fimBacklog = new Date(projeto["Data: Fim Backlog"]);
            return hoje < fimBacklog ? "Fim previsto:" : "Fim:";
          })()}{" "}
          {formatDate(projeto["Data: Fim Backlog"])}
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

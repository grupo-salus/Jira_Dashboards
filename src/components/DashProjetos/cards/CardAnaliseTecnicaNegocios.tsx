import React from "react";
import { EspacoDeProjetos } from "../../../types/Typesjira";
import { formatDate } from "../kanbanUtils";
import { CardBase } from "./CardBase";
import { withJiraLink } from "./withJiraLink";

/**
 * Card para projetos em ANÁLISE TÉCNICA E NEGÓCIOS
 */
export const CardAnaliseTecnicaNegocios: React.FC<{
  projeto: EspacoDeProjetos;
}> = ({ projeto }) => {
  return withJiraLink(
    projeto,
    <CardBase projeto={projeto}>
      {/* Data que entrou em análise técnica e negócios */}
      {projeto["Data: Início Análise técnica e negócios"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Início:{" "}
          {formatDate(projeto["Data: Início Análise técnica e negócios"])}
        </div>
      )}

      {/* Dias em análise */}
      {projeto["Tempo na fase Análise técnica e negócios (dias)"] !== null &&
        projeto["Tempo na fase Análise técnica e negócios (dias)"] !==
          undefined && (
          <div className="text-gray-600 dark:text-gray-200">
            Tempo decorrido:{" "}
            {projeto["Tempo na fase Análise técnica e negócios (dias)"]} dias
          </div>
        )}

      {/* Data fim análise técnica e negócios */}
      {projeto["Data: Fim Análise técnica e negócios"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Fim: {formatDate(projeto["Data: Fim Análise técnica e negócios"])}
        </div>
      )}
    </CardBase>
  );
};

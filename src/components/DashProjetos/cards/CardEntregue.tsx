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
 * Card para projetos ENTREGUE (Concluído)
 */
export const CardEntregue: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  const { theme } = useTheme();

  return withJiraLink(
    projeto,
    <CardBase projeto={projeto}>
      {/* Data que entrou em conclusão */}
      {projeto["Data: Início Concluído"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Início: {formatDate(projeto["Data: Início Concluído"])}
        </div>
      )}
      {/* Data de fim da conclusão */}
      {projeto["Data: Fim Concluído"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Fim: {formatDate(projeto["Data: Fim Concluído"])}
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Target start */}
      {projeto["Target start"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Target start: {formatDate(projeto["Target start"])}
        </div>
      )}
      {/* Target end */}
      {projeto["Target end"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Target end: {formatDate(projeto["Target end"])}
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Entrou em desenvolvimento */}
      {projeto["Data: Início Em andamento"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Início desenvolvimento:{" "}
          {formatDate(projeto["Data: Início Em andamento"])}
        </div>
      )}
      {/* Data de fim do desenvolvimento */}
      {projeto["Data: Fim Em andamento"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Fim desenvolvimento: {formatDate(projeto["Data: Fim Em andamento"])}
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />
      {/* Status de prazo */}
      {projeto["Status de prazo"] && (
        <div className="flex items-center gap-2">
          <span className="font-medium">Status do projeto:</span>
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
      )}
    </CardBase>
  );
};

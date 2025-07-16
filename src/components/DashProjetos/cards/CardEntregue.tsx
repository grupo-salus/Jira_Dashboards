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
      {/* 
      Data de fim da conclusão 
      {projeto["Data: Fim Concluído"] && (
        <div className="text-gray-600 dark:text-gray-200">
          {(() => {
            const hoje = new Date();
            const fimConcluido = new Date(projeto["Data: Fim Concluído"]);
            return hoje < fimConcluido ? "Entrega prevista:" : "Entregue:";
          })()}{" "}
          {formatDate(projeto["Data: Fim Concluído"])}
        </div>
      )}
      */}

      {/* Status de prazo */}
      {projeto["Status de prazo"] && (
        <div className="flex items-center gap-2">
          <span className="font-medium">Projeto:</span>
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

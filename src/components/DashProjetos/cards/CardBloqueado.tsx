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
import { CustomTooltip } from "./CustomTooltip";

const fontSizes = getFontSizes();

/**
 * Card para projetos BLOQUEADOS
 */
export const CardBloqueado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  const { theme } = useTheme();

  // Preparar conteúdo do tooltip incluindo motivo do bloqueio
  const tooltipContent = (() => {
    const descricao = projeto.Descrição || "Sem descrição disponível";
    const motivoBloqueio = projeto["Motivo para Bloqueio de Projeto"];

    if (motivoBloqueio) {
      return (
        <div>
          <div>{descricao}</div>
          <div className="mt-4">
            <strong>Justificativa:</strong>
            <br />
            {motivoBloqueio}
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
        {/* Data que entrou em bloqueado */}
        {projeto["Data: Início Bloqueado"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Início: {formatDate(projeto["Data: Início Bloqueado"])}
          </div>
        )}

        {/* Data de fim do bloqueio */}
        {projeto["Data: Fim Bloqueado"] && (
          <div className="text-gray-600 dark:text-gray-200">
            {(() => {
              const hoje = new Date();
              const fimBloqueado = new Date(projeto["Data: Fim Bloqueado"]);
              return hoje < fimBloqueado ? "Fim previsto:" : "Fim:";
            })()}{" "}
            {formatDate(projeto["Data: Fim Bloqueado"])}
          </div>
        )}

        {/* Status de prazo */}
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
    </CustomTooltip>
  );
};

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

  // Buscar todos os motivos disponíveis
  const motivos = [];

  if (projeto["Motivo para Bloqueio de Projeto"]) {
    motivos.push(
      `**Motivo de Bloqueio:** ${projeto["Motivo para Bloqueio de Projeto"]}`
    );
  }

  if (projeto["Motivo para Cancelamento de Projeto"]) {
    motivos.push(
      `**Motivo de Cancelamento:** ${projeto["Motivo para Cancelamento de Projeto"]}`
    );
  }

  if (projeto["Motivo de Repriorização"]) {
    motivos.push(
      `**Motivo de Repriorização:** ${projeto["Motivo de Repriorização"]}`
    );
  }

  const justificativa = motivos.length > 0 ? motivos.join("\n\n") : "";

  if (justificativa) {
    return withJiraLink(
      projeto,
      <CustomTooltip content={justificativa} priority={projeto.Prioridade}>
        <CardBase projeto={projeto} showTooltip={false}>
          {/* Data que entrou em bloqueado */}
          {projeto["Data: Início Bloqueado"] && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Bloqueado em: {formatDate(projeto["Data: Início Bloqueado"])}
            </div>
          )}
        </CardBase>
      </CustomTooltip>
    );
  }

  return withJiraLink(
    projeto,
    <CardBase projeto={projeto} showTooltip={false}>
      {/* Data que entrou em bloqueado */}
      {projeto["Data: Início Bloqueado"] && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Bloqueado em: {formatDate(projeto["Data: Início Bloqueado"])}
        </div>
      )}
    </CardBase>
  );
};

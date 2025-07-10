import React from "react";
import { EspacoDeProjetos } from "../../../types/Typesjira";
import { formatDate, getStatusColor, getPrazoBackgroundColor } from "../kanbanUtils";
import { useTheme } from "../../../context/ThemeContext";
import { CardBase } from "./CardBase";
import { withJiraLink } from "./withJiraLink";
import { getFontSizes } from "../../../constants/styleConfig";

const fontSizes = getFontSizes();

/**
 * Card para projetos em HOMOLOGAÇÃO
 */
export const CardEmHomologacao: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  const { theme } = useTheme();

  // Datas de homologação
  const inicioHom = projeto["Data: Início Em homologação"]
    ? new Date(projeto["Data: Início Em homologação"])
    : null;
  const fimHom = projeto["Data: Fim Em homologação"]
    ? new Date(projeto["Data: Fim Em homologação"])
    : null;
  const hoje = new Date();

  // Progresso: dias decorridos e total
  let diasDecorridos = 0;
  let totalDias = 0;
  let atraso = false;
  if (inicioHom && fimHom) {
    totalDias = Math.floor(
      (fimHom.getTime() - inicioHom.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Verifica se o projeto ainda está em homologação
    const aindaEmHomologacao = projeto.Status === "Em Homologação";

    if (aindaEmHomologacao) {
      // Se ainda está em homologação, conta até hoje
      diasDecorridos = Math.floor(
        (hoje.getTime() - inicioHom.getTime()) / (1000 * 60 * 60 * 24)
      );
      // Se passou do prazo, marca como atrasado
      if (hoje > fimHom) {
        atraso = true;
      }
    } else {
      // Se já saiu da homologação, conta apenas até a data de fim
      diasDecorridos = Math.floor(
        (fimHom.getTime() - inicioHom.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    if (diasDecorridos < 0) diasDecorridos = 0;
  }
  const progresso =
    inicioHom && fimHom && totalDias > 0
      ? Math.min((diasDecorridos / totalDias) * 100, 100)
      : 0;

  return withJiraLink(
    projeto,
    <CardBase projeto={projeto} showTooltip={false}>
      {/* Data que entrou em homologação */}
      {projeto["Data: Início Em homologação"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Início: {formatDate(projeto["Data: Início Em homologação"])}
        </div>
      )}

      {/* Data fim homologação - lógica condicional */}
      {projeto["Data: Fim Em homologação"] && fimHom && (
        <div className="text-gray-600 dark:text-gray-200">
          {hoje < fimHom ? (
            <>Fim previsto: {formatDate(projeto["Data: Fim Em homologação"])}</>
          ) : (
            <>Fim: {formatDate(projeto["Data: Fim Em homologação"])}</>
          )}
        </div>
      )}

      <hr />
      {/* Progresso da homologação */}
      {inicioHom && fimHom && (
        <>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progresso:</span>
            <span className="text-gray-600 dark:text-gray-400">
              {Math.round(progresso)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-1">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(progresso, 100)}%`,
                backgroundColor: atraso
                  ? "#ff0707" // red-500 para atrasado
                  : getPrazoBackgroundColor("No prazo", theme), // verde para no prazo
              }}
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Dias decorridos:{" "}
            <b>
              {diasDecorridos} / {totalDias} dias
            </b>
          </div>

          {atraso && (
            <div className="text-xs text-red-600 font-bold mt-1">
              Atrasado — prazo previsto era até{" "}
              {formatDate(fimHom.toISOString())}
            </div>
          )}
        </>
      )}

      {/* Status de prazo */}
      {projeto["Status de prazo"] && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="flex items-center gap-2">
            <span className="font-medium">Status de prazo:</span>
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
  );
}; 
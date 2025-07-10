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
 * Calcula o progresso baseado na data que entrou em desenvolvimento até a data de término
 */
const calcularProgresso = (
  dataInicioDesenvolvimento: string,
  dataTermino: string
): number => {
  const inicioDev = new Date(dataInicioDesenvolvimento);
  const termino = new Date(dataTermino);
  const hoje = new Date();

  // Se ainda não entrou em desenvolvimento
  if (hoje < inicioDev) {
    return 0;
  }

  // Se já passou da data de término
  if (hoje > termino) {
    return 100;
  }

  // Calcula o tempo total planejado (desde início do desenvolvimento até término)
  const totalDias =
    (termino.getTime() - inicioDev.getTime()) / (1000 * 60 * 60 * 24);

  // Calcula o tempo decorrido desde que entrou em desenvolvimento até hoje
  const diasDecorridos =
    (hoje.getTime() - inicioDev.getTime()) / (1000 * 60 * 60 * 24);

  const progresso = Math.min(
    100,
    Math.max(0, (diasDecorridos / totalDias) * 100)
  );

  return progresso;
};

/**
 * Card para projetos em DESENVOLVIMENTO
 */
export const CardEmDesenvolvimento: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  const { theme } = useTheme();

  // Calcula o progresso se tiver as datas necessárias
  const progresso =
    projeto["Data: Início Em andamento"] && projeto["Target end"]
      ? calcularProgresso(
          projeto["Data: Início Em andamento"],
          projeto["Target end"]
        )
      : null;

  return withJiraLink(
    projeto,
    <CardBase projeto={projeto} showTooltip={false}>
      {/* Data que entrou em desenvolvimento */}
      {projeto["Data: Início Em andamento"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Início: {formatDate(projeto["Data: Início Em andamento"])}
        </div>
      )}

      {/* Data que saiu de desenvolvimento (se houver) */}
      {projeto["Data: Fim Em andamento"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Fim: {formatDate(projeto["Data: Fim Em andamento"])}
        </div>
      )}

      {/* Barra de progresso */}
      {progresso !== null && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progresso:</span>
              <span className="text-gray-600 dark:text-gray-400">
                {Math.round(progresso)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progresso}%`,
                  backgroundColor: getPrazoBackgroundColor(
                    projeto["Status de prazo"] || "No prazo",
                    theme
                  ),
                }}
              />
            </div>
            {/* Dias decorridos */}
            {projeto["Data: Início Em andamento"] &&
              projeto["Target end"] &&
              (() => {
                const inicioDev = new Date(
                  projeto["Data: Início Em andamento"]
                );
                const terminoPrevisto = new Date(projeto["Target end"]);
                const fimReal = projeto["Data: Fim Em andamento"]
                  ? new Date(projeto["Data: Fim Em andamento"])
                  : null;
                const hoje = new Date();
                const totalDias = Math.round(
                  (terminoPrevisto.getTime() - inicioDev.getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                // Dias decorridos: do início até hoje ou até a data de término real, se houver
                let diasDecorridos = Math.floor(
                  ((fimReal ? fimReal : hoje).getTime() - inicioDev.getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                if (diasDecorridos < 0) diasDecorridos = 0;
                return (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Dias decorridos: <b>{diasDecorridos}</b> / {totalDias} dias
                  </div>
                );
              })()}
          </div>
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

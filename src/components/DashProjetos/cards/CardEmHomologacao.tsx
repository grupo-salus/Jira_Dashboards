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
 * Card para projetos em HOMOLOGAÇÃO
 */
export const CardEmHomologacao: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  const { theme } = useTheme();

  // Usar o status da fase atual calculado no backend
  const statusFaseAtual = projeto["Status da fase atual"];

  // Dados de dias úteis calculados no backend
  const diasDecorridos = projeto["Dias úteis decorridos Em homologação"];
  const diasRestantes = projeto["Dias úteis restantes Em homologação"];
  const totalDias = projeto["Total dias úteis Em homologação"];
  const progresso = projeto["Progresso Em homologação"];

  return withJiraLink(
    projeto,
    <CardBase projeto={projeto} showTooltip={false}>
      {/* Data que entrou em homologação */}
      {projeto["Data: Início Em homologação"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Início: {formatDate(projeto["Data: Início Em homologação"])}
        </div>
      )}

      {/* Data fim homologação */}
      {projeto["Data: Fim Em homologação"] && (
        <div className="text-gray-600 dark:text-gray-200">
          {new Date() < new Date(projeto["Data: Fim Em homologação"])
            ? "Fim previsto:"
            : "Fim:"}{" "}
          {formatDate(projeto["Data: Fim Em homologação"])}
        </div>
      )}

      {/* Barra de progresso */}
      {diasDecorridos !== null && diasDecorridos !== undefined && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="space-y-2">
            {progresso !== null && progresso !== undefined ? (
              <>
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
                      width: `${Math.min(progresso, 100)}%`,
                      backgroundColor: getPrazoBackgroundColor(
                        statusFaseAtual || "No prazo",
                        theme
                      ),
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Dias úteis decorridos:{" "}
                  <b>
                    {diasDecorridos} / {totalDias} dias
                  </b>
                </div>
              </>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Dias úteis decorridos: <b>{diasDecorridos} dias</b>
              </div>
            )}
          </div>
        </>
      )}

      {/* Status da fase atual */}
      {statusFaseAtual &&
        statusFaseAtual !== "Não iniciado" &&
        statusFaseAtual !== "Em desenvolvimento" && (
          <>
            <hr className="my-1 border-gray-300 dark:border-gray-600" />
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <span
                className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                  statusFaseAtual
                )} ${fontSizes.statusCardKanban}`}
                style={{
                  backgroundColor: getPrazoBackgroundColor(
                    statusFaseAtual,
                    theme
                  ),
                }}
              >
                {statusFaseAtual}
              </span>
            </div>
          </>
        )}

      {/* Status de prazo do projeto */}
      {projeto["Status de prazo"] && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
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
        </>
      )}
    </CardBase>
  );
};

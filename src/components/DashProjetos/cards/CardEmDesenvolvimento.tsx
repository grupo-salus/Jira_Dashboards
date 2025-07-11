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

// Removido o cálculo de progresso local - agora usa o status da fase atual do backend

/**
 * Card para projetos em DESENVOLVIMENTO
 */
export const CardEmDesenvolvimento: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  const { theme } = useTheme();

  // Usar o status da fase atual calculado no backend
  const statusFaseAtual = projeto["Status da fase atual"];

  // Calcular progresso da fase
  const inicioDev = projeto["Data: Início Em andamento"]
    ? new Date(projeto["Data: Início Em andamento"])
    : null;
  const fimDev = projeto["Data: Fim Em andamento"]
    ? new Date(projeto["Data: Fim Em andamento"])
    : null;
  const hoje = new Date();

  let diasDecorridos = 0;
  let totalDias = 0;
  let progresso = 0;
  let temDataFim = false;

  if (inicioDev) {
    // Calcular dias decorridos
    diasDecorridos = Math.floor(
      (hoje.getTime() - inicioDev.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diasDecorridos < 0) diasDecorridos = 0;

    // Se tem data de fim prevista, calcular progresso
    if (fimDev) {
      temDataFim = true;
      totalDias = Math.floor(
        (fimDev.getTime() - inicioDev.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (totalDias > 0) {
        progresso = Math.min((diasDecorridos / totalDias) * 100, 100);
      }
    }
  }

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
      {projeto["Data: Fim Em andamento"] && fimDev && (
        <div className="text-gray-600 dark:text-gray-200">
          {hoje < fimDev ? "Fim previsto:" : "Fim:"}{" "}
          {formatDate(projeto["Data: Fim Em andamento"])}
        </div>
      )}

      {/* Barra de progresso */}
      {inicioDev && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="space-y-2">
            {temDataFim ? (
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
                  Dias decorridos:{" "}
                  <b>
                    {diasDecorridos} / {totalDias} dias
                  </b>
                </div>
              </>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Dias decorridos: <b>{diasDecorridos} dias</b>
              </div>
            )}
          </div>
        </>
      )}

      {/* Status da fase atual */}
      {statusFaseAtual &&
        statusFaseAtual !== "Não iniciado" &&
        statusFaseAtual !== "Em andamento" && (
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

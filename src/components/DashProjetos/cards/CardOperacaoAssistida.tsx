import React from "react";
import { EspacoDeProjetos } from "../../../types/Typesjira";
import {
  formatDate,
  getStatusColor,
  getPrazoBackgroundColor,
  formatarSegundos,
} from "../kanbanUtils";
import { useTheme } from "../../../context/ThemeContext";
import { CardBase } from "./CardBase";
import { withJiraLink } from "./withJiraLink";
import { getFontSizes } from "../../../constants/styleConfig";

const fontSizes = getFontSizes();

/**
 * Card para projetos em Operação Assistida
 */
export const CardOperacaoAssistida: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  const { theme } = useTheme();

  // Usar o status da fase atual calculado no backend
  const statusFaseAtual = projeto["Status da fase atual"];

  // Calcular progresso da fase
  const inicioOp = projeto["Data: Início Operação assistida"]
    ? new Date(projeto["Data: Início Operação assistida"])
    : null;
  const fimOp = projeto["Data: Fim Operação assistida"]
    ? new Date(projeto["Data: Fim Operação assistida"])
    : null;
  const hoje = new Date();

  let diasDecorridos = 0;
  let totalDias = 0;
  let progresso = 0;
  let temDataFim = false;

  if (inicioOp) {
    // Calcular dias decorridos
    diasDecorridos = Math.floor(
      (hoje.getTime() - inicioOp.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diasDecorridos < 0) diasDecorridos = 0;

    // Se tem data de fim prevista, calcular progresso
    if (fimOp) {
      temDataFim = true;
      totalDias = Math.floor(
        (fimOp.getTime() - inicioOp.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (totalDias > 0) {
        progresso = Math.min((diasDecorridos / totalDias) * 100, 100);
      }
    }
  }

  return withJiraLink(
    projeto,
    <CardBase projeto={projeto} showTooltip={false}>
      {/* Data que entrou em operação assistida */}
      {projeto["Data: Início Operação assistida"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Início: {formatDate(projeto["Data: Início Operação assistida"])}
        </div>
      )}

      {/* Data fim operação assistida */}
      {projeto["Data: Fim Operação assistida"] && fimOp && (
        <div className="text-gray-600 dark:text-gray-200">
          {hoje < fimOp ? "Fim previsto:" : "Fim:"}{" "}
          {formatDate(projeto["Data: Fim Operação assistida"])}
        </div>
      )}

      {/* Barra de progresso */}
      {inicioOp && (
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
              <span className="font-medium">Prazo fase:</span>
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

      <hr className="my-1 border-gray-300 dark:border-gray-600" />
      {/* Esforço */}
      {projeto["Estimativa original (segundos)"] &&
        projeto["Tempo registrado (segundos)"] !== null && (
          <div className="flex items-center gap-2">
            <div className="font-medium">Estimativa vs. Registrado:</div>
            <div className="text-gray-600 dark:text-gray-200">
              Estimativa:{" "}
              {formatarSegundos(projeto["Estimativa original (segundos)"])} •
              Registrado:{" "}
              {formatarSegundos(projeto["Tempo registrado (segundos)"])}
            </div>
          </div>
        )}
    </CardBase>
  );
};

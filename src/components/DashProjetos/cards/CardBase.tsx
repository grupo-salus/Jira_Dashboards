import React from "react";
import { EspacoDeProjetos } from "../../../types/Typesjira";
import { getFontSizes } from "../../../constants/styleConfig";
import { CustomTooltip } from "./index";

const fontSizes = getFontSizes();

interface CardBaseProps {
  projeto: EspacoDeProjetos;
  children: React.ReactNode;
  showTooltip?: boolean;
  showBacklogPosition?: boolean;
}

/**
 * Card base que contém as informações comuns a todos os cards do Kanban
 */
export const CardBase: React.FC<CardBaseProps> = ({
  projeto,
  children,
  showTooltip = true,
  showBacklogPosition = false,
}) => {
  const cardContent = (
    <div className={`space-y-3 ${fontSizes.corpoCardKanban}`}>
      {/* Cabeçalho */}
      <div
        className={`font-semibold text-gray-900 dark:text-white mb-2 break-words ${fontSizes.tituloCardKanban}`}
      >
        <span>{projeto.Título}</span>
      </div>

      {/* Área */}
      {projeto["Departamento Solicitante"] && (
        <div className="flex items-center gap-2">
          {/* Posição no backlog (apenas para backlog priorizado) */}
          {showBacklogPosition && projeto.PosicaoBacklog && (
            <span
              className="font-bold text-sm flex items-center justify-center rounded-full aspect-square overflow-hidden"
              style={{
                background: "#10b981",
                color: "#fff",
                width: 28,
                height: 28,
                minWidth: 28,
                minHeight: 28,
                display: "inline-flex",
                textAlign: "center",
              }}
            >
              #{projeto.PosicaoBacklog}
            </span>
          )}
          <span
            className={`inline-block bg-white text-gray-800 font-medium px-2 py-1 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${fontSizes.tagCardKanban}`}
          >
            {projeto["Departamento Solicitante"]}
          </span>
        </div>
      )}

      {/* Squads */}
      {projeto.Squads && projeto.Squads.length > 0 && (
        <>
          <div className="text-gray-600 dark:text-gray-200">
            Squads:{" "}
            {projeto.Squads.map((squad, index) => {
              // Verificar se deve destacar a squad
              const deveDestacar =
                projeto["Responsável Atual"] &&
                projeto["Status da fase atual"] &&
                ["Atrasado", "Em risco"].includes(
                  projeto["Status da fase atual"]
                ) &&
                squad === projeto["Responsável Atual"];

              return (
                <span
                  key={index}
                  className={`${
                    deveDestacar
                      ? "font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded"
                      : ""
                  }`}
                >
                  {squad}
                  {index < projeto.Squads.length - 1 ? ", " : ""}
                </span>
              );
            })}
          </div>
          {/* Responsável Atual */}
          {projeto["Responsável Atual"] && (
            <div className="text-gray-600 dark:text-gray-200 mt-1">
              Responsável: {projeto["Responsável Atual"]}
            </div>
          )}
        </>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Conteúdo específico de cada card */}
      {children}
    </div>
  );

  if (showTooltip) {
    return (
      <CustomTooltip
        content={projeto.Descrição || "Sem descrição disponível"}
        priority={projeto.Prioridade}
      >
        {cardContent}
      </CustomTooltip>
    );
  }

  return cardContent;
};

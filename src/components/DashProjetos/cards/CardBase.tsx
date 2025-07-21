import React from "react";
import { EspacoDeProjetos } from "../../../types/Typesjira";
import { getFontSizes } from "../../../constants/styleConfig";
import { getSquadConfig } from "../../../utils/themeColors";
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
  // Função para obter a cor da squad
  const getSquadColor = (squads: string[]) => {
    if (!squads || squads.length === 0) {
      const squadConfig = getSquadConfig("naoDefinida");
      return squadConfig.hex;
    }
    const squadConfig = getSquadConfig(squads[0]);
    return squadConfig.hex;
  };

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
                background: "#6b7280", // Cor neutra cinza
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
                <React.Fragment key={index}>
                  <span
                    className={`${
                      deveDestacar
                        ? "font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded"
                        : ""
                    }`}
                  >
                    {squad}
                  </span>
                  {index < projeto.Squads.length - 1 ? ", " : ""}
                </React.Fragment>
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

  // Buscar justificativas apenas para cards que não têm implementação própria de tooltip
  // Cards "Bloqueado" e "Cancelado" têm suas próprias implementações
  const motivos = [];

  // Não processar motivos para status que têm implementação própria
  if (projeto.Status !== "Bloqueado" && projeto.Status !== "Cancelado") {
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
  }

  const justificativa = motivos.length > 0 ? motivos.join("\n\n") : "";

  // Mostrar tooltip apenas se showTooltip for true E houver motivos
  if (showTooltip && justificativa) {
    return (
      <CustomTooltip content={justificativa} priority={projeto.Prioridade}>
        {cardContent}
      </CustomTooltip>
    );
  }

  return cardContent;
};

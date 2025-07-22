import React from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getTotalizadoresConfig } from "../../constants/styleConfig";
import {
  themeColors,
  getTextColor,
  getPriorityConfig,
} from "../../utils/themeColors";

interface ProximosExecucaoLinhasProps {
  responsaveisDisponiveis: string[];
  backlogPriorizado: EspacoDeProjetos[];
  currentTheme: "light" | "dark";
}

// URL base do Jira
const JIRA_URL_BASE =
  "https://tigruposalus.atlassian.net/jira/software/c/projects/EP/boards/323?selectedIssue=";

const ProximosExecucaoLinhas: React.FC<ProximosExecucaoLinhasProps> = ({
  responsaveisDisponiveis,
  backlogPriorizado,
  currentTheme,
}) => {
  const config = getTotalizadoresConfig();

  // Função para obter a cor da prioridade
  const getPriorityColor = (prioridade: string) => {
    const prioridadeConfig = getPriorityConfig(prioridade);
    const label = prioridadeConfig.label;

    switch (label) {
      case "Estratégica":
        return themeColors.components.prioridades.estrategica.hex;
      case "Alta":
        return themeColors.components.prioridades.alta.hex;
      case "Média":
        return themeColors.components.prioridades.media.hex;
      case "Baixa":
        return themeColors.components.prioridades.baixa.hex;
      case "Baixíssima":
        return themeColors.components.prioridades.muitoBaixa.hex;
      default:
        return themeColors.components.prioridades.naoDefinida.hex;
    }
  };

  return (
    <div className="space-y-2 h-80 overflow-y-auto">
      {responsaveisDisponiveis
        .filter((responsavel) => responsavel !== "Todos")
        .map((responsavel) => {
          const projetosDoResponsavel = backlogPriorizado
            .filter((p) => p["Responsável Atual"] === responsavel)
            .filter((p) => p.PosicaoBacklog !== null)
            .sort((a, b) => (a.PosicaoBacklog || 0) - (b.PosicaoBacklog || 0));

          if (projetosDoResponsavel.length === 0) return null;

          return (
            <div
              key={responsavel}
              className={`flex items-center p-2 rounded-lg ${
                currentTheme === "dark" ? "bg-gray-700/50" : "bg-gray-50/80"
              }`}
            >
              {/* Título da linha com largura fixa */}
              <div className="flex items-center gap-2 flex-shrink-0 w-32">
                <h4
                  className={`font-bold text-sm ${config.titulo} break-words leading-tight`}
                  style={{ color: getTextColor("primary", currentTheme) }}
                >
                  {responsavel}
                </h4>
              </div>

              {/* Cards dos projetos com scroll horizontal */}
              <div className="flex gap-4 overflow-x-auto pb-2 flex-1">
                {projetosDoResponsavel.map((projeto, index) => (
                  <div
                    key={projeto.Título}
                    className="relative flex items-center gap-3 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 h-20 cursor-pointer flex-shrink-0 min-w-[280px]"
                    style={{
                      background:
                        themeColors.components.totalizadores.proximoExecucao.bg[
                          currentTheme
                        ],
                    }}
                    onClick={() => {
                      if (projeto.Chave) {
                        window.open(
                          `${JIRA_URL_BASE}${projeto.Chave}`,
                          "_blank"
                        );
                      }
                    }}
                  >
                    {/* Barra de prioridade lateral */}
                    <div
                      className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
                      style={{
                        background: getPriorityColor(projeto.Prioridade || ""),
                      }}
                    />

                    <div
                      className={`text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 w-8 h-8`}
                      style={{
                        backgroundColor: "#6b7280", // Cor neutra cinza
                      }}
                    >
                      <span
                        className={`text-sm font-bold`}
                        style={{ color: themeColors.utility.white }}
                      >
                        #{projeto.PosicaoBacklog}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pl-2">
                      <h4
                        className={`font-semibold break-words whitespace-normal text-xs sm:text-xs leading-tight`}
                        style={{
                          color: getTextColor("primary", currentTheme),
                        }}
                        title={projeto.Título}
                      >
                        {projeto.Título}
                      </h4>
                      <div className="flex items-center gap-2 sm:gap-2 mt-1 flex-wrap">
                        {projeto["Departamento Solicitante"] && (
                          <p
                            className={`truncate text-xs`}
                            style={{
                              color: getTextColor("secondary", currentTheme),
                            }}
                            title={projeto["Departamento Solicitante"]}
                          >
                            {projeto["Departamento Solicitante"]}
                          </p>
                        )}
                        {projeto["Responsável Atual"] && (
                          <span className="text-xs font-bold px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex-shrink-0">
                            {projeto["Responsável Atual"]}
                          </span>
                        )}
                        {projeto.Prioridade && (
                          <span
                            className={`truncate text-xs font-medium px-1 sm:px-1 py-0.5 rounded inline-block flex-shrink-0 text-white`}
                            style={{
                              backgroundColor: getPriorityColor(
                                projeto.Prioridade
                              ),
                            }}
                            title={`Prioridade: ${projeto.Prioridade}`}
                          >
                            {projeto.Prioridade}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ProximosExecucaoLinhas;

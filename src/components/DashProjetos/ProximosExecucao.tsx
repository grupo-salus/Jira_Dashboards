import React, { useEffect, useState } from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getTotalizadoresConfig } from "../../constants/styleConfig";
import {
  themeColors,
  getTextColor,
  getBackgroundColor,
  getPriorityConfig,
} from "../../utils/themeColors";

interface ProximosExecucaoProps {
  filteredData: EspacoDeProjetos[];
}

// URL base do Jira
const JIRA_URL_BASE =
  "https://tigruposalus.atlassian.net/jira/software/c/projects/EP/boards/323?selectedIssue=";

const ProximosExecucao: React.FC<ProximosExecucaoProps> = ({
  filteredData,
}) => {
  const config = getTotalizadoresConfig();

  // Hook para detectar o tema atual
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">(
    "light"
  );

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setCurrentTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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

  // Encontrar os próximos 3 projetos a serem executados
  const backlogPriorizado = filteredData.filter(
    (p) => p.Status === "Backlog Priorizado"
  );

  const proximosExecucao = backlogPriorizado
    .filter((p) => p.PosicaoBacklog !== null)
    .sort((a, b) => (a.PosicaoBacklog || 0) - (b.PosicaoBacklog || 0))
    .slice(0, 3);

  // Se não há projetos próximos, não renderizar nada
  if (proximosExecucao.length === 0) {
    return null;
  }

  return (
    <div className="mb-20">
      <div
        className={`rounded-lg shadow-md w-full p-4 sm:p-6 relative overflow-hidden flex flex-col gap-3`}
        style={{
          backgroundColor: getBackgroundColor("card", currentTheme),
        }}
      >
        <div className="w-full mb-3">
          <h3
            className={`font-bold ${config.titulo}`}
            style={{ color: getTextColor("primary", currentTheme) }}
          >
            Próximos Projetos a Serem Executados
          </h3>
          <p
            className={`text-sm ${config.label}`}
            style={{ color: getTextColor("secondary", currentTheme) }}
          >
            Fila ordenada por prioridade no backlog
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 w-full">
          {proximosExecucao.map((projeto, index) => (
            <div
              key={projeto.Título}
              className={`relative flex items-center gap-3 p-4 sm:p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 min-h-[100px] sm:h-24 lg:h-28 cursor-pointer w-full sm:flex-1 sm:min-w-[250px]`}
              style={{
                background:
                  themeColors.components.totalizadores.proximoExecucao.bg[
                    currentTheme
                  ],
              }}
              onClick={() => {
                if (projeto.Chave) {
                  window.open(`${JIRA_URL_BASE}${projeto.Chave}`, "_blank");
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
                className={`text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 w-8 h-8 sm:w-8 sm:h-8`}
                style={{
                  backgroundColor:
                    themeColors.components.totalizadores.ranking.bar,
                }}
              >
                <span
                  className={`text-sm sm:text-sm`}
                  style={{ color: themeColors.utility.white }}
                >
                  #{projeto.PosicaoBacklog}
                </span>
              </div>
              <div className="flex-1 min-w-0 pl-2">
                <h4
                  className={`font-semibold break-words whitespace-normal text-sm sm:text-sm leading-tight`}
                  style={{ color: getTextColor("primary", currentTheme) }}
                  title={projeto.Título}
                >
                  {index === 0 ? (
                    <>Próximo: {projeto.Título}</>
                  ) : (
                    projeto.Título
                  )}
                </h4>
                {projeto["Departamento Solicitante"] && (
                  <div className="flex items-center gap-2 sm:gap-2 mt-2">
                    <p
                      className={`truncate text-sm`}
                      style={{
                        color: getTextColor("secondary", currentTheme),
                      }}
                      title={projeto["Departamento Solicitante"]}
                    >
                      {projeto["Departamento Solicitante"]}
                    </p>
                    {projeto.Prioridade && (
                      <span
                        className={`truncate text-sm font-medium px-2 sm:px-2 py-1 rounded inline-block flex-shrink-0 text-white`}
                        style={{
                          backgroundColor: getPriorityColor(projeto.Prioridade),
                        }}
                        title={`Prioridade: ${projeto.Prioridade}`}
                      >
                        {projeto.Prioridade}
                      </span>
                    )}
                  </div>
                )}
                {!projeto["Departamento Solicitante"] && projeto.Prioridade && (
                  <span
                    className={`truncate text-sm mt-2 font-medium px-2 sm:px-2 py-1 rounded inline-block text-white`}
                    style={{
                      backgroundColor: getPriorityColor(projeto.Prioridade),
                    }}
                    title={`Prioridade: ${projeto.Prioridade}`}
                  >
                    {projeto.Prioridade}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProximosExecucao;

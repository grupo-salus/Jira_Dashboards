import React, { useEffect, useState } from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getTotalizadoresConfig } from "../../constants/styleConfig";
import {
  themeColors,
  getTextColor,
  getBackgroundColor,
  getPriorityConfig,
  getSquadConfig,
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
  const [responsavelSelecionado, setResponsavelSelecionado] = useState("Todos");

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

  // Função para obter a cor da squad
  const getSquadColor = (squads: string[]) => {
    if (!squads || squads.length === 0) {
      const squadConfig = getSquadConfig("naoDefinida");
      return squadConfig.hex;
    }
    const squadConfig = getSquadConfig(squads[0]);
    return squadConfig.hex;
  };

  // Encontrar os projetos no backlog priorizado
  const backlogPriorizado = filteredData.filter(
    (p) => p.Status === "Backlog Priorizado"
  );

  // Obter os responsáveis únicos que existem no backlog priorizado
  const responsaveisDisponiveis = [
    "Todos",
    ...Array.from(
      new Set(
        backlogPriorizado
          .map((p) => p["Responsável Atual"] || "")
          .filter((responsavel) => responsavel && responsavel.trim() !== "")
      )
    ),
  ];

  // Filtrar por responsável selecionado
  const projetosPorResponsavel = backlogPriorizado.filter((p) => {
    if (responsavelSelecionado === "Todos") return true;
    return p["Responsável Atual"] === responsavelSelecionado;
  });

  // Ordenar por posição no backlog
  const proximosExecucao = projetosPorResponsavel
    .filter((p) => p.PosicaoBacklog !== null)
    .sort((a, b) => (a.PosicaoBacklog || 0) - (b.PosicaoBacklog || 0));

  // Se não há projetos próximos após filtrar por responsável, mostrar mensagem
  const naoTemProjetos = proximosExecucao.length === 0;

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
            Fila de Projetos por Responsável
          </h3>
          <p
            className={`text-sm ${config.label}`}
            style={{ color: getTextColor("secondary", currentTheme) }}
          >
            Fila ordenada por backlog priorizado
          </p>
        </div>

        {/* Abas de responsável */}
        <div className="flex flex-wrap gap-2 mb-4">
          {responsaveisDisponiveis.map((responsavel) => {
            // Calcular o total para cada responsável
            const totalResponsavel =
              responsavel === "Todos"
                ? proximosExecucao.length
                : backlogPriorizado.filter(
                    (p) => p["Responsável Atual"] === responsavel
                  ).length;

            return (
              <button
                key={responsavel}
                onClick={() => setResponsavelSelecionado(responsavel)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
                  responsavelSelecionado === responsavel
                    ? "bg-gray-500 text-white shadow-md"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {responsavel}
                {responsavelSelecionado === responsavel &&
                  totalResponsavel > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalResponsavel}
                    </span>
                  )}
              </button>
            );
          })}
        </div>

        {/* Cards dos projetos ou mensagem quando vazio */}
        <div className="flex flex-wrap gap-4 w-full">
          {naoTemProjetos ? (
            <div className="w-full text-center py-8">
              <p
                className={`text-lg font-medium ${config.label}`}
                style={{ color: getTextColor("secondary", currentTheme) }}
              >
                {backlogPriorizado.length === 0
                  ? "Nenhum projeto encontrado no backlog priorizado com os filtros aplicados"
                  : "Nenhum projeto encontrado para o responsável selecionado"}
              </p>
            </div>
          ) : (
            proximosExecucao.map((projeto, index) => (
              <div
                key={projeto.Título}
                className="relative flex items-center gap-3 p-4 sm:p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 min-h-[100px] sm:h-24 lg:h-28 cursor-pointer w-full sm:flex-1 sm:min-w-[250px]"
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
                    backgroundColor: "#6b7280", // Cor neutra cinza
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
                    className={`font-semibold break-words whitespace-normal text-xs sm:text-xs leading-tight`}
                    style={{ color: getTextColor("primary", currentTheme) }}
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
                          backgroundColor: getPriorityColor(projeto.Prioridade),
                        }}
                        title={`Prioridade: ${projeto.Prioridade}`}
                      >
                        {projeto.Prioridade}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProximosExecucao;

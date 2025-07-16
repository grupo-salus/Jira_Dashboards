import React, { useEffect, useState } from "react";
import {
  CardsIcon,
  LightbulbIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  FireIcon,
  CompassIcon,
  EpicIcon,
} from "../icons/DashboardIcons";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getTotalizadoresConfig } from "../../constants/styleConfig";
import {
  themeColors,
  getTextColor,
  getBackgroundColor,
  getBorderColor,
  getPriorityConfig,
} from "../../utils/themeColors";

type TipoFiltroStatus = "projeto" | "status" | "";

interface ProjetosTotalizadoresProps {
  filteredData: EspacoDeProjetos[];
  originalData: EspacoDeProjetos[];
  onStatusPrazoClick?: (status: string) => void;
  filtroStatusPrazoAtivo?: string | null;
  onEntreguesMesClick?: () => void;
  filtroEntreguesMesAtivo?: boolean;
  tipoFiltroStatus?: "projeto" | "status" | "";
}

// Função para converter CSS rem para pixels
const remToPx = (rem: string): number => {
  const remValue = parseFloat(rem.replace("rem", ""));
  return Math.round(remValue * 16); // 1rem = 16px
};

// URL base do Jira (igual ao KanbanCards.tsx)
const JIRA_URL_BASE =
  "https://tigruposalus.atlassian.net/jira/software/c/projects/EP/boards/323?selectedIssue=";

const TotalizadorCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  currentTheme: "light" | "dark";
  tooltipContent?: React.ReactNode;
  valueColor?: string;
  onClickValue?: () => void;
  clickable?: boolean;
  isFiltered?: boolean;
}> = ({
  icon,
  label,
  value,
  currentTheme,
  tooltipContent,
  valueColor,
  onClickValue,
  clickable,
  isFiltered = false,
}) => {
  const config = getTotalizadoresConfig();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`rounded-lg shadow-md ${config.padding} flex-grow ${
        config.altura
      } relative totalizador-card 2xl:flex-1 2xl:min-w-0 ${
        clickable
          ? "cursor-pointer hover:shadow-lg transition-shadow duration-200"
          : ""
      }`}
      style={{
        backgroundColor: getBackgroundColor("card", currentTheme),
        border: isFiltered ? `2px solid ${themeColors.info[400]}` : undefined,
        transition: "border-color 0.2s ease-in-out",
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={clickable ? onClickValue : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? "button" : undefined}
      aria-label={clickable ? `Filtrar por ${label}` : undefined}
    >
      <div className="flex items-start gap-4 min-h-[56px]">
        <div
          className="flex-shrink-0 totalizador-icon flex items-center justify-center h-full -mt-1"
          style={{ position: "relative" }}
        >
          {icon}
        </div>
        <div className="flex flex-col justify-center flex-1">
          <p
            className={`font-semibold break-words leading-tight ${config.label}`}
            style={{ color: getTextColor("primary", currentTheme) }}
          >
            {label}
          </p>
          <p
            className={`font-bold mt-1 ${config.valor}`}
            style={{
              color: valueColor || getTextColor("primary", currentTheme),
            }}
          >
            {value}
          </p>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && tooltipContent && (
        <div
          className="absolute z-[9999] p-3 rounded-lg shadow-lg border max-w-xs"
          style={{
            backgroundColor: getBackgroundColor("card", currentTheme),
            border: `1px solid ${getBorderColor("primary", currentTheme)}`,
            color: getTextColor("primary", currentTheme),
            top: "calc(80%)",
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: "250px",
          }}
        >
          {tooltipContent}
          {/* Seta do tooltip */}
          <div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent"
            style={{
              borderBottomColor: getBackgroundColor("card", currentTheme),
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

const ProjetosTotalizadores: React.FC<ProjetosTotalizadoresProps> = ({
  filteredData,
  originalData,
  onStatusPrazoClick,
  filtroStatusPrazoAtivo,
  onEntreguesMesClick,
  filtroEntreguesMesAtivo,
  tipoFiltroStatus = "",
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

  // Função para obter a cor da prioridade (mesma lógica do Kanban)
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

  // Métricas Chave
  const total = filteredData.length; // Total no Board: dados filtrados (acompanha filtros)
  const totalIdeacao = filteredData.filter(
    (p) => p.Status === "Ideação"
  ).length;

  // Projetos em Desenvolvimento: apenas os status Em Desenvolvimento, Em Homologação e Operação Assistida
  const projetosEmAndamento = filteredData.filter((p) =>
    ["Em Desenvolvimento", "Em Homologação", "Operação Assistida"].includes(
      p.Status
    )
  );
  const totalEmAndamento = projetosEmAndamento.length;

  // Métricas do Backlog Priorizado
  const backlogPriorizado = filteredData.filter(
    (p) => p.Status === "Backlog Priorizado"
  );
  const totalBacklogPriorizado = backlogPriorizado.length;

  // Métricas de Projetos Entregues no Mês
  const projetosEntregues = filteredData.filter((p) => p.Status === "Entregue");
  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();

  const projetosEntreguesNoMes = projetosEntregues.filter((p) => {
    if (!p["Data de término"]) return false;
    const dataTermino = new Date(p["Data de término"]);
    return (
      dataTermino.getMonth() === mesAtual &&
      dataTermino.getFullYear() === anoAtual
    );
  });
  const totalEntreguesNoMes = projetosEntreguesNoMes.length;

  // Função para calcular métricas baseada no tipo de filtro
  const calcularMetricasStatus = (tipo: TipoFiltroStatus) => {
    let projetosNoPrazo = 0;
    let projetosEmRisco = 0;
    let projetosForaDoPrazo = 0;

    // Calcular métricas de projeto (sempre dos dados originais)
    const projetosNoPrazoProjeto = originalData.filter(
      (p: EspacoDeProjetos) => p["Status de prazo"] === "No prazo"
    ).length;
    const projetosEmRiscoProjeto = originalData.filter(
      (p: EspacoDeProjetos) => p["Status de prazo"] === "Em risco"
    ).length;
    const projetosForaDoPrazoProjeto = originalData.filter(
      (p: EspacoDeProjetos) => p["Status de prazo"] === "Atrasado"
    ).length;

    // Calcular métricas de status (sempre dos dados originais)
    const projetosNoPrazoStatus = originalData.filter(
      (p: EspacoDeProjetos) => p["Status da fase atual"] === "No prazo"
    ).length;
    const projetosEmRiscoStatus = originalData.filter(
      (p: EspacoDeProjetos) => p["Status da fase atual"] === "Em risco"
    ).length;
    const projetosForaDoPrazoStatus = originalData.filter(
      (p: EspacoDeProjetos) => p["Status da fase atual"] === "Atrasado"
    ).length;

    switch (tipo) {
      case "projeto":
        // Quando filtro por projeto, mostrar apenas os valores de projeto
        projetosNoPrazo = projetosNoPrazoProjeto;
        projetosEmRisco = projetosEmRiscoProjeto;
        projetosForaDoPrazo = projetosForaDoPrazoProjeto;
        break;

      case "status":
        // Quando filtro por status, mostrar apenas os valores de status
        projetosNoPrazo = projetosNoPrazoStatus;
        projetosEmRisco = projetosEmRiscoStatus;
        projetosForaDoPrazo = projetosForaDoPrazoStatus;
        break;
      case "":
        // Quando não há filtro, mostrar a soma individual de cada tipo
        projetosNoPrazo = projetosNoPrazoProjeto + projetosNoPrazoStatus;
        projetosEmRisco = projetosEmRiscoProjeto + projetosEmRiscoStatus;
        projetosForaDoPrazo =
          projetosForaDoPrazoProjeto + projetosForaDoPrazoStatus;
        break;
    }

    return { projetosNoPrazo, projetosEmRisco, projetosForaDoPrazo };
  };

  // Calcular métricas baseada no tipo de filtro selecionado
  const { projetosNoPrazo, projetosEmRisco, projetosForaDoPrazo } =
    calcularMetricasStatus(tipoFiltroStatus);

  // Encontrar os próximos 3 projetos a serem executados
  const proximosExecucao = backlogPriorizado
    .filter((p) => p.PosicaoBacklog !== null)
    .sort((a, b) => (a.PosicaoBacklog || 0) - (b.PosicaoBacklog || 0))
    .slice(0, 3);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 w-full mb-20">
        <TotalizadorCard
          icon={
            <CardsIcon
              size={remToPx(config.icone)}
              className="text-current flex-shrink-0"
              style={{
                color: themeColors.components.totalizadores.total.icon,
              }}
            />
          }
          label="Total de Projetos no Board"
          value={total}
          currentTheme={currentTheme}
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div style={{ color: getTextColor("secondary", currentTheme) }}>
                Total de projetos registrados no board, considerando todos os
                status
              </div>
            </div>
          }
        />
        <TotalizadorCard
          icon={
            <LightbulbIcon
              size={remToPx(config.icone)}
              className="text-current flex-shrink-0"
              style={{
                color: themeColors.components.totalizadores.ideacao.icon,
              }}
            />
          }
          label="Projetos em Ideação"
          value={totalIdeacao}
          currentTheme={currentTheme}
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div style={{ color: getTextColor("secondary", currentTheme) }}>
                Projetos que estão na etapa inicial, em análise ou validação
                antes de serem priorizados para execução
              </div>
            </div>
          }
        />

        <TotalizadorCard
          icon={
            <ClockIcon
              size={remToPx(config.icone)}
              className="text-current flex-shrink-0"
              style={{
                color:
                  themeColors.components.totalizadores.backlogPriorizado.icon,
              }}
            />
          }
          label="Projetos no Backlog Priorizado"
          value={totalBacklogPriorizado}
          currentTheme={currentTheme}
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div style={{ color: getTextColor("secondary", currentTheme) }}>
                Projetos que já foram analisados e priorizados, prontos para
                serem executados.
              </div>
            </div>
          }
        />

        <TotalizadorCard
          icon={
            <EpicIcon
              size={remToPx(config.icone)}
              className="text-current flex-shrink-0"
              style={{
                color: themeColors.components.totalizadores.projetos.icon,
              }}
            />
          }
          label="Projetos em Desenvolvimento"
          value={totalEmAndamento}
          currentTheme={currentTheme}
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div style={{ color: getTextColor("secondary", currentTheme) }}>
                Projetos que estão ativamente sendo desenvolvidos: Em
                desenvolvimento, em homologação e em operação assistida.
              </div>
            </div>
          }
        />

        <TotalizadorCard
          icon={
            <CalendarIcon
              size={remToPx(config.icone)}
              className="text-current flex-shrink-0"
              style={{
                color: themeColors.components.totalizadores.total.icon,
              }}
            />
          }
          label="Projetos Entregues no Mês"
          value={totalEntreguesNoMes}
          currentTheme={currentTheme}
          onClickValue={onEntreguesMesClick}
          clickable={!!onEntreguesMesClick}
          isFiltered={filtroEntreguesMesAtivo}
        />
        <TotalizadorCard
          icon={
            <CompassIcon
              size={remToPx(config.icone)}
              className="text-current flex-shrink-0"
              style={{
                color: themeColors.components.totalizadores.total.icon,
              }}
            />
          }
          label={
            tipoFiltroStatus === "projeto"
              ? "Projetos No Prazo"
              : tipoFiltroStatus === "status"
              ? "Status No Prazo"
              : "No Prazo"
          }
          value={projetosNoPrazo}
          currentTheme={currentTheme}
          valueColor={themeColors.status.prazo.noPrazo.text[currentTheme]}
          onClickValue={
            onStatusPrazoClick
              ? () => onStatusPrazoClick("No prazo")
              : undefined
          }
          clickable={!!onStatusPrazoClick}
          isFiltered={filtroStatusPrazoAtivo === "No prazo"}
        />
        <TotalizadorCard
          icon={
            <ExclamationTriangleIcon
              size={remToPx(config.icone)}
              className="text-current flex-shrink-0"
              style={{
                color: themeColors.components.totalizadores.total.icon,
              }}
            />
          }
          label={
            tipoFiltroStatus === "projeto"
              ? "Projetos Em Risco"
              : tipoFiltroStatus === "status"
              ? "Status Em Risco"
              : "Em Risco"
          }
          value={projetosEmRisco}
          currentTheme={currentTheme}
          valueColor={themeColors.status.prazo.emRisco.bg[currentTheme]}
          onClickValue={
            onStatusPrazoClick
              ? () => onStatusPrazoClick("Em risco")
              : undefined
          }
          clickable={!!onStatusPrazoClick}
          isFiltered={filtroStatusPrazoAtivo === "Em risco"}
        />
        <TotalizadorCard
          icon={
            <FireIcon
              size={remToPx(config.icone)}
              className="text-current flex-shrink-0"
              style={{
                color: themeColors.components.totalizadores.total.icon,
              }}
            />
          }
          label={
            tipoFiltroStatus === "projeto"
              ? "Projetos Atrasados"
              : tipoFiltroStatus === "status"
              ? "Status Atrasados"
              : "Atrasados"
          }
          value={projetosForaDoPrazo}
          currentTheme={currentTheme}
          valueColor={themeColors.status.prazo.foraPrazo.text[currentTheme]}
          onClickValue={
            onStatusPrazoClick
              ? () => onStatusPrazoClick("Atrasado")
              : undefined
          }
          clickable={!!onStatusPrazoClick}
          isFiltered={filtroStatusPrazoAtivo === "Atrasado"}
        />
      </div>

      {/* Seção dos próximos projetos */}
      {proximosExecucao.length > 0 && (
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
                    )}
                    {!projeto["Departamento Solicitante"] &&
                      projeto.Prioridade && (
                        <span
                          className={`truncate text-sm mt-2 font-medium px-2 sm:px-2 py-1 rounded inline-block text-white`}
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjetosTotalizadores;

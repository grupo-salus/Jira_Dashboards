import React, { useEffect, useState } from "react";
import {
  CardsIcon,
  LightbulbIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  FireIcon,
  CompassIcon,
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

interface ProjetosTotalizadoresProps {
  filteredData: EspacoDeProjetos[];
  originalData: EspacoDeProjetos[];
}

const TotalizadorCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  currentTheme: "light" | "dark";
  tooltipContent?: React.ReactNode;
}> = ({ icon, label, value, currentTheme, tooltipContent }) => {
  const config = getTotalizadoresConfig();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`rounded-lg shadow-md ${config.padding} flex-grow min-w-[280px] ${config.largura} ${config.altura} relative totalizador-card`}
      style={{ backgroundColor: getBackgroundColor("card", currentTheme) }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 totalizador-icon">{icon}</div>
        <div>
          <p
            className={`font-semibold mb-2 break-words ${config.label}`}
            style={{ color: getTextColor("primary", currentTheme) }}
          >
            {label}
          </p>
          <p
            className={`font-bold ${config.valor}`}
            style={{ color: getTextColor("primary", currentTheme) }}
          >
            {value}
          </p>
        </div>
      </div>
      {/* <div
        className={`absolute bottom-0 left-0 h-1 w-full`}
        style={{ backgroundColor: barColor }}
      ></div> */}

      {/* Tooltip */}
      {showTooltip && tooltipContent && (
        <div
          className="absolute z-[9999] p-3 rounded-lg shadow-lg border max-w-xs"
          style={{
            backgroundColor: getBackgroundColor("card", currentTheme),
            border: `1px solid ${getBorderColor("primary", currentTheme)}`,
            color: getTextColor("primary", currentTheme),
            top: "calc(100% + 10px)",
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

  // Métricas Chave
  const total = filteredData.length; // Total no Board: dados filtrados (acompanha filtros)
  const totalIdeacao = filteredData.filter(
    (p) => p.Status === "Backlog"
  ).length;

  // Projetos em Desenvolvimento: apenas os status Em Andamento, Em Homologação e Operação Assistida
  const projetosEmDesenvolvimento = filteredData.filter((p) =>
    ["Em Andamento", "Em Homologação", "Operação Assistida"].includes(p.Status)
  );
  const totalEmDesenvolvimento = projetosEmDesenvolvimento.length;

  // Métricas do Backlog Priorizado
  const backlogPriorizado = filteredData.filter(
    (p) => p.Status === "Backlog Priorizado"
  );
  const totalBacklogPriorizado = backlogPriorizado.length;

  // Métricas de Projetos Entregues no Mês
  const projetosEntregues = filteredData.filter(
    (p) => p.Status === "Concluído"
  );
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

  // Encontrar os próximos 3 projetos a serem executados
  const proximosExecucao = backlogPriorizado
    .filter((p) => p.PosicaoBacklog !== null)
    .sort((a, b) => (a.PosicaoBacklog || 0) - (b.PosicaoBacklog || 0))
    .slice(0, 3);

  return (
    <div>
      <div className="flex flex-wrap gap-4 lg:gap-6 mb-6">
        <TotalizadorCard
          icon={
            <CardsIcon
              size={config.icone}
              className="text-current flex-shrink-0"
              style={{ color: themeColors.components.totalizadores.total.icon }}
            />
          }
          label="Total no Board"
          value={total}
          currentTheme={currentTheme}
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Total no Board
              </div>
              <div style={{ color: getTextColor("secondary", currentTheme) }}>
                Contagem total de projetos considerando os filtros aplicados.
                Inclui todos os status: ideação, desenvolvimento, entregues,
                etc.
              </div>
            </div>
          }
        />
        <TotalizadorCard
          icon={
            <LightbulbIcon
              size={config.icone}
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
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Projetos em Ideação
              </div>
              <div style={{ color: getTextColor("secondary", currentTheme) }}>
                Projetos da coluna Ideação que são ideias a serem ainda
                analisadas e avaliadas.
              </div>
            </div>
          }
        />
        <TotalizadorCard
          icon={
            <CompassIcon
              size={config.icone}
              className="text-current flex-shrink-0"
              style={{
                color: themeColors.components.totalizadores.projetos.icon,
              }}
            />
          }
          label="Projetos em Desenvolvimento"
          value={totalEmDesenvolvimento}
          currentTheme={currentTheme}
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Projetos em Desenvolvimento
              </div>
              <div style={{ color: getTextColor("secondary", currentTheme) }}>
                Projetos que estão ativamente sendo desenvolvidos: Em
                Desenvolvimento, Em Homologação e Operação Assistida.
              </div>
            </div>
          }
        />
        <TotalizadorCard
          icon={
            <ClockIcon
              size={config.icone}
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
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Projetos no Backlog Priorizado
              </div>
              <div style={{ color: getTextColor("secondary", currentTheme) }}>
                Ideias que viraram projetos, já passaram pela análise e estão na
                fila priorizada aguardando desenvolvimento.
              </div>
            </div>
          }
        />
        <TotalizadorCard
          icon={
            <CalendarIcon
              size={config.icone}
              className="text-current flex-shrink-0"
              style={{
                color: themeColors.components.totalizadores.total.icon,
              }}
            />
          }
          label="Projetos Entregues no Mês"
          value={totalEntreguesNoMes}
          currentTheme={currentTheme}
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Projetos Entregues no Mês
              </div>
              <div style={{ color: getTextColor("secondary", currentTheme) }}>
                Projetos que foram concluídos e entregues no mês atual (
                {new Date().toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
                ).
              </div>
            </div>
          }
        />
        <TotalizadorCard
          icon={
            <ExclamationTriangleIcon
              size={config.icone}
              className="text-current flex-shrink-0"
              style={{
                color: themeColors.components.totalizadores.total.icon,
              }}
            />
          }
          label="Projetos Em Risco"
          value="-"
          currentTheme={currentTheme}
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Projetos Em Risco
              </div>
              <div style={{ color: getTextColor("secondary", currentTheme) }}>
                Projetos que apresentam riscos de atraso ou problemas de
                execução. Lógica a ser implementada.
              </div>
            </div>
          }
        />
        <TotalizadorCard
          icon={
            <FireIcon
              size={config.icone}
              className="text-current flex-shrink-0"
              style={{
                color: themeColors.components.totalizadores.total.icon,
              }}
            />
          }
          label="Projetos Atrasados"
          value="-"
          currentTheme={currentTheme}
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Projetos Atrasados
              </div>
              <div style={{ color: getTextColor("secondary", currentTheme) }}>
                Projetos que ultrapassaram o prazo de entrega previsto. Lógica a
                ser implementada.
              </div>
            </div>
          }
        />
      </div>

      {/* Seção dos próximos projetos */}
      {proximosExecucao.length > 0 && (
        <div className="mb-6">
          <div
            className={`rounded-lg w-full p-6 relative overflow-hidden flex flex-col gap-3`}
            style={{
              background: getBackgroundColor("card", currentTheme),
              border: `1px solid ${themeColors.components.totalizadores.proximoExecucao.border[currentTheme]}`,
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
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full">
              {proximosExecucao.map((projeto, index) => (
                <div
                  key={projeto.Título}
                  className={
                    `flex items-center gap-2 p-2 sm:p-3 rounded-lg border transition-all duration-200 hover:shadow-md h-16 sm:h-20 lg:h-24` +
                    (index === 0 ? " border-2" : " border")
                  }
                  style={{
                    background:
                      themeColors.components.totalizadores.proximoExecucao.bg[
                        currentTheme
                      ],
                    borderColor: getBorderColor("primary", currentTheme),
                    flex: "1 1 250px",
                    minWidth: 0,
                  }}
                >
                  <div
                    className={`text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                      index === 0
                        ? "w-6 h-6 sm:w-8 sm:h-8"
                        : "w-5 h-5 sm:w-7 sm:h-7"
                    }`}
                    style={{
                      backgroundColor:
                        index === 0
                          ? themeColors.components.totalizadores.ranking.bar
                          : themeColors.components.totalizadores.ranking.bar,
                    }}
                  >
                    <span
                      className={`${
                        index === 0 ? "text-xs sm:text-sm" : "text-xs"
                      }`}
                      style={{ color: themeColors.utility.white }}
                    >
                      #{projeto.PosicaoBacklog}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-semibold break-words whitespace-normal ${
                        index === 0 ? "text-xs sm:text-sm" : "text-xs"
                      }`}
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
                      <div className="flex items-center gap-1 sm:gap-2 mt-1">
                        <p
                          className={`truncate text-xs`}
                          style={{
                            color: getTextColor("secondary", currentTheme),
                          }}
                          title={projeto["Departamento Solicitante"]}
                        >
                          {projeto["Departamento Solicitante"]}
                        </p>
                        {projeto.Prioridade && (
                          <span
                            className={`truncate text-xs font-medium px-1 sm:px-2 py-0.5 rounded inline-block flex-shrink-0 text-white`}
                            style={{
                              backgroundColor: getPriorityConfig(
                                projeto.Prioridade
                              ).hex,
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
                          className={`truncate text-xs mt-1 font-medium px-1 sm:px-2 py-0.5 rounded inline-block text-white`}
                          style={{
                            backgroundColor: getPriorityConfig(
                              projeto.Prioridade
                            ).hex,
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

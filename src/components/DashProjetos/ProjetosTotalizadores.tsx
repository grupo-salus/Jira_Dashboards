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

// Função para converter CSS rem para pixels
const remToPx = (rem: string): number => {
  const remValue = parseFloat(rem.replace("rem", ""));
  return Math.round(remValue * 16); // 1rem = 16px
};

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
      className={`rounded-lg shadow-md ${config.padding} flex-grow ${config.altura} relative totalizador-card 2xl:flex-1 2xl:min-w-0`}
      style={{ backgroundColor: getBackgroundColor("card", currentTheme) }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
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
    (p) => p.Status === "Backlog"
  ).length;

  // Projetos em Andamento: apenas os status Em Andamento, Em Homologação e Operação Assistida
  const projetosEmAndamento = filteredData.filter((p) =>
    ["Em Andamento", "Em Homologação", "Operação Assistida"].includes(p.Status)
  );
  const totalEmAndamento = projetosEmAndamento.length;

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

  // Métricas de Status de Prazo (baseadas na lógica do project_analysis_utils.py)
  const projetosNoPrazo = filteredData.filter(
    (p) => p["Status de prazo"] === "No prazo"
  ).length;

  const projetosEmRisco = filteredData.filter(
    (p) => p["Status de prazo"] === "Em risco"
  ).length;

  const projetosForaDoPrazo = filteredData.filter(
    (p) => p["Status de prazo"] === "Fora do prazo"
  ).length;

  // Encontrar os próximos 3 projetos a serem executados
  const proximosExecucao = backlogPriorizado
    .filter((p) => p.PosicaoBacklog !== null)
    .sort((a, b) => (a.PosicaoBacklog || 0) - (b.PosicaoBacklog || 0))
    .slice(0, 3);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 w-full mb-6">
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
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Total de Projetos no Board
              </div>
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
              >
                Contagem total de projetos considerando os filtros
                aplicados. Inclui todos os status: ideação, desenvolvimento,
                entregues, etc.
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
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Projetos em Ideação
              </div>
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
              >
                Projetos da coluna Ideação que são ideias a serem ainda
                analisadas e avaliadas.
              </div>
            </div>
          }
        />
        <TotalizadorCard
          icon={
            <CompassIcon
              size={remToPx(config.icone)}
              className="text-current flex-shrink-0"
              style={{
                color: themeColors.components.totalizadores.projetos.icon,
              }}
            />
          }
          label="Projetos em Andamento"
          value={totalEmAndamento}
          currentTheme={currentTheme}
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Projetos em Andamento
              </div>
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
              >
                Projetos que estão ativamente sendo desenvolvidos: Em
                Andamento, Em Homologação e Operação Assistida.
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
                  themeColors.components.totalizadores.backlogPriorizado
                    .icon,
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
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
              >
                Ideias que viraram projetos, já passaram pela análise e
                estão na fila priorizada aguardando desenvolvimento.
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
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Projetos Entregues no Mês
              </div>
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
              >
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
            <CompassIcon
              size={remToPx(config.icone)}
              className="text-current flex-shrink-0"
              style={{
                color: themeColors.components.totalizadores.total.icon,
              }}
            />
          }
          label="Projetos No Prazo"
          value={projetosNoPrazo}
          currentTheme={currentTheme}
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Projetos No Prazo
              </div>
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
                className="mb-2"
              >
                O projeto está dentro do período planejado.
              </div>
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
                className="mb-2"
              >
                <strong>Como é calculado:</strong> verificamos se o tempo
                total planejado ainda não foi ultrapassado e se faltam mais
                de 2 dias para a data final (Target end). Também
                consideramos se o projeto ainda não foi entregue, cancelado
                ou finalizado.
              </div>
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
              >
                Isso significa que o andamento está sob controle, e há tempo
                para concluir etapas finais com segurança.
              </div>
            </div>
          }
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
          label="Projetos Em Risco"
          value={projetosEmRisco}
          currentTheme={currentTheme}
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Projetos Em Risco
              </div>
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
                className="mb-2"
              >
                O projeto está perto de ultrapassar o prazo.
              </div>
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
                className="mb-2"
              >
                <strong>Como é calculado:</strong> mesmo sem ultrapassar o
                tempo total planejado (ainda abaixo de 100%), faltam 2 dias
                ou menos para a data final (Target end) e o projeto ainda
                não está finalizado.
              </div>
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
              >
                Isso indica que o tempo restante pode não ser suficiente
                para testes, validações ou operação assistida, e merece
                atenção.
              </div>
            </div>
          }
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
          label="Projetos Fora do Prazo"
          value={projetosForaDoPrazo}
          currentTheme={currentTheme}
          tooltipContent={
            <div className="text-xs max-w-xs">
              <div
                className="font-bold mb-1"
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Projetos Fora do Prazo
              </div>
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
                className="mb-2"
              >
                O projeto ultrapassou o tempo planejado.
              </div>
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
                className="mb-2"
              >
                <strong>Como é calculado:</strong> o número de dias desde o
                início (Target start) até hoje já superou o total de dias
                planejado (calculado com base em Target end).
              </div>
              <div
                style={{ color: getTextColor("secondary", currentTheme) }}
              >
                Mesmo que ainda esteja em andamento, o prazo já estourou e
                pode impactar outras entregas ou áreas envolvidas.
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
                    `relative flex items-center gap-2 p-2 sm:p-3 rounded-lg border transition-all duration-200 hover:shadow-md h-16 sm:h-20 lg:h-24` +
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
                  {/* Barra de prioridade lateral */}
                  <div
                    className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
                    style={{
                      background: getPriorityColor(projeto.Prioridade || ""),
                    }}
                  />

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
                  <div className="flex-1 min-w-0 pl-2">
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
                          className={`truncate text-xs mt-1 font-medium px-1 sm:px-2 py-0.5 rounded inline-block text-white`}
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

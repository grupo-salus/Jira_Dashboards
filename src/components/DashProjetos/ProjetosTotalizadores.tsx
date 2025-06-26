import React, { useEffect } from "react";
import { CardsIcon, LightbulbIcon } from "../icons/DashboardIcons";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getTotalizadoresConfig } from "../../constants/styleConfig";
import {
  themeColors,
  getTextColor,
  getBackgroundColor,
  getBorderColor,
} from "../../utils/themeColors";

interface ProjetosTotalizadoresProps {
  filteredData: EspacoDeProjetos[];
  originalData: EspacoDeProjetos[];
}

const TotalizadorCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  barColor: string;
  currentTheme: "light" | "dark";
}> = ({ icon, label, value, barColor, currentTheme }) => {
  const config = getTotalizadoresConfig();

  return (
    <div
      className={`rounded-lg shadow-md ${config.padding} flex-grow ${config.largura} ${config.altura} relative overflow-hidden`}
      style={{ backgroundColor: getBackgroundColor("card", currentTheme) }}
    >
      <div className="flex items-center gap-4">
        {icon}
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
      <div
        className={`absolute bottom-0 left-0 h-1 w-full`}
        style={{ backgroundColor: barColor }}
      ></div>
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

  React.useEffect(() => {
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

  useEffect(() => {
    const handleTamanhoChange = () => {
      // Força re-render quando o tamanho global muda
    };
    window.addEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    return () => {
      window.removeEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    };
  }, []);

  // Métricas Chave
  const total = originalData.length; // Total no Board: todos os dados originais
  const totalIdeacao = filteredData.filter(
    (p) => p.Status === "Backlog"
  ).length;

  // Total de Projetos: todos os status exceto "Backlog" (ideação), "Cancelado" e "Concluído" (entregue)
  const totalProjetos = filteredData.filter(
    (p) => !["Backlog", "Cancelado", "Concluído"].includes(p.Status)
  ).length;

  // Métricas do Backlog Priorizado
  const backlogPriorizado = filteredData.filter(
    (p) => p.Status === "Backlog Priorizado"
  );
  const totalBacklogPriorizado = backlogPriorizado.length;

  // Encontrar os próximos 3 projetos a serem executados
  const proximosExecucao = backlogPriorizado
    .filter((p) => p.PosicaoBacklog !== null)
    .sort((a, b) => (a.PosicaoBacklog || 0) - (b.PosicaoBacklog || 0))
    .slice(0, 3);

  return (
    <div>
      <div className="flex flex-wrap gap-6 mb-6">
        <TotalizadorCard
          icon={
            <CardsIcon
              size={config.icone}
              className="text-current"
              style={{ color: themeColors.components.totalizadores.total.icon }}
            />
          }
          label="Total no Board"
          value={total}
          barColor={themeColors.components.totalizadores.total.bar}
          currentTheme={currentTheme}
        />
        <TotalizadorCard
          icon={
            <LightbulbIcon
              size={config.icone}
              className="text-current"
              style={{
                color: themeColors.components.totalizadores.ideacao.icon,
              }}
            />
          }
          label="Total de Ideação"
          value={totalIdeacao}
          barColor={themeColors.components.totalizadores.ideacao.bar}
          currentTheme={currentTheme}
        />
        <TotalizadorCard
          icon={
            <LightbulbIcon
              size={config.icone}
              className="text-current"
              style={{
                color: themeColors.components.totalizadores.projetos.icon,
              }}
            />
          }
          label="Total de Projetos"
          value={totalProjetos}
          barColor={themeColors.components.totalizadores.projetos.bar}
          currentTheme={currentTheme}
        />
        <TotalizadorCard
          icon={
            <LightbulbIcon
              size={config.icone}
              className="text-current"
              style={{
                color:
                  themeColors.components.totalizadores.backlogPriorizado.icon,
              }}
            />
          }
          label="Total na Fila Backlog Priorizado"
          value={totalBacklogPriorizado}
          barColor={themeColors.components.totalizadores.backlogPriorizado.bar}
          currentTheme={currentTheme}
        />
      </div>

      {/* Seção dos próximos projetos */}
      {proximosExecucao.length > 0 && (
        <div className="mb-6">
          <div
            className={`rounded-lg w-full h-32 p-6 relative overflow-hidden`}
            style={{
              background: getBackgroundColor("card", currentTheme),
              border: `1px solid ${themeColors.components.totalizadores.proximoExecucao.border[currentTheme]}`,
            }}
          >
            <div className="flex items-center h-full gap-3">
              {/* Título e descrição - 1/4 do espaço */}
              <div className="flex-1 h-full flex flex-col justify-center">
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

              {/* Cards dos projetos - cada um ocupa 1/4 do espaço */}
              {proximosExecucao.map((projeto, index) => (
                <div
                  key={projeto.Título}
                  className={
                    `flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 hover:shadow-md flex-1 h-full` +
                    (index === 0 ? " border-2" : " border")
                  }
                  style={{
                    background:
                      themeColors.components.totalizadores.proximoExecucao.bg[
                        currentTheme
                      ],
                    borderColor:
                      index === 0
                        ? themeColors.components.totalizadores.total.bar
                        : getBorderColor("primary", currentTheme),
                  }}
                >
                  <div
                    className={`text-white rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? "w-8 h-8" : "w-7 h-7"
                    }`}
                    style={{
                      backgroundColor:
                        index === 0
                          ? themeColors.components.totalizadores.total.bar
                          : themeColors.components.totalizadores
                              .backlogPriorizado.bar,
                    }}
                  >
                    <span
                      className={`${index === 0 ? "text-sm" : "text-xs"}`}
                      style={{ color: themeColors.utility.white }}
                    >
                      #{projeto.PosicaoBacklog}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-semibold truncate ${
                        index === 0 ? "text-sm" : "text-xs"
                      }`}
                      style={{ color: getTextColor("primary", currentTheme) }}
                      title={projeto.Título}
                    >
                      {index === 0 ? (
                        <>
                          Próximo: <i>{projeto.Título}</i>
                        </>
                      ) : (
                        projeto.Título
                      )}
                    </h4>
                    {projeto["Departamento Solicitante"] && (
                      <p
                        className={`truncate text-xs mt-1`}
                        style={{
                          color: getTextColor("secondary", currentTheme),
                        }}
                        title={projeto["Departamento Solicitante"]}
                      >
                        {projeto["Departamento Solicitante"]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="absolute bottom-0 left-0 h-1 w-full"
              style={{
                background:
                  themeColors.components.totalizadores.proximoExecucao.bar,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjetosTotalizadores;

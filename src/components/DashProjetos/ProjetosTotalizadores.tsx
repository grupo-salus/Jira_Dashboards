import React, { useEffect } from "react";
import { CardsIcon, LightbulbIcon } from "../icons/DashboardIcons";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getTotalizadoresConfig } from "../../constants/styleConfig";
import {
  themeColors,
  getTextColor,
  getBackgroundColor,
} from "../../utils/themeColors";

interface ProjetosTotalizadoresProps {
  filteredData: EspacoDeProjetos[];
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
  const total = filteredData.length;
  const totalIdeacao = filteredData.filter(
    (p) => p.Status === "Backlog"
  ).length;
  const totalProjetos = total - totalIdeacao;

  // Métricas do Backlog Priorizado
  const backlogPriorizado = filteredData.filter(
    (p) => p.Status === "Backlog Priorizado"
  );
  const totalBacklogPriorizado = backlogPriorizado.length;

  // Encontrar o próximo a ser executado (primeiro da fila original)
  const proximoExecucao =
    backlogPriorizado.length > 0
      ? backlogPriorizado
          .filter((p) => p.PosicaoBacklog !== null)
          .sort((a, b) => (a.PosicaoBacklog || 0) - (b.PosicaoBacklog || 0))[0]
      : null;

  return (
    <div>
      <div className="flex flex-wrap gap-6 mb-6">
        <TotalizadorCard
          icon={
            <CardsIcon
              size={config.icone}
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
      {proximoExecucao && (
        <div
          className={`rounded-lg w-full ${config.altura} ${config.padding} relative overflow-hidden flex items-center mb-6`}
          style={{
            background:
              themeColors.components.totalizadores.proximoExecucao.bg[
                currentTheme
              ],
            border: `1px solid ${themeColors.components.totalizadores.proximoExecucao.border[currentTheme]}`,
          }}
        >
          <div className="flex items-center gap-3 w-full">
            <div
              className="text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
              style={{ backgroundColor: themeColors.success[500] }}
            >
              <span
                className={config.label}
                style={{ color: themeColors.utility.white }}
              >
                #{proximoExecucao.PosicaoBacklog}
              </span>
            </div>
            <div className="flex-1">
              <h4
                className={`font-semibold ${config.titulo}`}
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Próximo: {proximoExecucao.Título}
              </h4>
              {proximoExecucao["Departamento Solicitante"] && (
                <p
                  className={`mt-1 ${config.label}`}
                  style={{ color: getTextColor("secondary", currentTheme) }}
                >
                  {proximoExecucao["Departamento Solicitante"]}
                </p>
              )}
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 h-1 w-full"
            style={{
              background:
                themeColors.components.totalizadores.proximoExecucao.bar,
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ProjetosTotalizadores;

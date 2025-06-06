import React from "react";
import { calculateBacklogMetrics } from "../../utils/backlogMetrics";
import { BacklogItem } from "../../types/backlog";
import { getPriorityConfig } from "../../constants/priorities";
import { themeColors } from "../../utils/themeColors";

// Componente de gráfico
interface BacklogChartsProps {
  epicosPorPrioridade: Record<string, number>;
}

export const BacklogCharts: React.FC<BacklogChartsProps> = ({
  epicosPorPrioridade,
}) => {
  const prioridades = Object.keys(epicosPorPrioridade);
  const max = Math.max(...Object.values(epicosPorPrioridade), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">
        Épicos/Projetos por Prioridade
      </h3>
      <div className="flex flex-col gap-3">
        {prioridades.map((prioridade) => {
          const config = getPriorityConfig(prioridade);
          return (
            <div key={prioridade} className="flex items-center gap-2">
              <span
                className={`w-24 text-xs capitalize font-semibold ${config.color.text} ${config.color.dark.text}`}
              >
                {config.label}
              </span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded h-4 relative">
                <div
                  className={`${config.color.bg} ${config.color.dark.bg} h-4 rounded`}
                  style={{
                    width: `${(epicosPorPrioridade[prioridade] / max) * 100}%`,
                  }}
                />
                <span className="absolute right-2 top-0 text-xs text-gray-800 dark:text-gray-200">
                  {epicosPorPrioridade[prioridade]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Página que usa o gráfico
interface BacklogPageProps {
  items: BacklogItem[];
}

export const BacklogPage: React.FC<BacklogPageProps> = ({ items }) => {
  const metrics = calculateBacklogMetrics(items);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Backlog</h1>
      <BacklogCharts epicosPorPrioridade={metrics.epicos_por_prioridade} />
      {/* Outros componentes e métricas */}
    </div>
  );
};

export default BacklogPage;

// Novo componente para Tarefas por Prioridade
interface TarefasPorPrioridadeProps {
  tarefasPorPrioridade: Record<string, number>;
}

export const TarefasPorPrioridadeChart: React.FC<TarefasPorPrioridadeProps> = ({
  tarefasPorPrioridade,
}) => {
  const prioridades = Object.keys(tarefasPorPrioridade);
  const max = Math.max(...Object.values(tarefasPorPrioridade), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Tarefas por Prioridade</h3>
      <div className="flex flex-col gap-3">
        {prioridades.map((prioridade) => {
          const config = getPriorityConfig(prioridade);
          return (
            <div key={prioridade} className="flex items-center gap-2">
              <span
                className={`w-24 text-xs capitalize font-semibold ${config.color.text} ${config.color.dark.text}`}
              >
                {config.label}
              </span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded h-4 relative">
                <div
                  className={`${config.color.bg} ${config.color.dark.bg} h-4 rounded`}
                  style={{
                    width: `${(tarefasPorPrioridade[prioridade] / max) * 100}%`,
                  }}
                />
                <span className="absolute right-2 top-0 text-xs text-gray-800 dark:text-gray-200">
                  {tarefasPorPrioridade[prioridade]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Novo componente para Saúde do Backlog
interface SaudeBacklogProps {
  saude: {
    total: number;
    faixa30: number;
    faixa60: number;
    faixa90: number;
    faixa90mais: number;
    idade_media: number;
    mais_antigo: number;
    projeto_mais_antigo: {
      chave: string;
      titulo: string;
      prioridade: string;
      dias: number;
    };
  };
}

export const SaudeBacklogChart: React.FC<SaudeBacklogProps> = ({ saude }) => {
  // Use as primeiras 4 cores da paleta chart
  const fatias = [
    { label: "Até 30 dias", value: saude.faixa30, color: themeColors.chart[5] }, // Emerald
    { label: "31-60 dias", value: saude.faixa60, color: themeColors.chart[4] }, // Amber
    { label: "61-90 dias", value: saude.faixa90, color: themeColors.chart[8] }, // Orange
    {
      label: "90+ dias",
      value: saude.faixa90mais,
      color: themeColors.chart[3],
    }, // Red
  ];
  const total = saude.total || 1;
  let startAngle = 0;

  // Calcula as fatias do gráfico de pizza
  const paths = fatias.map((fatia) => {
    const percent = fatia.value / total;
    const angle = percent * 360;
    const large = angle > 180 ? 1 : 0;
    const r = 48;
    const cx = 60,
      cy = 60;
    const x1 = cx + r * Math.cos((Math.PI * (startAngle - 90)) / 180);
    const y1 = cy + r * Math.sin((Math.PI * (startAngle - 90)) / 180);
    startAngle += angle;
    const x2 = cx + r * Math.cos((Math.PI * (startAngle - 90)) / 180);
    const y2 = cy + r * Math.sin((Math.PI * (startAngle - 90)) / 180);
    const path = `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${r} ${r} 0 ${large} 1 ${x2} ${y2}
      Z
    `;
    return fatia.value > 0 ? (
      <path key={fatia.label} d={path} fill={fatia.color} />
    ) : null;
  });

  const prioridadeConfig = getPriorityConfig(
    saude.projeto_mais_antigo.prioridade
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col h-full">
      {/* Header com SVG e título */}
      <div className="flex items-center mb-4">
        <div className="mr-3 flex-shrink-0">
          {/* SVG de saúde */}
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill={themeColors.warning}
              opacity="0.15"
            />
            <path
              d="M8 13l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z"
              stroke={themeColors.warning}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Saúde do Backlog</h3>
          <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
            <div>
              <span className="font-semibold">Idade média:</span>{" "}
              <b>{saude.idade_media} dias</b>
            </div>
            <div>
              <span className="font-semibold">Projeto mais antigo (ID):</span>{" "}
              <b>{saude.projeto_mais_antigo.chave}</b> (
              {saude.projeto_mais_antigo.dias} dias)
            </div>
            <div>
              <span className="font-semibold">Prioridade do mais antigo:</span>{" "}
              <span
                className={`${prioridadeConfig.color.text} ${prioridadeConfig.color.dark.text} font-bold`}
              >
                {prioridadeConfig.label}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Gráfico e legenda */}
      <div className="flex items-center justify-between flex-1">
        {/* Gráfico centralizado */}
        <div className="flex-1 flex justify-center">
          <svg width="120" height="120" className="mb-2">
            {paths}
            <circle cx="60" cy="60" r="32" fill="white" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy=".3em"
              className="text-base font-bold"
              fill={themeColors.warning}
            >
              {saude.total}
            </text>
          </svg>
        </div>
        {/* Legenda à direita */}
        <div className="flex flex-col gap-2 ml-4">
          {fatias.map((fatia) => (
            <div
              key={fatia.label}
              className="flex items-center justify-between text-xs min-w-[110px]"
            >
              <span className="flex items-center">
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ background: fatia.color }}
                />
                {fatia.label}
              </span>
              <span className="ml-3">
                {fatia.value} ({Math.round((fatia.value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

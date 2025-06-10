import React from "react";

import { getPriorityConfig } from "../../constants/priorities";
import { themeColors } from "../../utils/themeColors";

/* =======================
   Tipos/Interfaces
======================= */
interface BacklogChartsProps {
  epicosPorPrioridade: Record<string, number>;
}
interface TarefasPorPrioridadeProps {
  tarefasPorPrioridade: Record<string, number>;
}
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
interface EpicosPorAreaProps {
  epicosPorArea: Record<string, Record<string, number>>;
}
interface CardsPorAreaProps {
  cardsPorArea: Record<string, number>;
}

/* =======================
   Gráfico: Épicos/Projetos por Prioridade
======================= */
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

/* =======================
   Gráfico: Tarefas por Prioridade
======================= */
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

/* =======================
   Gráfico: Saúde do Backlog
======================= */
export const SaudeBacklogChart: React.FC<SaudeBacklogProps> = ({ saude }) => {
  const fatias = [
    { label: "Até 30 dias", value: saude.faixa30, color: themeColors.chart[5] },
    { label: "31-60 dias", value: saude.faixa60, color: themeColors.chart[4] },
    { label: "61-90 dias", value: saude.faixa90, color: themeColors.chart[8] },
    {
      label: "90+ dias",
      value: saude.faixa90mais,
      color: themeColors.chart[3],
    },
  ];
  const total = saude.total || 1;
  let startAngle = 0;

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col">
      {/* Header com SVG e título */}
      <div className="flex items-center mb-4">
        <div className="mr-3 flex-shrink-0">
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

/* =======================
   Gráfico: Épicos/Projetos por Área
======================= */
export const EpicosPorAreaChart: React.FC<EpicosPorAreaProps> = ({
  epicosPorArea,
}) => {
  const areas = Object.keys(epicosPorArea);
  const data = areas.map((area) => ({
    area: area,
    totalEpicos: Object.keys(epicosPorArea[area]).length,
  }));

  const max = Math.max(...data.map((d) => d.totalEpicos), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Épicos/Projetos por Área</h3>
      <div className="flex flex-col gap-3">
        {data.map((item, idx) => (
          <div key={item.area} className="flex items-center gap-2">
            <span className="w-32 text-xs font-semibold truncate">
              {item.area}
            </span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded h-4 relative">
              <div
                className="h-4 rounded"
                style={{
                  width: `${(item.totalEpicos / max) * 100}%`,
                  background: themeColors.chart[idx % themeColors.chart.length],
                }}
              />
              <span className="absolute right-2 top-0 text-xs text-gray-800 dark:text-gray-200">
                {item.totalEpicos}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =======================
   Gráfico: Cards por Área
======================= */
export const CardsPorAreaChart: React.FC<CardsPorAreaProps> = ({
  cardsPorArea,
}) => {
  const areas = Object.keys(cardsPorArea);
  const data = areas.map((area) => ({
    area: area,
    totalCards: cardsPorArea[area],
  }));

  const max = Math.max(...data.map((d) => d.totalCards), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Cards por Área</h3>
      <div className="flex flex-col gap-3">
        {data.map((item, idx) => (
          <div key={item.area} className="flex items-center gap-2">
            <span className="w-32 text-xs font-semibold truncate">
              {item.area}
            </span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded h-4 relative">
              <div
                className="h-4 rounded"
                style={{
                  width: `${(item.totalCards / max) * 100}%`,
                  background: themeColors.chart[idx % themeColors.chart.length],
                }}
              />
              <span className="absolute right-2 top-0 text-xs text-gray-800 dark:text-gray-200">
                {item.totalCards}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =======================
   Gráfico: Projetos por Solicitante
======================= */
interface ProjetosPorSolicitanteProps {
  projetosPorSolicitante: Record<string, number>;
}

export const ProjetosPorSolicitanteChart: React.FC<
  ProjetosPorSolicitanteProps
> = ({ projetosPorSolicitante }) => {
  const solicitantes = Object.keys(projetosPorSolicitante);
  const data = solicitantes.map((sol) => ({
    solicitante: sol,
    totalProjetos: projetosPorSolicitante[sol],
  }));
  const max = Math.max(...data.map((d) => d.totalProjetos), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Projetos por Solicitante</h3>
      <div className="flex flex-col gap-3">
        {data.map((item, idx) => (
          <div key={item.solicitante} className="flex items-center gap-2">
            <span className="w-32 text-xs font-semibold truncate">
              {item.solicitante}
            </span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded h-4 relative">
              <div
                className="h-4 rounded"
                style={{
                  width: `${(item.totalProjetos / max) * 100}%`,
                  background: themeColors.chart[idx % themeColors.chart.length],
                }}
              />
              <span className="absolute right-2 top-0 text-xs text-gray-800 dark:text-gray-200">
                {item.totalProjetos}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =======================
   Gráfico: Cards por Solicitante
======================= */
interface CardsPorSolicitanteProps {
  cardsPorSolicitante: Record<string, number>;
}

export const CardsPorSolicitanteChart: React.FC<CardsPorSolicitanteProps> = ({
  cardsPorSolicitante,
}) => {
  const solicitantes = Object.keys(cardsPorSolicitante);
  const data = solicitantes.map((sol) => ({
    solicitante: sol,
    totalCards: cardsPorSolicitante[sol],
  }));
  const max = Math.max(...data.map((d) => d.totalCards), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Cards por Solicitante</h3>
      <div className="flex flex-col gap-3">
        {data.map((item, idx) => (
          <div key={item.solicitante} className="flex items-center gap-2">
            <span className="w-32 text-xs font-semibold truncate">
              {item.solicitante}
            </span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded h-4 relative">
              <div
                className="h-4 rounded"
                style={{
                  width: `${(item.totalCards / max) * 100}%`,
                  background: themeColors.chart[idx % themeColors.chart.length],
                }}
              />
              <span className="absolute right-2 top-0 text-xs text-gray-800 dark:text-gray-200">
                {item.totalCards}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

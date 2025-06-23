import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import {
  getGraficosConfig,
  getChartDimensions,
} from "../../constants/styleConfig";
import { themeColors } from "../../utils/themeColors";

interface IdeacoesPorTempoDeEsperaProps {
  data: EspacoDeProjetos[];
}

const IdeacoesPorTempoDeEspera: React.FC<IdeacoesPorTempoDeEsperaProps> = ({
  data,
}) => {
  const [forceUpdate, setForceUpdate] = useState(0);
  const config = getGraficosConfig();
  const chartDimensions = getChartDimensions();

  useEffect(() => {
    const handleTamanhoChange = () => {
      setForceUpdate((prev) => prev + 1);
    };
    window.addEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    return () => {
      window.removeEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    };
  }, []);

  const timePhases = [
    {
      name: "Recente",
      color: "#10B981",
      description: "Ideias novas",
      min: 0,
      max: 90,
    },
    {
      name: "Em Análise",
      color: "#F59E0B",
      description: "Precisa revisão",
      min: 91,
      max: 180,
    },
    {
      name: "Quase Obsoleto",
      color: "#EF4444",
      description: "Ação necessária",
      min: 181,
      max: 365,
    },
    {
      name: "Obsoleto",
      color: "#6B7280",
      description: "Arquivar",
      min: 366,
      max: Infinity,
    },
  ];

  // Conta quantos projetos em cada fase
  const phaseCounts = timePhases.map((phase) => {
    const count = data.filter((item) => {
      if (item.Status === "Backlog" || item.Status === "Backlog Priorizado") {
        const dias = item["Dias desde criação"];
        if (dias !== null && dias !== undefined) {
          if (phase.max === Infinity) {
            return dias > phase.min;
          }
          return dias >= phase.min && dias <= phase.max;
        }
      }
      return false;
    }).length;
    return { ...phase, count };
  });

  // Pie chart config
  const pieOuterRadius = chartDimensions.pie.outerRadius;
  const pieInnerRadius = 0;

  // Renderiza o label dentro da fatia
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent === 0) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={config.valor}
        fontWeight="bold"
      >
        {phaseCounts.find((p) => p.count && percent > 0)?.count}
      </text>
    );
  };

  return (
    <div
      className={`w-full h-full flex-1 flex flex-row items-center justify-center min-h-[180px] ${config.altura}`}
    >
      {/* Gráfico de pizza */}
      <div className="flex-1 flex items-center justify-center min-w-[180px] min-h-[180px] h-full">
        <ResponsiveContainer width="100%" height="90%">
          <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <Pie
              data={phaseCounts}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={pieOuterRadius}
              innerRadius={pieInnerRadius}
              labelLine={false}
              label={renderCustomizedLabel}
              paddingAngle={2}
            >
              {phaseCounts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#22223b",
                border: `1px solid #888`,
                borderRadius: "8px",
                fontSize: config.label,
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legenda das fases ao lado */}
      <div
        className="flex flex-col flex-wrap justify-center items-start gap-y-2 gap-x-6 ml-6 h-full max-h-full min-w-[140px]"
        style={{ columnCount: 1 }}
      >
        {phaseCounts.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center gap-2 mb-2 break-inside-avoid-column"
          >
            <span
              className="inline-block w-4 h-2 rounded-sm"
              style={{ background: entry.color }}
            />
            <span
              className={`text-gray-800 dark:text-gray-200 font-medium ${config.label}`}
            >
              {entry.name}
            </span>
            <span className={`ml-2 text-gray-500 ${config.label}`}>
              {entry.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeacoesPorTempoDeEspera;

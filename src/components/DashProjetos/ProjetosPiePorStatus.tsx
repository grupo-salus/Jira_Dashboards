import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { EspacoDeProjetos, JiraStatus } from "../../types/Typesjira";
import { themeColors } from "../../utils/themeColors";
import { getFontSizes, getChartDimensions } from "../../constants/styleConfig";

interface ProjetosPiePorStatusProps {
  data: EspacoDeProjetos[];
}

const statusOrdem: JiraStatus[] = [
  "Backlog",
  "Backlog Priorizado",
  "Em andamento",
  "Em Homologação",
  "OPERAÇÃO ASSISTIDA",
  "Concluído",
  "Cancelado",
  "Bloqueado",
];

// Mapeamento de nomes de status para o gráfico
const statusNameMap: Record<string, string> = {
  Backlog: "Ideação",
  "Em andamento": "Em Execução",
  Concluído: "Entregue",
};

const ProjetosPiePorStatus: React.FC<ProjetosPiePorStatusProps> = ({
  data,
}) => {
  const [, setForceUpdate] = useState(0);

  // Obter configurações atuais
  const fontSizes = getFontSizes();
  const chartDimensions = getChartDimensions();

  // Listener para mudanças no tamanho global
  useEffect(() => {
    const handleTamanhoChange = () => {
      setForceUpdate((prev) => prev + 1); // Força re-render
    };

    window.addEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    return () => {
      window.removeEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    };
  }, []);

  // Agrupa projetos por status
  const statusCount = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const status = item.Status || "Não informado";
      counts[status] = (counts[status] || 0) + 1;
    });
    return statusOrdem.map((status, i) => ({
      status: statusNameMap[status] || status, // Usa o nome mapeado ou o original
      count: counts[status] || 0,
      color: themeColors.chart[i % themeColors.chart.length],
    }));
  }, [data]);

  // Componente para renderizar o label dentro da fatia
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent === 0) return null; // Não renderiza label para 0%
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
        fontSize={fontSizes.labelGraficoRosca}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Ajustar dimensões do gráfico de pizza para maior destaque
  const pieOuterRadius = chartDimensions.pie.outerRadius * 1.35;
  const pieInnerRadius = 0; // Pizza sem buraco no meio

  return (
    <div className="w-full h-full flex-1 flex flex-row items-center justify-center min-h-[260px]">
      {/* Gráfico de pizza maior */}
      <div className="flex-1 flex items-center justify-center min-w-[220px] min-h-[220px] h-full">
        <ResponsiveContainer width="100%" height="90%">
          <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <Pie
              data={statusCount}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={pieOuterRadius}
              innerRadius={pieInnerRadius}
              labelLine={false}
              label={renderCustomizedLabel}
              paddingAngle={2} // Separação entre as fatias
            >
              {statusCount.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: themeColors.cardBg.light,
                border: `1px solid ${themeColors.neutral}`,
                borderRadius: "8px",
                fontSize: fontSizes.tooltipGrafico,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legenda dos status ao lado direito em 2 colunas */}
      <div
        className="flex flex-col flex-wrap justify-center items-start gap-y-2 gap-x-6 ml-6 h-full max-h-full min-w-[180px]"
        style={{ columnCount: 2 }}
      >
        {statusCount.map((entry) => (
          <div
            key={entry.status}
            className="flex items-center gap-2 mb-2 break-inside-avoid-column"
          >
            <span
              className="inline-block w-4 h-2 rounded-sm"
              style={{ background: entry.color }}
            />
            <span
              className={`text-gray-800 dark:text-gray-200 font-medium ${fontSizes.legendaGrafico}`}
            >
              {entry.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjetosPiePorStatus;

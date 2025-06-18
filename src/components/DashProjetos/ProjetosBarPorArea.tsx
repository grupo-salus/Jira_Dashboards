import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Cell,
} from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { themeColors } from "../../utils/themeColors";

interface ProjetosBarPorAreaProps {
  data: EspacoDeProjetos[];
}

const ProjetosBarPorArea: React.FC<ProjetosBarPorAreaProps> = ({ data }) => {
  // Agrupa projetos por área
  const areaCount = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const area = item["Departamento Solicitante"] || "Não informado";
      counts[area] = (counts[area] || 0) + 1;
    });
    return Object.entries(counts).map(([area, count]) => ({ area, count }));
  }, [data]);

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={areaCount}
          layout="vertical"
          margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <XAxis type="number" allowDecimals={false} />
          <YAxis
            dataKey="area"
            type="category"
            width={120}
            tick={({ x, y, payload, index }) => (
              <text
                x={x}
                y={y + 6}
                fill={themeColors.chart[index % themeColors.chart.length]}
                fontSize={12}
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {payload.value}
              </text>
            )}
          />
          <Tooltip />
          <Bar dataKey="count">
            {areaCount.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={themeColors.chart[index % themeColors.chart.length]}
              />
            ))}
            <LabelList dataKey="count" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjetosBarPorArea;

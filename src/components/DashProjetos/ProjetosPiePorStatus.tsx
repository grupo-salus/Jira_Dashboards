import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { themeColors } from "../../utils/themeColors";

interface ProjetosPiePorStatusProps {
  data: EspacoDeProjetos[];
}

const statusOrdem = [
  "Backlog",
  "Bloqueado",
  "Backlog Priorizado",
  "Cancelado",
  "Em andamento",
  "ENCERRAMENTO",
  "Concluído",
];

const ProjetosPiePorStatus: React.FC<ProjetosPiePorStatusProps> = ({
  data,
}) => {
  // Agrupa projetos por status
  const statusCount = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const status = item.Status || "Não informado";
      counts[status] = (counts[status] || 0) + 1;
    });
    return statusOrdem.map((status, i) => ({
      status,
      count: counts[status] || 0,
      color: themeColors.chart[i % themeColors.chart.length],
    }));
  }, [data]);

  return (
    <div className="w-full h-full flex-1 flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-full flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <Pie
              data={statusCount}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {statusCount.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legenda dos status abaixo do gráfico */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 w-full">
        {statusCount.map((entry) => (
          <div key={entry.status} className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-2 rounded-sm"
              style={{ background: entry.color }}
            />
            <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">
              {entry.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjetosPiePorStatus;

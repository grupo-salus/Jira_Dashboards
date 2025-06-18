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
    <div
      className="w-full flex flex-row items-center justify-center gap-4 md:gap-8"
      style={{ minHeight: 260 }}
    >
      <div className="flex-1 min-w-0" style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
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
      <div className="flex flex-col flex-wrap gap-y-2 max-w-[140px] w-full">
        {statusCount.map((entry, index) => (
          <div
            key={entry.status}
            className="flex items-center gap-2 min-w-0 w-full"
          >
            <span
              className="inline-block w-4 h-2 rounded-sm flex-shrink-0"
              style={{ background: entry.color }}
            />
            <span
              className="text-xs text-gray-800 dark:text-gray-200 font-medium break-words text-left block w-full"
              title={entry.status}
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

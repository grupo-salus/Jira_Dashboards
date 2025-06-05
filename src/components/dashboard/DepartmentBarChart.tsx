import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { chartColors } from "../../utils/colors";
import { DepartmentInfo } from "../../types/backlog";

interface DepartmentBarChartProps {
  departments: Record<string, DepartmentInfo>;
}

// Prepara os dados para o gráfico
function prepareChartData(departments: Record<string, DepartmentInfo>) {
  return Object.entries(departments).map(([dep, info], idx) => ({
    departamento: dep.toLowerCase(),
    projetos: info.total_projetos,
    cards: info.projetos.reduce((acc, p) => acc + p.total_cards, 0),
    label: `${info.total_projetos} proj / ${info.projetos.reduce(
      (acc, p) => acc + p.total_cards,
      0
    )} cards`,
    color: chartColors[idx % chartColors.length],
  }));
}

const DepartmentBarChart: React.FC<DepartmentBarChartProps> = ({
  departments,
}) => {
  const data = prepareChartData(departments);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
      <h2 className="text-lg font-semibold mb-2 md:mb-4 text-primary-700 dark:text-primary-300">
        Projetos e Cards por Departamento
      </h2>
      <ResponsiveContainer
        width="100%"
        height={Math.max(40 * data.length, 120)}
        minWidth={220}
        minHeight={120}
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          barCategoryGap={8}
        >
          <XAxis type="number" hide tick={false} />
          <YAxis
            dataKey="departamento"
            type="category"
            width={90}
            tick={{ fontSize: 12, fill: "var(--color-primary-700, #1d4ed8)" }}
          />
          <Tooltip
            formatter={(value: number) => value.toLocaleString()}
            labelFormatter={() => ""}
          />
          <Bar dataKey="cards" barSize={18} radius={[8, 8, 8, 8]}>
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
            <LabelList
              dataKey="label"
              position="right"
              style={{ fontSize: 12, fill: "#2563EB" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentBarChart;

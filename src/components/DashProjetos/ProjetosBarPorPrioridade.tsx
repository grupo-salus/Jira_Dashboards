import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getPriorityConfig } from "../../constants/priorities";
import { themeColors } from "../../utils/themeColors";

interface ProjetosBarPorPrioridadeProps {
  data: EspacoDeProjetos[];
}

const prioridadeOrdem = ["Muito Alta", "Alta", "Média", "Baixa", "Mínima"];

// Cores específicas para cada prioridade
const prioridadeCores = {
  "Muito Alta": themeColors.error, // Vermelho para prioridade muito alta
  Alta: themeColors.warning, // Amarelo para prioridade alta
  Média: themeColors.primary[500], // Azul para prioridade média
  Baixa: themeColors.success, // Verde para prioridade baixa
  Mínima: themeColors.neutral, // Cinza para prioridade mínima
};

const ProjetosBarPorPrioridade: React.FC<ProjetosBarPorPrioridadeProps> = ({
  data,
}) => {
  // Agrupa projetos por prioridade traduzida
  const prioridadeCount = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const prioridade = getPriorityConfig(item.Prioridade || "").label;
      counts[prioridade] = (counts[prioridade] || 0) + 1;
    });
    return prioridadeOrdem.map((prioridade) => ({
      prioridade,
      count: counts[prioridade] || 0,
    }));
  }, [data]);

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={prioridadeCount}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <XAxis
            dataKey="prioridade"
            fontSize={12}
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y + 20}
                fill={
                  prioridadeCores[
                    payload.value as keyof typeof prioridadeCores
                  ] || themeColors.gray
                }
                fontSize={12}
                textAnchor="middle"
                fontWeight="500"
              >
                {payload.value}
              </text>
            )}
            axisLine={{ stroke: themeColors.neutral }}
            tickLine={{ stroke: themeColors.neutral }}
          />
          <YAxis
            fontSize={12}
            tick={{ fill: themeColors.gray }}
            axisLine={{ stroke: themeColors.neutral }}
            tickLine={{ stroke: themeColors.neutral }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.cardBg.light,
              border: `1px solid ${themeColors.neutral}`,
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {prioridadeCount.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  prioridadeCores[
                    entry.prioridade as keyof typeof prioridadeCores
                  ] || themeColors.primary[600]
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjetosBarPorPrioridade;

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getPriorityConfig } from "../../constants/priorities";
import { themeColors } from "../../utils/themeColors";

interface ProjetosRadarPorPrioridadeProps {
  data: EspacoDeProjetos[];
}

const prioridadeOrdem = [
  "Muito Alta",
  "Alta",
  "Média",
  "Baixa",
  "Mínima",
  "Não definida",
];

const corRadar = themeColors.error;

const ProjetosRadarPorPrioridade: React.FC<ProjetosRadarPorPrioridadeProps> = ({
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
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={prioridadeCount} outerRadius={90}>
          <PolarGrid />
          <PolarAngleAxis dataKey="prioridade" fontSize={12} />
          <PolarRadiusAxis angle={30} domain={[0, "dataMax"]} />
          <Tooltip />
          <Radar
            name="Projetos"
            dataKey="count"
            stroke={corRadar}
            fill={corRadar}
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjetosRadarPorPrioridade;

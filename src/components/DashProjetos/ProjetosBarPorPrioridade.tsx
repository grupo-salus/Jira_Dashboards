import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getPriorityConfig } from "../../constants/priorities";
import { themeColors } from "../../utils/themeColors";
import { getFontSizes } from "../../constants/styleConfig";
import TooltipProjetos from "./TooltipProjetos";

interface ProjetosBarPorPrioridadeProps {
  data: EspacoDeProjetos[];
  onPrioridadeClick?: (prioridade: string) => void;
}

const prioridadeOrdem = [
  { value: "Highest", label: "Muito Alta" },
  { value: "High", label: "Alta" },
  { value: "Medium", label: "Média" },
  { value: "Low", label: "Baixa" },
  { value: "Lowest", label: "Mínima" },
];

// Cores específicas para cada prioridade
const prioridadeCores = {
  "Muito Alta": themeColors.error, // Vermelho para prioridade muito alta
  Alta: themeColors.warning, // Amarelo para prioridade alta
  Média: themeColors.primary[500], // Azul para prioridade média
  Baixa: themeColors.success, // Verde para prioridade baixa
  Mínima: themeColors.neutral, // Cinza para prioridade mínima
};

const CustomTooltip = ({ active, payload, label, projetosData }: any) => {
  if (active && payload && payload.length && projetosData) {
    const prioridade = label;
    const projetos = projetosData.filter((item: EspacoDeProjetos) => {
      const prioridadeLabel = getPriorityConfig(item.Prioridade || "").label;
      return prioridadeLabel === prioridade;
    });
    return <TooltipProjetos areaLabel={prioridade} projetos={projetos} />;
  }
  return null;
};

const ProjetosBarPorPrioridade: React.FC<ProjetosBarPorPrioridadeProps> = ({
  data,
  onPrioridadeClick,
}) => {
  const [, setForceUpdate] = useState(0);

  // Obter configurações atuais
  const fontSizes = getFontSizes();

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

  // Agrupa projetos por prioridade traduzida
  const prioridadeCount = React.useMemo(() => {
    const counts: Record<string, { label: string; count: number }> = {};
    data.forEach((item) => {
      const value = item.Prioridade || "";
      const label = getPriorityConfig(value).label;
      if (!counts[value]) counts[value] = { label, count: 0 };
      counts[value].count += 1;
    });
    return prioridadeOrdem.map((p) => ({
      value: p.value,
      label: p.label,
      count: counts[p.value]?.count || 0,
    }));
  }, [data]);

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={prioridadeCount}
          margin={{ left: 20, right: 20, top: 25, bottom: 20 }}
          onClick={(e) => {
            if (e && e.activePayload && e.activePayload[0]) {
              const prioridadeValue = e.activePayload[0].payload.value;
              if (onPrioridadeClick) onPrioridadeClick(prioridadeValue);
            }
          }}
        >
          <XAxis
            dataKey="label"
            fontSize={fontSizes.eixoGrafico}
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y + 20}
                fill={
                  prioridadeCores[
                    payload.value as keyof typeof prioridadeCores
                  ] || themeColors.gray
                }
                fontSize={fontSizes.eixoGrafico}
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
            fontSize={fontSizes.eixoGrafico}
            tick={{ fill: themeColors.gray }}
            axisLine={{ stroke: themeColors.neutral }}
            tickLine={{ stroke: themeColors.neutral }}
          />
          <Tooltip
            content={<CustomTooltip projetosData={data} />}
            cursor={false}
            isAnimationActive={false}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} cursor="pointer">
            {prioridadeCount.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  prioridadeCores[
                    entry.label as keyof typeof prioridadeCores
                  ] || themeColors.primary[600]
                }
              />
            ))}
            <LabelList dataKey="count" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjetosBarPorPrioridade;

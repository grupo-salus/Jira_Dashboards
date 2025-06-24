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
          margin={{ left: 20, right: 20, top: 25, bottom: 20 }}
        >
          <XAxis
            dataKey="prioridade"
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
            contentStyle={{
              backgroundColor: themeColors.cardBg.light,
              border: `1px solid ${themeColors.neutral}`,
              borderRadius: "8px",
              fontSize: fontSizes.tooltipGrafico,
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
            <LabelList dataKey="count" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjetosBarPorPrioridade;

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
import { getPriorityConfig } from "../../utils/themeColors";
import { themeColors } from "../../utils/themeColors";
import { getFontSizes } from "../../constants/styleConfig";
import TooltipProjetos from "./TooltipProjetos";

interface ProjetosBarPorPrioridadeProps {
  data: EspacoDeProjetos[];
  onPrioridadeClick?: (prioridade: string) => void;
}

const prioridadeOrdem = [
  { value: "Estratégica", label: "Estratégica" },
  { value: "Alta", label: "Alta" },
  { value: "Média", label: "Média" },
  { value: "Baixa", label: "Baixa" },
  { value: "Baixíssima", label: "Baixíssima" },
];

// Cores específicas para cada prioridade usando o sistema centralizado
const prioridadeCores = {
  Estratégica: themeColors.components.prioridades.estrategica.hex,
  Alta: themeColors.components.prioridades.alta.hex,
  Média: themeColors.components.prioridades.media.hex,
  Baixa: themeColors.components.prioridades.baixa.hex,
  Baixíssima: themeColors.components.prioridades.muitoBaixa.hex,
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

const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const text = payload.value;
  const maxCharsPerLine = 12;
  const words = text.split(" ");
  let lines: string[] = [];
  let currentLine = "";
  words.forEach((word: string) => {
    if ((currentLine + " " + word).length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    }
  });
  lines.push(currentLine);
  // Definir cor da prioridade
  const cor =
    prioridadeCores[text as keyof typeof prioridadeCores] ||
    themeColors.primary[600];
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={20}
        textAnchor="middle"
        fill={cor}
        fontSize={getFontSizes().eixoGrafico}
        fontWeight="bold"
      >
        {lines.map((line, index) => (
          <tspan
            x={0}
            dy={index === 0 ? 0 : getFontSizes().eixoGrafico}
            key={index}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

const ProjetosBarPorPrioridade: React.FC<ProjetosBarPorPrioridadeProps> = ({
  data,
  onPrioridadeClick,
}) => {
  // Obter configurações atuais
  const fontSizes = getFontSizes();

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
            type="category"
            tick={<CustomXAxisTick />}
            interval={0}
            axisLine={{ stroke: themeColors.secondary[400] }}
            tickLine={{ stroke: themeColors.secondary[400] }}
          />
          <YAxis
            fontSize={fontSizes.eixoGrafico}
            tick={{ fill: themeColors.secondary[500] }}
            axisLine={{ stroke: themeColors.secondary[400] }}
            tickLine={{ stroke: themeColors.secondary[400] }}
          />
          <Tooltip
            content={<CustomTooltip projetosData={data} />}
            cursor={false}
            isAnimationActive={false}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} cursor="pointer">
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

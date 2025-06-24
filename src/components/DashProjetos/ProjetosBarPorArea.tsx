import React, { useState, useEffect } from "react";
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
import { EspacoDeProjetos } from "../../types/Typesjira";
import { themeColors } from "../../utils/themeColors";
import { getFontSizes } from "../../constants/styleConfig";

interface ProjetosBarPorAreaProps {
  data: EspacoDeProjetos[];
}

const ProjetosBarPorArea: React.FC<ProjetosBarPorAreaProps> = ({ data }) => {
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

  // Listener para mudanças de tema (dark/light)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setForceUpdate((prev) => prev + 1);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Componente customizado para o tick do eixo Y com quebra de linha

  // Componente customizado para o tick do eixo X com quebra de linha, centralizado e colorido
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const text = payload.value;
    // Largura máxima para cada linha antes da quebra
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

    // Descobrir a cor da barra correspondente
    const areaIndex = areaCountFiltered.findIndex((a) => a.area === text);
    const color = themeColors.chart[areaIndex % themeColors.chart.length];

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={20} // margin para afastar do gráfico
          textAnchor="middle"
          fill={color}
          fontSize={fontSizes.eixoGrafico}
          fontWeight="bold"
        >
          {lines.map((line, index) => (
            <tspan
              x={0}
              dy={index === 0 ? 0 : fontSizes.eixoGrafico}
              key={index}
            >
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

  // Agrupa projetos por área
  const areaCount = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const area = item["Departamento Solicitante"] || "Não informado";
      counts[area] = (counts[area] || 0) + 1;
    });
    return Object.entries(counts).map(([area, count]) => ({ area, count }));
  }, [data]);

  // Filtrar "Não informado" das barras
  const areaCountFiltered = areaCount.filter((a) => a.area !== "Não informado");

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={areaCountFiltered}
          margin={{ left: 20, right: 20, top: 25, bottom: 20 }}
        >
          <XAxis
            dataKey="area"
            type="category"
            tick={<CustomXAxisTick />}
            interval={0}
          />
          <YAxis type="number" allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.cardBg.light,
              border: `1px solid ${themeColors.neutral}`,
              borderRadius: "8px",
              fontSize: fontSizes.tooltipGrafico,
            }}
          />
          <Bar dataKey="count">
            {areaCountFiltered.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={themeColors.chart[index % themeColors.chart.length]}
              />
            ))}
            <LabelList dataKey="count" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjetosBarPorArea;

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
  const [forceUpdate, setForceUpdate] = useState(0);

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
  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const text = payload.value;
    // Largura máxima para cada linha antes da quebra
    const maxCharsPerLine = 15;
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

    // Função para determinar a cor do texto baseada no tema
    const getTextColor = () => {
      const isDark = document.documentElement.classList.contains("dark");
      return isDark ? "#ffffff" : "#111827";
    };

    // Ajusta a posição vertical para centralizar o texto multi-linha
    const yOffset = (lines.length - 1) * (fontSizes.eixoGrafico / 2);

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={-yOffset}
          textAnchor="end"
          fill={getTextColor()}
          fontSize={fontSizes.eixoGrafico}
          fontWeight="500"
        >
          {lines.map((line, index) => (
            <tspan x={0} dy={index > 0 ? fontSizes.eixoGrafico : 0} key={index}>
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

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={areaCount}
          layout="vertical"
          margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
        >
          <XAxis type="number" allowDecimals={false} />
          <YAxis
            dataKey="area"
            type="category"
            width={150} // Aumentado para dar espaço para a quebra de linha
            tick={<CustomYAxisTick />}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.cardBg.light,
              border: `1px solid ${themeColors.neutral}`,
              borderRadius: "8px",
              fontSize: fontSizes.tooltipGrafico,
            }}
          />
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

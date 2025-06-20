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

interface CargaDeTrabalhoPorResponsavelProps {
  data: EspacoDeProjetos[];
}

const CargaDeTrabalhoPorResponsavel: React.FC<
  CargaDeTrabalhoPorResponsavelProps
> = ({ data }) => {
  const [forceUpdate, setForceUpdate] = useState(0);

  const fontSizes = getFontSizes();

  useEffect(() => {
    const handleTamanhoChange = () => {
      setForceUpdate((prev) => prev + 1);
    };

    window.addEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    return () => {
      window.removeEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    };
  }, []);

  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const text = payload.value;
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

    const getTextColor = () => {
      const isDark = document.documentElement.classList.contains("dark");
      return isDark ? "#ffffff" : "#111827";
    };

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

  const responsavelCount = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const responsavel = item["Responsável"] || "Não atribuído";
      counts[responsavel] = (counts[responsavel] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([responsavel, count]) => ({ responsavel, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={responsavelCount}
          layout="vertical"
          margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
        >
          <XAxis type="number" allowDecimals={false} />
          <YAxis
            dataKey="responsavel"
            type="category"
            width={150}
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
            {responsavelCount.map((entry, index) => (
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

export default CargaDeTrabalhoPorResponsavel;

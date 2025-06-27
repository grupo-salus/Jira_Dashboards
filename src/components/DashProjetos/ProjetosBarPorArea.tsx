import React, { useEffect } from "react";
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
import {
  themeColors,
  getTextColor,
  getAreaConfig,
} from "../../utils/themeColors";
import { getFontSizes } from "../../constants/styleConfig";
import TooltipProjetos from "./TooltipProjetos";

// Tooltip customizado para mostrar apenas os títulos dos projetos da área ao passar o mouse
const CustomTooltip = ({ active, payload, label, projetosData }: any) => {
  if (active && payload && payload.length && projetosData) {
    const area = label;
    const projetos = projetosData.filter(
      (item: EspacoDeProjetos) =>
        (item["Departamento Solicitante"] || "Não informado") === area
    );
    return <TooltipProjetos areaLabel={area} projetos={projetos} />;
  }
  return null;
};

interface ProjetosBarPorAreaProps {
  data: EspacoDeProjetos[];
  onAreaClick?: (area: string) => void;
}

const ProjetosBarPorArea: React.FC<ProjetosBarPorAreaProps> = ({
  data,
  onAreaClick,
}) => {
  // Obter configurações atuais
  const fontSizes = getFontSizes();

  // Hook para detectar o tema atual
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">(
    "light"
  );

  React.useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setCurrentTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Componente customizado para o tick do eixo X com quebra de linha, centralizado e usando tema light/dark
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

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={20} // margin para afastar do gráfico
          textAnchor="middle"
          fill={getTextColor("primary", currentTheme)}
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
          <YAxis
            type="number"
            allowDecimals={false}
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
          <Bar
            dataKey="count"
            onClick={(data) => {
              if (onAreaClick && data && data.area) {
                onAreaClick(data.area);
              }
            }}
            cursor="pointer"
            radius={[8, 8, 0, 0]}
          >
            {areaCountFiltered.map((item) => (
              <Cell
                key={`cell-${item.area}`}
                fill={getAreaConfig(item.area).hex}
                cursor="pointer"
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

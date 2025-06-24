import React, { useEffect } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { themeColors } from "../../utils/themeColors";
import { getFontSizes } from "../../constants/styleConfig";

interface AnaliseDemandasPorCategoriaProps {
  data: EspacoDeProjetos[];
}

const AnaliseDemandasPorCategoria: React.FC<
  AnaliseDemandasPorCategoriaProps
> = ({ data }) => {
  const fontSizes = getFontSizes();

  useEffect(() => {
    const handleTamanhoChange = () => {
      // Nenhuma ação necessária, pois forceUpdate foi removido
    };

    window.addEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    return () => {
      window.removeEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    };
  }, []);

  const countByCategoria = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const categoria = item["Categoria"];
      if (categoria && categoria !== "Não informada") {
        const categoriaLower = categoria.toLowerCase();
        const categoriaCapitalized =
          categoriaLower.charAt(0).toUpperCase() + categoriaLower.slice(1);
        counts[categoriaCapitalized] = (counts[categoriaCapitalized] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([categoria, count]) => ({ categoria, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const radarData = React.useMemo(() => {
    return countByCategoria.map((cat) => ({
      categoria: cat.categoria,
      count: cat.count,
    }));
  }, [countByCategoria]);

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} outerRadius="165%">
          <PolarGrid />
          <PolarAngleAxis
            dataKey="categoria"
            tick={({ payload, x, y, textAnchor }) => {
              const idx = countByCategoria.findIndex(
                (cat) => cat.categoria === payload.value
              );
              const color =
                idx >= 0
                  ? themeColors.chart[idx % themeColors.chart.length]
                  : "#000";
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  fill={color}
                  fontSize={13}
                  fontWeight="bold"
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, Math.max(...countByCategoria.map((c) => c.count), 1)]}
            tickCount={6}
            tick={{ fill: "#10B981", fontSize: 18, fontWeight: "bold" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.cardBg.light,
              border: `1px solid ${themeColors.neutral}`,
              borderRadius: "8px",
              fontSize: fontSizes.tooltipGrafico,
            }}
          />
          {countByCategoria.map((cat) => (
            <Radar
              key={cat.categoria}
              name={cat.categoria}
              dataKey="count"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
              label={({ value }: { value: number }) => (value > 0 ? value : "")}
            >
              <LabelList dataKey="count" position="top" />
            </Radar>
          ))}
          <Legend
            content={() => (
              <div className="flex flex-col gap-2 mt-4">
                {countByCategoria.map((cat, idx) => (
                  <div key={cat.categoria} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{
                        backgroundColor:
                          themeColors.chart[idx % themeColors.chart.length],
                      }}
                    />
                    <span className="text-xs font-medium">
                      {cat.categoria}:{" "}
                      <span className="font-bold text-green-600 text-xs">
                        {cat.count}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnaliseDemandasPorCategoria;

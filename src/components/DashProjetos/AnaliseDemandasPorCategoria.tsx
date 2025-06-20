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

interface AnaliseDemandasPorCategoriaProps {
  data: EspacoDeProjetos[];
}

const AnaliseDemandasPorCategoria: React.FC<
  AnaliseDemandasPorCategoriaProps
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

  const countByCategoria = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const categoria = item["Categoria"] || "Não informada";
      counts[categoria] = (counts[categoria] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([categoria, count]) => ({ categoria, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={countByCategoria}
          layout="vertical"
          margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
        >
          <XAxis type="number" allowDecimals={false} />
          <YAxis
            dataKey="categoria"
            type="category"
            width={150}
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
            {countByCategoria.map((entry, index) => (
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

export default AnaliseDemandasPorCategoria;

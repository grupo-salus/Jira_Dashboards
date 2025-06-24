import React, { useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

  const pieData = React.useMemo(() => {
    return countByCategoria.map((cat) => ({
      name: cat.categoria,
      value: cat.count,
    }));
  }, [countByCategoria]);

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center min-h-[250px] min-w-[250px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minHeight={250}
        minWidth={250}
      >
        <PieChart width={400} height={400}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={"70%"}
            label={({ name, value }) => `${name}: ${value}`}
            isAnimationActive={false}
          >
            {pieData.map((entry, idx) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={themeColors.chart[idx % themeColors.chart.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.cardBg.light,
              border: `1px solid ${themeColors.neutral}`,
              borderRadius: "8px",
              fontSize: fontSizes.tooltipGrafico,
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ marginBottom: 15 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnaliseDemandasPorCategoria;

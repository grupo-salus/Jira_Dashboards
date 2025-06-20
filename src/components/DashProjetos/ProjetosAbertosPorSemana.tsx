import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { themeColors } from "../../utils/themeColors";
import { getFontSizes } from "../../constants/styleConfig";
import { startOfWeek, format } from "date-fns";

interface ProjetosAbertosPorSemanaProps {
  data: EspacoDeProjetos[];
}

const ProjetosAbertosPorSemana: React.FC<ProjetosAbertosPorSemanaProps> = ({
  data,
}) => {
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

  const projectsByWeek = React.useMemo(() => {
    const counts: Record<string, number> = {};

    data.forEach((item) => {
      const creationDate = new Date(item["Data de criação"]);
      const weekStartDate = startOfWeek(creationDate, { weekStartsOn: 1 });
      const weekKey = format(weekStartDate, "yyyy-MM-dd");

      counts[weekKey] = (counts[weekKey] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime())
      .map((item) => ({
        ...item,
        week: format(new Date(item.week), "dd/MM"),
      }));
  }, [data]);

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={projectsByWeek}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.cardBg.light,
              border: `1px solid ${themeColors.neutral}`,
              borderRadius: "8px",
              fontSize: fontSizes.tooltipGrafico,
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={themeColors.chart[0]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjetosAbertosPorSemana;

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

interface IdeacoesPorTempoDeEsperaProps {
  data: EspacoDeProjetos[];
}

const IdeacoesPorTempoDeEspera: React.FC<IdeacoesPorTempoDeEsperaProps> = ({
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

  const ideationTimeCount = React.useMemo(() => {
    const counts = {
      "0-7 dias": 0,
      "8-30 dias": 0,
      "Mais de 30 dias": 0,
    };

    data.forEach((item) => {
      if (item.Status === "Backlog" || item.Status === "Backlog Priorizado") {
        const dias = item["Dias desde criação"];
        if (dias !== null && dias !== undefined) {
          if (dias <= 7) {
            counts["0-7 dias"]++;
          } else if (dias <= 30) {
            counts["8-30 dias"]++;
          } else {
            counts["Mais de 30 dias"]++;
          }
        }
      }
    });

    return [
      { range: "0-7 dias", count: counts["0-7 dias"] },
      { range: "8-30 dias", count: counts["8-30 dias"] },
      { range: "Mais de 30 dias", count: counts["Mais de 30 dias"] },
    ];
  }, [data]);

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={ideationTimeCount}
          layout="horizontal"
          margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
        >
          <XAxis dataKey="range" type="category" />
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
            {ideationTimeCount.map((entry, index) => (
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

export default IdeacoesPorTempoDeEspera;

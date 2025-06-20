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
import { formatCurrency } from "../../utils/formatters";

interface InvestimentoPorAreaProps {
  data: EspacoDeProjetos[];
}

const InvestimentoPorArea: React.FC<InvestimentoPorAreaProps> = ({ data }) => {
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

  const parseCurrency = (value: string | number | null): number => {
    if (!value) return 0;

    // Se já for um número, retorna diretamente
    if (typeof value === "number") return value;

    // Se for string, faz o parsing
    if (typeof value === "string") {
      return parseFloat(
        value.replace("R$", "").trim().replace(/\./g, "").replace(",", ".")
      );
    }

    return 0;
  };

  const investmentByArea = React.useMemo(() => {
    const sums: Record<string, number> = {};
    data.forEach((item) => {
      const area = item["Departamento Solicitante"] || "Não informado";
      const investment = parseCurrency(item["Investimento Esperado"]);
      sums[area] = (sums[area] || 0) + investment;
    });

    return Object.entries(sums)
      .map(([area, investimento]) => ({ area, investimento }))
      .sort((a, b) => b.investimento - a.investimento);
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-2 rounded-lg shadow-lg"
          style={{
            backgroundColor: themeColors.cardBg.light,
            border: `1px solid ${themeColors.neutral}`,
          }}
        >
          <p className="label font-semibold">{`${label}`}</p>
          <p className="intro" style={{ color: payload[0].color }}>
            {`Investimento: ${formatCurrency(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={investmentByArea}
          layout="vertical"
          margin={{ left: 40, right: 40, top: 20, bottom: 20 }}
        >
          <XAxis
            type="number"
            tickFormatter={(value) => formatCurrency(value, true)}
          />
          <YAxis
            dataKey="area"
            type="category"
            width={150}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="investimento">
            {investmentByArea.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={themeColors.chart[index % themeColors.chart.length]}
              />
            ))}
            <LabelList
              dataKey="investimento"
              position="right"
              formatter={(value: number) => formatCurrency(value, true)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestimentoPorArea;

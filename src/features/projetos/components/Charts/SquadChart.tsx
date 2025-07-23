import { Users } from "lucide-react";
import { BaseChart } from "./BaseChart";
import { useTheme } from "@/shared/context/ThemeContext";

interface SquadChartProps {
  projetos: unknown[];
}

export const SquadChart = (_props: SquadChartProps) => {
  const { theme } = useTheme();

  return (
    <BaseChart title="Distribuição por Squad" icon={<Users size={20} />}>
      <div className="text-center" style={{ color: theme.text.subtitle }}>
        <p className="text-lg mb-2">Gráfico de Distribuição por Squad</p>
        <p className="text-sm">Será implementado com biblioteca de gráficos</p>
      </div>
    </BaseChart>
  );
};

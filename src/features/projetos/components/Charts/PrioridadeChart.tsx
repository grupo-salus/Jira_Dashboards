import { AlertTriangle } from "lucide-react";
import { BaseChart } from "./BaseChart";
import { useTheme } from "@/shared/context/ThemeContext";

interface PrioridadeChartProps {
  projetos: unknown[];
}

export const PrioridadeChart = (_props: PrioridadeChartProps) => {
  const { theme } = useTheme();

  return (
    <BaseChart
      title="Prioridade dos Projetos"
      icon={<AlertTriangle size={20} />}
    >
      <div className="text-center" style={{ color: theme.text.subtitle }}>
        <p className="text-lg mb-2">Gráfico de Prioridades</p>
        <p className="text-sm">Será implementado com biblioteca de gráficos</p>
      </div>
    </BaseChart>
  );
};

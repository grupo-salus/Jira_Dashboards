import { AlertTriangle } from "lucide-react";
import { BaseChart } from "./BaseChart";
import { useTheme } from "@/shared/context/ThemeContext";

interface PrioridadeChartProps {
  projetos: any[];
}

export const PrioridadeChart = ({ projetos }: PrioridadeChartProps) => {
  const { theme } = useTheme();

  return (
    <BaseChart
      title="Distribuição por Prioridade"
      icon={<AlertTriangle size={20} />}
    >
      <div className="text-center" style={{ color: theme.text.subtitle }}>
        <p className="text-lg mb-2">Gráfico de Prioridades</p>
        <p className="text-sm">Será implementado com biblioteca de gráficos</p>
      </div>
    </BaseChart>
  );
};

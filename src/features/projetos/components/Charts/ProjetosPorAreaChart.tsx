import { Building2 } from "lucide-react";
import { BaseChart } from "./BaseChart";
import { useTheme } from "@/shared/context/ThemeContext";

interface ProjetosPorAreaChartProps {
  projetos: any[];
}

export const ProjetosPorAreaChart = ({ projetos }: ProjetosPorAreaChartProps) => {
  const { theme } = useTheme();

  return (
    <BaseChart title="Projetos por Área" icon={<Building2 size={20} />}>
      <div className="text-center" style={{ color: theme.text.subtitle }}>
        <p className="text-lg mb-2">Gráfico de Projetos por Área</p>
        <p className="text-sm">Será implementado com biblioteca de gráficos</p>
      </div>
    </BaseChart>
  );
};

import { AlertTriangle } from "lucide-react";
import { BaseTotalizador } from "./BaseTotalizador";

interface TotalizadorProjetosAtrasadosProps {
  count: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const TotalizadorProjetosAtrasados = ({
  count,
  trend,
}: TotalizadorProjetosAtrasadosProps) => {
  return (
    <BaseTotalizador
      title="Projetos Atrasados"
      value={count}
      icon={<AlertTriangle size={24} />}
      trend={trend}
      color="#ef4444"
    />
  );
};

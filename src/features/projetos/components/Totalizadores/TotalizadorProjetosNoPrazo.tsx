import { CheckCircle } from "lucide-react";
import { BaseTotalizador } from "./BaseTotalizador";

interface TotalizadorProjetosNoPrazoProps {
  count: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const TotalizadorProjetosNoPrazo = ({
  count,
  trend,
}: TotalizadorProjetosNoPrazoProps) => {
  return (
    <BaseTotalizador
      title="Projetos no Prazo"
      value={count}
      icon={<CheckCircle size={24} />}
      trend={trend}
      color="#10b981"
    />
  );
};

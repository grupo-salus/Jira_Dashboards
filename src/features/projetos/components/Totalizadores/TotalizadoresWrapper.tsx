import { useTheme } from "@/shared/context/ThemeContext";
import { BarChart3 } from "lucide-react";
import { TotalizadorProjetosNoPrazo } from "./TotalizadorProjetosNoPrazo";
import { TotalizadorProjetosAtrasados } from "./TotalizadorProjetosAtrasados";
import { BaseTotalizador } from "./BaseTotalizador";

interface TotalizadoresWrapperProps {
  projetosNoPrazo: number;
  projetosAtrasados: number;
  totalProjetos: number;
  projetosEmAndamento: number;
}

export const TotalizadoresWrapper = ({
  projetosNoPrazo,
  projetosAtrasados,
  totalProjetos,
  projetosEmAndamento,
}: TotalizadoresWrapperProps) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 size={20} style={{ color: theme.text.title }} />
        <h2
          className="text-xl font-semibold"
          style={{ color: theme.text.title }}
        >
          Resumo dos Projetos
        </h2>
      </div>

      {/* Grid de Totalizadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TotalizadorProjetosNoPrazo
          count={projetosNoPrazo}
          trend={{ value: 12, isPositive: true }}
        />
        <TotalizadorProjetosAtrasados
          count={projetosAtrasados}
          trend={{ value: 5, isPositive: false }}
        />
        <BaseTotalizador
          title="Total de Projetos"
          value={totalProjetos}
          icon={<BarChart3 size={24} />}
          color="#3b82f6"
        />
        <BaseTotalizador
          title="Em Andamento"
          value={projetosEmAndamento}
          icon={<BarChart3 size={24} />}
          color="#f59e0b"
        />
      </div>
    </div>
  );
};
 
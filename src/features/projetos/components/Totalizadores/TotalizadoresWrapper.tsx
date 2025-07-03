import { useTheme } from "@/shared/context/ThemeContext";
import { BarChart3 } from "lucide-react";
import { TotalizadorProjetosNoPrazo } from "./TotalizadorProjetosNoPrazo";
import { TotalizadorProjetosAtrasados } from "./TotalizadorProjetosAtrasados";
import { TotalizadorTotalProjetos } from "./TotalizadorTotalProjetos";
import { TotalizadorProjetosIdeacao } from "./TotalizadorProjetosIdeacao";
import { TotalizadorProjetosAndamento } from "./TotalizadorProjetosAndamento";
import { TotalizadorProjetosBacklog } from "./TotalizadorProjetosBacklog";
import { TotalizadorProjetosEntreguesMes } from "./TotalizadorProjetosEntreguesMes";
import { TotalizadorProjetosEmRisco } from "./TotalizadorProjetosEmRisco";
import { BaseTotalizador } from "./BaseTotalizador";

interface Props {
  projetosNoPrazo: number;
  projetosAtrasados: number;
  totalProjetos: number;
  projetosEmAndamento: number;
  projetosIdeacao: number;
  projetosBacklog: number;
  projetosEntreguesMes: number;
  projetosEmRisco: number;
}

export const TotalizadoresWrapper = ({
  projetosNoPrazo,
  projetosAtrasados,
  totalProjetos,
  projetosEmAndamento,
  projetosIdeacao,
  projetosBacklog,
  projetosEntreguesMes,
  projetosEmRisco,
}: Props) => {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full items-stretch">
        <TotalizadorTotalProjetos valor={totalProjetos} />
        <TotalizadorProjetosIdeacao valor={projetosIdeacao} />
        <TotalizadorProjetosAndamento valor={projetosEmAndamento} />
        <TotalizadorProjetosBacklog valor={projetosBacklog} />
        <TotalizadorProjetosEntreguesMes valor={projetosEntreguesMes} />
        <TotalizadorProjetosNoPrazo valor={projetosNoPrazo} />
        <TotalizadorProjetosEmRisco valor={projetosEmRisco} />
        <TotalizadorProjetosAtrasados valor={projetosAtrasados} />
      </div>
    </div>
  );
};

import { BaseTotalizador } from "./BaseTotalizador";
import { useTheme } from "@/shared/context/ThemeContext";
import { coreColors } from "@/shared/constants/coreColors";
import { AlertTriangle } from "lucide-react";

interface Props {
  valor: number;
}

export const TotalizadorProjetosEmRisco = ({ valor }: Props) => {
  const { theme } = useTheme();
  return (
    <BaseTotalizador
      icon={<AlertTriangle size={20} />}
      titulo="Projetos Em Risco"
      valor={valor}
      corValor={coreColors.prazo.emRisco}
      corIcone={coreColors.prazo.emRisco}
    />
  );
};

import { BaseTotalizador } from "./BaseTotalizador";
import { useTheme } from "@/shared/context/ThemeContext";
import { coreColors } from "@/shared/constants/coreColors";
import { AlertTriangle } from "lucide-react";

interface Props {
  valor: number;
}

export const TotalizadorProjetosAtrasados = ({ valor }: Props) => {
  const { theme } = useTheme();
  return (
    <BaseTotalizador
      icon={<AlertTriangle size={20} />}
      titulo="Projetos Atrasados"
      valor={valor}
      corValor={coreColors.prazo.atrasado}
      corIcone={coreColors.prazo.atrasado}
    />
  );
};

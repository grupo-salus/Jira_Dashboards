import { BaseTotalizador } from "./BaseTotalizador";
import { useTheme } from "@/shared/context/ThemeContext";
import { Clock } from "lucide-react";

interface Props {
  valor: number;
}

export const TotalizadorProjetosBacklog = ({ valor }: Props) => {
  const { theme } = useTheme();
  return (
    <BaseTotalizador
      icon={<Clock size={20} />}
      titulo="Projetos no Backlog Priorizado"
      valor={valor}
      corIcone={theme.brand.primary}
    />
  );
};

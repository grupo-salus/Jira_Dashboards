import { BaseTotalizador } from "./BaseTotalizador";
import { useTheme } from "@/shared/context/ThemeContext";
import { Calendar } from "lucide-react";

interface Props {
  valor: number;
}

export const TotalizadorTotalProjetos = ({ valor }: Props) => {
  const { theme } = useTheme();
  return (
    <BaseTotalizador
      icon={<Calendar size={20} />}
      titulo="Total de Projetos no Board"
      valor={valor}
      corIcone={theme.brand.primary}
    />
  );
};

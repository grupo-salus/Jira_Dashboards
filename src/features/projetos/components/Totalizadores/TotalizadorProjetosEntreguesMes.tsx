import { BaseTotalizador } from "./BaseTotalizador";
import { useTheme } from "@/shared/context/ThemeContext";
import { Calendar } from "lucide-react";

interface Props {
  valor: number;
}

export const TotalizadorProjetosEntreguesMes = ({ valor }: Props) => {
  const { theme } = useTheme();
  return (
    <BaseTotalizador
      icon={<Calendar size={20} />}
      titulo="Projetos Entregues no Mês"
      valor={valor}
      corIcone={theme.brand.primary}
    />
  );
};

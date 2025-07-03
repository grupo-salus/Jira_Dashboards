import { BaseTotalizador } from "./BaseTotalizador";
import { useTheme } from "@/shared/context/ThemeContext";
import { Layers } from "lucide-react";

interface Props {
  valor: number;
}

export const TotalizadorProjetosAndamento = ({ valor }: Props) => {
  const { theme } = useTheme();
  return (
    <BaseTotalizador
      icon={<Layers size={20} />}
      titulo="Projetos em Andamento"
      valor={valor}
      corIcone={theme.brand.primary}
    />
  );
};

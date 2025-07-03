import { BaseTotalizador } from "./BaseTotalizador";
import { useTheme } from "@/shared/context/ThemeContext";
import { MapPin } from "lucide-react";

interface Props {
  valor: number;
}

export const TotalizadorProjetosIdeacao = ({ valor }: Props) => {
  const { theme } = useTheme();
  return (
    <BaseTotalizador
      icon={<MapPin size={20} />}
      titulo="Projetos em Ideação"
      valor={valor}
      corIcone={theme.brand.primary}
    />
  );
};

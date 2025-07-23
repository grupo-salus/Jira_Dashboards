import { BaseTotalizador } from "./BaseTotalizador";
// import { useTheme } from "@/shared/context/ThemeContext";
import { coreColors } from "@/shared/constants/coreColors";
import { CheckCircle } from "lucide-react";

interface Props {
  valor: number;
}

export const TotalizadorProjetosNoPrazo = ({ valor }: Props) => {
  // const { theme } = useTheme();
  return (
    <BaseTotalizador
      icon={<CheckCircle size={20} />}
      titulo="Projetos No Prazo"
      valor={valor}
      corValor={coreColors.prazo.dentroDoPrazo}
      corIcone={coreColors.prazo.dentroDoPrazo}
    />
  );
};

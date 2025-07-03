import { coreColors } from "@/shared/constants/coreColors";

export function usePrioridadeColor() {
  return (prioridade: string): string => {
    switch (prioridade?.toLowerCase()) {
      case "estratégica":
      case "muito alta":
        return coreColors.prioridade.muitoAlta;
      case "crítica":
      case "alta":
        return coreColors.prioridade.alta;
      case "média":
        return coreColors.prioridade.media;
      case "baixa":
        return coreColors.prioridade.baixa;
      case "muito baixa":
        return coreColors.prioridade.muitoBaixa;
      default:
        return coreColors.prioridade.media;
    }
  };
}

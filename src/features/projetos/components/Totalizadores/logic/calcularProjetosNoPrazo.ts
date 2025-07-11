import { EspacoDeProjetos } from "@/types/Typesjira";

export function calcularProjetosNoPrazo(projetos: EspacoDeProjetos[]): number {
  return projetos.filter((p) => p["Status de prazo"] === "No prazo").length;
}

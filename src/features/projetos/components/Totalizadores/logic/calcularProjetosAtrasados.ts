import { EspacoDeProjetos } from "@/types/Typesjira";

export function calcularProjetosAtrasados(
  projetos: EspacoDeProjetos[]
): number {
  return projetos.filter((p) => p["Status de prazo"] === "Atrasado").length;
}

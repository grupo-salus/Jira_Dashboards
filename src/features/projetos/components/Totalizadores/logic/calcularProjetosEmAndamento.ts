import { EspacoDeProjetos } from "@/types/Typesjira";

export function calcularProjetosEmAndamento(
  projetos: EspacoDeProjetos[]
): number {
  return projetos.filter((p) => p.Status === "Em Andamento").length;
}

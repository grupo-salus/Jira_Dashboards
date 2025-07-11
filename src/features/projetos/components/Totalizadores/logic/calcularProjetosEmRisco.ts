import { EspacoDeProjetos } from "@/types/Typesjira";

export function calcularProjetosEmRisco(projetos: EspacoDeProjetos[]): number {
  return projetos.filter((p) => p["Status de prazo"] === "Em risco").length;
}

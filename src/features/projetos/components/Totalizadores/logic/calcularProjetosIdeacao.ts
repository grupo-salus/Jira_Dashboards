import { EspacoDeProjetos } from "@/types/Typesjira";

export function calcularProjetosIdeacao(projetos: EspacoDeProjetos[]): number {
  return projetos.filter(
    (p) =>
      p["Status de ideação"] === "Recente" || p["Status de ideação"] === "Rever"
  ).length;
}

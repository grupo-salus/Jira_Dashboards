import { EspacoDeProjetos } from "../../../types/index";

export function calcularProjetosNoPrazo(projetos: EspacoDeProjetos[]): number {
  return projetos.filter((p) => p["Status de prazo"] === "No prazo").length;
}

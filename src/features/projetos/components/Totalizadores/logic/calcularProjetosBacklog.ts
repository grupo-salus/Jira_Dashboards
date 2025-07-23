import { EspacoDeProjetos } from "../../../types/index";

export function calcularProjetosBacklog(projetos: EspacoDeProjetos[]): number {
  return projetos.filter((p) => p.Status === "Backlog Priorizado").length;
}

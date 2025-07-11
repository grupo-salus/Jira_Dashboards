import { EspacoDeProjetos } from "@/types/Typesjira";

export function calcularProjetosEntreguesMes(
  projetos: EspacoDeProjetos[]
): number {
  return projetos.filter((p) => {
    if (!p["Data de término"]) return false;
    const data = new Date(p["Data de término"]);
    const agora = new Date();
    return (
      data.getMonth() === agora.getMonth() &&
      data.getFullYear() === agora.getFullYear()
    );
  }).length;
}

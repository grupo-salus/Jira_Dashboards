import { EspacoDeProjetos } from "../../../types/index";

export interface ProjetoProcessado {
  id: string;
  titulo: string;
  grupo: string;
  responsavel: string;
  prioridade: string;
  posicao: number;
}

export interface ResponsavelProcessado {
  nome: string;
  projetos: ProjetoProcessado[];
}

/**
 * Processa os dados da API para o formato necessário dos componentes de próximos projetos
 */
export function processarProximosProjetos(
  projetos: EspacoDeProjetos[]
): ResponsavelProcessado[] {
  // Filtra projetos em backlog priorizado
  const projetosBacklog = projetos.filter(
    (p) => p.Status === "Backlog Priorizado"
  );

  // Agrupa por responsável
  const projetosPorResponsavel = projetosBacklog.reduce((acc, projeto) => {
    const responsavel = projeto.Responsável || "Sem Responsável";
    if (!acc[responsavel]) {
      acc[responsavel] = [];
    }
    acc[responsavel].push(projeto);
    return acc;
  }, {} as Record<string, EspacoDeProjetos[]>);

  // Ordena os projetos de cada responsável por posição no backlog
  Object.keys(projetosPorResponsavel).forEach((responsavel) => {
    projetosPorResponsavel[responsavel].sort(
      (a, b) => (a.PosicaoBacklog ?? 999) - (b.PosicaoBacklog ?? 999)
    );
  });

  // Converte para o formato necessário
  const responsaveisProcessados: ResponsavelProcessado[] = Object.keys(
    projetosPorResponsavel
  )
    .map((responsavel) => {
      const projetos = projetosPorResponsavel[responsavel].map(
        (projeto, index) => ({
          id: projeto.ID,
          titulo: projeto.Título,
          grupo: projeto["Grupo Solicitante"],
          responsavel: projeto.Responsável || "Sem Responsável",
          prioridade: projeto.Prioridade,
          posicao: index + 1,
        })
      );

      return {
        nome: responsavel,
        projetos,
      };
    })
    .sort((a, b) => b.projetos.length - a.projetos.length); // Ordena por quantidade de projetos

  return responsaveisProcessados;
}

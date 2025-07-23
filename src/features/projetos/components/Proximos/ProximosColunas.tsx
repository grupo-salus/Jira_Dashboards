import { ProjetoCard, ResponsavelCard } from "./BaseProximos";

interface Projeto {
  id: string;
  titulo: string;
  grupo: string;
  responsavel: string;
  prioridade: string;
  posicao: number;
}

interface Responsavel {
  nome: string;
  projetos: Projeto[];
}

interface ProximosColunasProps {
  responsaveis: Responsavel[];
}

export const ProximosColunas = ({ responsaveis }: ProximosColunasProps) => {
  return (
    <div className="flex gap-4 overflow-x-auto min-w-max">
      {responsaveis.map((responsavel) => (
        <ResponsavelCard
          key={responsavel.nome}
          nome={responsavel.nome}
          projetos={responsavel.projetos}
        >
          {responsavel.projetos.map((projeto) => (
            <ProjetoCard
              key={projeto.id}
              id={projeto.id}
              titulo={projeto.titulo}
              grupo={projeto.grupo}
              responsavel={projeto.responsavel}
              prioridade={projeto.prioridade}
              posicao={projeto.posicao}
            />
          ))}
        </ResponsavelCard>
      ))}
    </div>
  );
};

import { useTheme } from "@/shared/context/ThemeContext";
import { ProjetoCard } from "./BaseProximos";

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

interface ProximosLinhasProps {
  responsaveis: Responsavel[];
}

export const ProximosLinhas = ({ responsaveis }: ProximosLinhasProps) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-3">
      {responsaveis.map((responsavel) => (
        <div
          key={responsavel.nome}
          className="flex rounded-lg p-3"
          style={{
            backgroundColor: theme.bg.surface,
            border: `1px solid ${theme.border.base}`,
          }}
        >
          {/* Nome do responsável com largura fixa */}
          <div className="w-28 flex-shrink-0 flex items-center">
            <h3
              className="text-base font-semibold"
              style={{ color: theme.text.title }}
            >
              {responsavel.nome}:
            </h3>
          </div>

          {/* Container dos projetos com scroll horizontal */}
          <div className="flex gap-3 overflow-x-auto pb-1 flex-1 ml-3">
            {responsavel.projetos.map((projeto) => (
              <div key={projeto.id} className="min-w-[250px] max-w-[280px]">
                <ProjetoCard
                  id={projeto.id}
                  titulo={projeto.titulo}
                  grupo={projeto.grupo}
                  responsavel={projeto.responsavel}
                  prioridade={projeto.prioridade}
                  posicao={projeto.posicao}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

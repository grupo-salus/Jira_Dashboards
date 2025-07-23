import { useTheme } from "@/shared/context/ThemeContext";
import { Kanban } from "lucide-react";
import { KanbanColuna, KANBAN_COLUNAS } from "./KanbanColuna";

interface Projeto {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  // Adicione outras propriedades conforme necessário
}

interface KanbanWrapperProps {
  projetos: Projeto[];
}

export const KanbanWrapper = ({ projetos }: KanbanWrapperProps) => {
  const { theme } = useTheme();

  // Função para filtrar projetos por status/coluna
  const getProjetosPorColuna = (coluna: string) => {
    return projetos.filter((projeto) => {
      // Verificar se o projeto tem status definido
      if (!projeto.status) {
        return false;
      }

      // Mapeamento de status para colunas (ajuste conforme necessário)
      const mapeamentoStatus = {
        Ideação: ["ideacao", "ideação"],
        "Análise técnica e negócios": ["analise", "análise", "análise técnica"],
        "Backlog priorizado": ["backlog", "priorizado"],
        "Em desenvolvimento": ["desenvolvimento", "em desenvolvimento"],
        "Em homologação": ["homologacao", "homologação"],
        "Operação assistida": ["operacao", "operação", "assistida"],
        Entregue: ["entregue", "concluido", "concluído"],
        Cancelado: ["cancelado"],
        Bloqueado: ["bloqueado"],
      };

      const statusProjeto = projeto.status.toLowerCase();
      const statusColuna =
        mapeamentoStatus[coluna as keyof typeof mapeamentoStatus] || [];

      return statusColuna.some((status) => statusProjeto.includes(status));
    });
  };

  return (
    <div
      className="rounded-xl border p-6 transition-all duration-200"
      style={{
        backgroundColor: theme.bg.surface,
        borderColor: theme.border.base,
      }}
    >
      {/* Container do Kanban com scroll horizontal */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max h-96">
          {KANBAN_COLUNAS.map((coluna) => (
            <KanbanColuna
              key={coluna}
              titulo={coluna}
              projetos={getProjetosPorColuna(coluna)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

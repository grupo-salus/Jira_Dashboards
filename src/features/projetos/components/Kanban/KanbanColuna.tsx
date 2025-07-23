import { useTheme } from "@/shared/context/ThemeContext";
import { cn } from "@/shared/utils/cn";

interface Projeto {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  // Adicione outras propriedades conforme necessário
}

interface KanbanColunaProps {
  titulo: string;
  projetos: Projeto[];
  className?: string;
}

export const KanbanColuna = ({
  titulo,
  projetos,
  className,
}: KanbanColunaProps) => {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "flex flex-col min-w-64 max-w-64 h-full rounded-lg border transition-all duration-200",
        className
      )}
      style={{
        backgroundColor: theme.bg.surface,
        borderColor: theme.border.base,
      }}
    >
      {/* Cabeçalho da coluna */}
      <div
        className="p-4 border-b font-semibold text-sm"
        style={{
          borderColor: theme.border.base,
          color: theme.text.title,
        }}
      >
        <div className="flex items-center justify-between">
          <span>{titulo}</span>
          <span
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: theme.brand.accent,
              color: theme.text.inverse,
            }}
          >
            {projetos.length}
          </span>
        </div>
      </div>

      {/* Área de conteúdo da coluna */}
      <div className="flex-1 p-2 overflow-y-auto">
        {projetos.length === 0 ? (
          <div
            className="h-full flex items-center justify-center text-sm"
            style={{ color: theme.text.subtitle }}
          >
            <p>Nenhum projeto</p>
          </div>
        ) : (
          <div className="space-y-2">
            {projetos.map((projeto) => (
              <div
                key={projeto.id}
                className="p-3 rounded-md border cursor-pointer hover:shadow-md transition-all duration-200"
                style={{
                  backgroundColor: theme.bg.surface,
                  borderColor: theme.border.base,
                }}
              >
                <h4
                  className="font-medium text-sm mb-1 line-clamp-2"
                  style={{ color: theme.text.title }}
                >
                  {projeto.titulo}
                </h4>
                <div className="flex items-center justify-between">
                  {projeto.prioridade && (
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: getPrioridadeColor(
                          projeto.prioridade,
                          theme
                        ),
                        color: theme.text.inverse,
                      }}
                    >
                      {projeto.prioridade}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Função auxiliar para cores de prioridade
const getPrioridadeColor = (prioridade: string, theme: any) => {
  switch (prioridade.toLowerCase()) {
    case "alta":
      return theme.state?.error || "#ef4444";
    case "média":
      return theme.state?.warning || "#eab308";
    case "baixa":
      return theme.state?.success || "#22c55e";
    default:
      return theme.brand.accent;
  }
};

// Constante com as colunas do Kanban
export const KANBAN_COLUNAS = [
  "Ideação",
  "Análise técnica e negócios",
  "Backlog priorizado",
  "Em desenvolvimento",
  "Em homologação",
  "Operação assistida",
  "Entregue",
  "Cancelado",
  "Bloqueado",
] as const;

export type KanbanColunaTipo = (typeof KANBAN_COLUNAS)[number];

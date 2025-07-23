import { useTheme } from "@/shared/context/ThemeContext";
import { Kanban } from "lucide-react";

interface KanbanWrapperProps {
  projetos: unknown[];
}

export const KanbanWrapper = (_props: KanbanWrapperProps) => {
  const { theme } = useTheme();

  return (
    <div
      className="rounded-xl border p-6 transition-all duration-200"
      style={{
        backgroundColor: theme.bg.surface,
        borderColor: theme.border.base,
      }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Kanban size={20} style={{ color: theme.text.title }} />
        <h3
          className="text-lg font-semibold"
          style={{ color: theme.text.title }}
        >
          Visualização Kanban
        </h3>
      </div>

      <div className="h-96 flex items-center justify-center">
        <div className="text-center" style={{ color: theme.text.subtitle }}>
          <p className="text-lg mb-2">Kanban Board</p>
          <p className="text-sm">Será implementado com drag and drop</p>
        </div>
      </div>
    </div>
  );
};

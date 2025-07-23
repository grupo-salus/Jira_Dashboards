import { useTheme } from "@/shared/context/ThemeContext";
import { Table } from "lucide-react";

interface ProjetosTableProps {
  projetos: unknown[];
}

export const ProjetosTable = (_props: ProjetosTableProps) => {
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
        <Table size={20} style={{ color: theme.text.title }} />
        <h3
          className="text-lg font-semibold"
          style={{ color: theme.text.title }}
        >
          Tabela de Projetos
        </h3>
      </div>

      <div className="h-96 flex items-center justify-center">
        <div className="text-center" style={{ color: theme.text.subtitle }}>
          <p className="text-lg mb-2">Tabela de Projetos</p>
          <p className="text-sm">Será implementada com dados reais</p>
        </div>
      </div>
    </div>
  );
};

import { ReactNode } from "react";
import { useTheme } from "@/shared/context/ThemeContext";
import { usePrioridadeColor } from "@/shared/hooks/usePrioridadeColor";

interface ProjetoCardProps {
  id: string;
  titulo: string;
  grupo: string;
  responsavel: string;
  prioridade: string;
  posicao: number;
  children?: ReactNode;
  className?: string;
}

export const ProjetoCard = ({
  id,
  titulo,
  grupo,
  responsavel,
  prioridade,
  posicao,
  children,
  className = "",
}: ProjetoCardProps) => {
  const { theme } = useTheme();
  const prioridadeColor = usePrioridadeColor();

  return (
    <div
      className={`p-2 rounded-lg border-l-4 transition-all duration-200 hover:shadow-sm ${className}`}
      style={{
        backgroundColor: theme.bg.base,
        borderLeftColor: prioridadeColor(prioridade),
        border: `1px solid ${theme.border.base}`,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ background: theme.brand.neutral }}
        >
          #{posicao}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold px-2 py-1 rounded"
              style={{
                background: prioridadeColor(prioridade),
                color: theme.text.inverse,
              }}
            >
              {prioridade}
            </span>
          </div>
          <h4
            className="text-sm font-medium mb-1 line-clamp-1"
            style={{ color: theme.text.title }}
            title={titulo}
          >
            {titulo}
          </h4>
          <p className="text-xs" style={{ color: theme.text.subtitle }}>
            {grupo}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};

interface ResponsavelHeaderProps {
  nome: string;
  quantidade: number;
  className?: string;
}

export const ResponsavelHeader = ({
  nome,
  quantidade,
  className = "",
}: ResponsavelHeaderProps) => {
  const { theme } = useTheme();

  return (
    <div
      className={`p-3 border-b font-semibold text-sm ${className}`}
      style={{
        borderColor: theme.border.base,
        color: theme.text.title,
        backgroundColor: theme.bg.muted,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="truncate">{nome}</span>
        <span
          className="ml-2 px-2 py-1 rounded-full text-xs font-bold"
          style={{
            backgroundColor: theme.brand.primary,
            color: theme.text.inverse,
          }}
        >
          {quantidade}
        </span>
      </div>
    </div>
  );
};

interface ResponsavelCardProps {
  nome: string;
  projetos: Array<{
    id: string;
    titulo: string;
    grupo: string;
    responsavel: string;
    prioridade: string;
    posicao: number;
  }>;
  children: ReactNode;
  className?: string;
}

export const ResponsavelCard = ({
  nome,
  projetos,
  children,
  className = "",
}: ResponsavelCardProps) => {
  const { theme } = useTheme();

  return (
    <div
      className={`min-w-[280px] max-w-[320px] ${className}`}
      style={{
        backgroundColor: theme.bg.surface,
        borderRadius: "8px",
        border: `1px solid ${theme.border.base}`,
      }}
    >
      <ResponsavelHeader nome={nome} quantidade={projetos.length} />
      <div 
        className="p-3 space-y-2 max-h-64 overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.border.base} transparent`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

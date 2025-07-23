// Componente temporariamente desabilitado - Dashboard TI em desenvolvimento
import { useTheme } from "@/shared/context/ThemeContext";

interface TITableProps {
  data: any[];
}

export const TITable = ({ data }: TITableProps) => {
  const { theme } = useTheme();

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold" style={{ color: theme.text.title }}>
        Dashboard TI - Em Desenvolvimento
      </h1>
      <p className="mt-4 text-lg" style={{ color: theme.text.subtitle }}>
        Esta funcionalidade está sendo implementada
      </p>
    </div>
  );
};

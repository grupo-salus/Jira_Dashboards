import { ReactNode } from "react";
import { useTheme } from "@/shared/context/ThemeContext";

// Utilitário para extrair opções únicas de um campo dos projetos
// Exemplo de uso: getUniqueOptions(projetos, 'Status')
export function getUniqueOptions<T>(projetos: T[], campo: keyof T) {
  // O campo deve ser o nome exato da propriedade do projeto, ex: 'Status', 'Area', 'Squad', etc.
  // Retorna apenas valores únicos e não vazios
  return Array.from(new Set(projetos.map((p) => p[campo]).filter(Boolean)));
}

interface FilterBaseProps {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
  htmlFor?: string;
}

export const FilterBase = ({
  label,
  icon,
  children,
  htmlFor,
}: FilterBaseProps) => {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col min-w-0">
      <label
        htmlFor={htmlFor}
        className="block mb-3 font-semibold text-xs"
        style={{ color: theme.text.title }}
      >
        {icon && <span className="mr-2 align-middle inline-block">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
};

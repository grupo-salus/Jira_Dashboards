import { ReactNode } from "react";
import { useTheme } from "@/shared/context/ThemeContext";

interface BaseTotalizadorProps {
  icon: ReactNode;
  titulo: string;
  valor: ReactNode;
  corValor?: string;
  corIcone?: string;
}

export const BaseTotalizador = ({
  icon,
  titulo,
  valor,
  corValor,
  corIcone,
}: BaseTotalizadorProps) => {
  const { theme } = useTheme();
  return (
    <div
      className="flex flex-row gap-2 p-4 rounded-lg shadow-sm h-full min-h-[100px]"
      style={{ backgroundColor: theme.bg.surface }}
    >
      <div
        className="flex items-start justify-center h-8 w-8 min-w-[2rem] min-h-[2rem] rounded-full bg-transparent"
        style={{
          color: corIcone || theme.brand.primary,
          fontSize: 0,
          margin: 0,
          padding: 0,
        }}
      >
        {icon}
      </div>
      <div className="flex flex-col justify-between h-full flex-1">
        <span
          className="text-xs font-semibold leading-tight"
          style={{ color: theme.text.title }}
        >
          {titulo}
        </span>
        <span
          className="text-2xl font-bold"
          style={{ color: corValor || theme.text.base }}
        >
          {valor}
        </span>
      </div>
    </div>
  );
};

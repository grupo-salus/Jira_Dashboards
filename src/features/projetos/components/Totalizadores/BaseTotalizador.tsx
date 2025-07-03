import { ReactNode } from "react";
import { useTheme } from "@/shared/context/ThemeContext";

interface BaseTotalizadorProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export const BaseTotalizador = ({
  title,
  value,
  icon,
  trend,
  color,
}: BaseTotalizadorProps) => {
  const { theme } = useTheme();

  return (
    <div
      className="rounded-xl border p-6 transition-all duration-200 hover:shadow-lg"
      style={{
        backgroundColor: theme.bg.surface,
        borderColor: theme.border.base,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: color || theme.bg.muted,
          }}
        >
          <div style={{ color: theme.text.inverse }}>{icon}</div>
        </div>

        {trend && (
          <div className="flex items-center gap-1">
            <span
              className={`text-sm font-medium ${
                trend.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
            <div
              className={`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${
                trend.isPositive ? "border-b-green-500" : "border-b-red-500"
              }`}
              style={{
                transform: trend.isPositive ? "rotate(0deg)" : "rotate(180deg)",
              }}
            />
          </div>
        )}
      </div>

      <div>
        <h3
          className="text-2xl font-bold mb-1"
          style={{ color: theme.text.title }}
        >
          {value}
        </h3>
        <p className="text-sm" style={{ color: theme.text.subtitle }}>
          {title}
        </p>
      </div>
    </div>
  );
};

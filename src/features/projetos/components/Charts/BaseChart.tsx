import { ReactNode } from "react";
import { useTheme } from "@/shared/context/ThemeContext";

interface BaseChartProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export const BaseChart = ({ title, icon, children }: BaseChartProps) => {
  const { theme } = useTheme();

  return (
    <div
      className="rounded-xl border p-6 transition-all duration-200 hover:shadow-lg"
      style={{
        backgroundColor: theme.bg.surface,
        borderColor: theme.border.base,
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div style={{ color: theme.text.subtitle }}>{icon}</div>
        <h3
          className="text-lg font-semibold"
          style={{ color: theme.text.title }}
        >
          {title}
        </h3>
      </div>

      <div className="h-64 flex items-center justify-center">{children}</div>
    </div>
  );
};

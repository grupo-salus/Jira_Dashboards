import { ReactNode } from "react";
import { useTheme } from "@/shared/context/ThemeContext";

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

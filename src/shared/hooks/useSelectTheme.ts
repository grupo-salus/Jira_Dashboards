import { useTheme } from "@/shared/context/ThemeContext";
import type { Theme } from "react-select";

export const useSelectTheme = () => {
  const { theme } = useTheme();
  return (base: Theme) => ({
    ...base,
    colors: {
      ...base.colors,
      primary: theme.brand.primary,
      primary25: theme.bg.muted,
      primary50: theme.bg.surface,
      neutral0: theme.bg.base,
      neutral5: theme.bg.surface,
      neutral10: theme.bg.muted,
      neutral20: theme.border.base,
      neutral30: theme.border.strong,
      neutral40: theme.text.subtitle,
      neutral50: theme.text.subtitle,
      neutral60: theme.text.subtitle,
      neutral80: theme.text.title,
      text: theme.text.title,
      danger: "#ef4444",
      dangerLight: "#fee2e2",
    },
    borderRadius: 8,
    spacing: {
      ...base.spacing,
      controlHeight: 40,
      baseUnit: 4,
    },
    fontSize: 14,
  });
};

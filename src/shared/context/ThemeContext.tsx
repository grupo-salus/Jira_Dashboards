import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { availableThemes, DEFAULT_THEME, ThemeName } from "../themes";

type Mode = "light" | "dark";

interface ThemeContextType {
  themeName: ThemeName;
  mode: Mode;
  theme: (typeof availableThemes)[ThemeName]["light"];
  setThemeName: (name: ThemeName) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    return (localStorage.getItem("themeName") as ThemeName) || DEFAULT_THEME;
  });

  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem("themeMode") as Mode) || "light";
  });

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", next);
      return next;
    });
  };

  const changeThemeName = (name: ThemeName) => {
    setThemeName(name);
    localStorage.setItem("themeName", name);
  };

  const theme = availableThemes[themeName][mode];

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        mode,
        theme,
        setThemeName: changeThemeName,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

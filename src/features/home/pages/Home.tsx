import { useTheme } from "@/shared/context/ThemeContext";

const MeuComponente = () => {
  const { theme, toggleMode, setThemeName, mode } = useTheme();

  return (
    <div style={{ backgroundColor: theme.bg.base, color: theme.text.base }}>
      <h1>Dashboard</h1>

      <button onClick={toggleMode}>
        Modo: {mode === "light" ? "Claro" : "Escuro"}
      </button>

      <button onClick={() => setThemeName("jira")}>
        Trocar para tema Jira
      </button>
    </div>
  );
};

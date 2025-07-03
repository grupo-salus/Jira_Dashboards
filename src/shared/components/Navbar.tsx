// Arquivo vazio - será implementado futuramente
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/shared/context/ThemeContext";
import { cn } from "@/shared/utils/cn"; // utilitário opcional para classe condicional

export const Navbar = () => {
  const { theme, toggleMode, mode } = useTheme();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Status Report", path: "/status-report" },
    { label: "Kanban", path: "/kanban" },
    { label: "Tabela", path: "/tabela" },
  ];

  return (
    <nav
      style={{ backgroundColor: theme.bg.surface, color: theme.text.base }}
      className="w-full px-6 py-3 shadow-md flex justify-between items-center"
    >
      <div className="flex gap-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "font-medium hover:underline",
              location.pathname === item.path && "underline"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {/* Troca light/dark */}
        <button
          onClick={toggleMode}
          className="text-sm px-3 py-1 border rounded"
          style={{
            borderColor: theme.border.base,
            backgroundColor: theme.bg.muted,
            color: theme.text.base,
          }}
        >
          {mode === "light" ? "🌞" : "🌙"}
        </button>
        {/* Futuro: seletor de tema (Salus / Jira / Custom) */}
      </div>
    </nav>
  );
};

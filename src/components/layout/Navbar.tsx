import React from "react";
import {
  Kanban,
  RefreshCw,
  Moon,
  Sun,
  Footprints as Sprint,
  Home as HomeIcon,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useJira } from "../../context/JiraContext";
import {
  getTextColor,
  getBackgroundColor,
  getBorderColor,
} from "../../utils/themeColors";

interface NavbarProps {
  currentView: "home" | "projetos" | "sprint" | "ti";
  onViewChange: (view: "home" | "projetos" | "sprint" | "ti") => void;
  showHomeLink?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  showHomeLink,
}) => {
  const location = useLocation();

  // Hook para detectar o tema atual
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">(
    "light"
  );

  // Estado para controlar o menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setCurrentTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const { theme, toggleTheme } = useTheme();
  const {
    refreshProjetosData,
    refreshSprintData,
    refreshAcompanhamentoTIData,
  } = useJira();

  const handleRefresh = () => {
    if (currentView === "projetos") {
      refreshProjetosData();
    } else if (currentView === "sprint") {
      refreshSprintData();
    } else if (currentView === "ti") {
      refreshAcompanhamentoTIData();
    }
  };

  const handleViewChange = (view: "home" | "projetos" | "sprint" | "ti") => {
    onViewChange(view);
    setIsMobileMenuOpen(false); // Fecha o menu mobile ao navegar
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Determina qual opção mostrar baseado na rota atual
  const getCurrentRouteOption = () => {
    if (location.pathname === "/") {
      return {
        view: "projetos" as const,
        icon: Kanban,
        label: "Status Report de Projetos",
      };
    } else if (location.pathname === "/sprint") {
      return {
        view: "sprint" as const,
        icon: Sprint,
        label: "Sprint Ativa",
      };
    } else if (location.pathname === "/ti") {
      return {
        view: "ti" as const,
        icon: Users,
        label: "Tasks TI",
      };
    }
    return null;
  };

  const currentRouteOption = getCurrentRouteOption();

  return (
    <nav
      className="border-b shadow-sm relative"
      style={{
        backgroundColor: getBackgroundColor("card", currentTheme),
        borderBottom: `1px solid ${getBorderColor("primary", currentTheme)}`,
      }}
    >
      <div className="w-full px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Esquerda: Logo, Título e Menus */}
          <div className="flex items-center gap-6">
            {/* Logo e Título */}
            <div className="flex items-center">
              <img
                src="/assets/logo.png"
                alt="Salus Logo"
                className="h-12 w-full mr-2"
              />
            </div>

            {/* Menu de Navegação - Desktop - Mostra apenas a opção da rota atual */}
            {currentRouteOption && (
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => handleViewChange(currentRouteOption.view)}
                  className="px-4 py-2 rounded-md transition-colors font-semibold"
                  style={{
                    backgroundColor: getBackgroundColor("active", currentTheme),
                    color: getTextColor("primary", currentTheme),
                  }}
                >
                  <span className="flex items-center gap-2">
                    <currentRouteOption.icon className="h-4 w-4" />
                    {currentRouteOption.label}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Direita: Botões de Ação */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              className="btn btn-secondary flex items-center gap-1"
              onClick={handleRefresh}
              style={{
                backgroundColor: getBackgroundColor("hover", currentTheme),
                color: getTextColor("secondary", currentTheme),
              }}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-md"
              style={{
                color: getTextColor("secondary", currentTheme),
                backgroundColor: "transparent",
              }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Botão Menu Mobile */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md"
                style={{
                  color: getTextColor("secondary", currentTheme),
                  backgroundColor: "transparent",
                }}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile - Mostra apenas a opção da rota atual */}
        {isMobileMenuOpen && currentRouteOption && (
          <div
            className="md:hidden mt-4 pb-4"
            style={{
              borderTop: `1px solid ${getBorderColor("primary", currentTheme)}`,
            }}
          >
            <div className="flex flex-col space-y-2 pt-4">
              <button
                onClick={() => handleViewChange(currentRouteOption.view)}
                className="px-4 py-3 rounded-md transition-colors font-semibold text-left"
                style={{
                  backgroundColor: getBackgroundColor("active", currentTheme),
                  color: getTextColor("primary", currentTheme),
                }}
              >
                <span className="flex items-center gap-3">
                  <currentRouteOption.icon className="h-5 w-5" />
                  {currentRouteOption.label}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

// src/shared/components/Navbar.tsx
import { useTheme } from "@/shared/context/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Sun,
  Moon,
  RefreshCw,
  Footprints,
  Users,
  Menu,
  X,
  Home,
  BarChart3,
  Settings,
  ChevronDown,
  Palette,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { availableThemes, ThemeName } from "@/shared/themes";

export const Navbar = () => {
  const { toggleMode, mode, theme, themeName, setThemeName } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const navItems = [
    { path: "/", icon: <Home size={18} />, label: "Home" },
    {
      path: "/projetos",
      icon: <BarChart3 size={18} />,
      label: "Status Report",
    },
    { path: "/sprints", icon: <Footprints size={18} />, label: "Sprints" },
    { path: "/ti", icon: <Users size={18} />, label: "TI" },
  ];

  const themeOptions = [
    { name: "salus" as ThemeName, label: "Salus", icon: <Palette size={16} /> },
    { name: "jira" as ThemeName, label: "Jira", icon: <Palette size={16} /> },
    {
      name: "custom" as ThemeName,
      label: "Custom",
      icon: <Palette size={16} />,
    },
  ];

  const handleThemeChange = (themeName: ThemeName) => {
    setThemeName(themeName);
    setIsThemeDropdownOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b shadow-lg w-full"
      style={{
        backgroundColor: `${theme.bg.surface}CC`,
        borderBottom: `1px solid ${theme.border.base}`,
      }}
    >
      <div className="w-full px-4 md:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Navegação Desktop */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Salus Logo" className="h-10 w-auto mr-3" />
            </Link>

            {/* Navegação Desktop */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.path}
                />
              ))}
            </div>
          </div>

          {/* Ações à direita */}
          <div className="flex items-center space-x-3">
            <button
              className="p-2.5 rounded-lg transition-all duration-200 hover:shadow-md group"
              aria-label="Refresh data"
              style={{
                color: theme.text.subtitle,
                backgroundColor: theme.bg.muted,
              }}
            >
              <RefreshCw
                size={18}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
            </button>

            <button
              className="p-2.5 rounded-lg transition-all duration-200 hover:shadow-md"
              aria-label="Toggle theme"
              onClick={toggleMode}
              style={{
                color: theme.text.subtitle,
                backgroundColor: theme.bg.muted,
              }}
            >
              {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Dropdown de Temas */}
            <div className="relative hidden sm:block">
              <button
                className="p-2.5 rounded-lg transition-all duration-200 hover:shadow-md flex items-center gap-2"
                aria-label="Theme settings"
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                style={{
                  color: theme.text.subtitle,
                  backgroundColor: theme.bg.muted,
                }}
              >
                <Settings size={18} />
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isThemeDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isThemeDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border"
                  style={{
                    backgroundColor: theme.bg.surface,
                    borderColor: theme.border.base,
                  }}
                >
                  <div className="py-2">
                    {themeOptions.map((option) => (
                      <button
                        key={option.name}
                        className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-opacity-50 transition-colors"
                        onClick={() => handleThemeChange(option.name)}
                        style={{
                          backgroundColor:
                            themeName === option.name
                              ? theme.bg.muted
                              : "transparent",
                          color: theme.text.subtitle,
                        }}
                      >
                        {option.icon}
                        <span className="capitalize">{option.label}</span>
                        {themeName === option.name && (
                          <div
                            className="ml-auto w-2 h-2 rounded-full"
                            style={{ backgroundColor: theme.border.strong }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Menu Mobile */}
            <div className="lg:hidden flex items-center">
              <button
                className="p-2.5 rounded-lg transition-all duration-200 hover:shadow-md"
                aria-label="Toggle mobile menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  color: theme.text.subtitle,
                  backgroundColor: theme.bg.muted,
                }}
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden mt-4 pb-4 border-t"
            style={{ borderColor: theme.border.base }}
          >
            <div className="pt-4 space-y-2">
              {navItems.map((item) => (
                <MobileNavLink
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}

              {/* Temas no Mobile */}
              <div
                className="pt-4 border-t"
                style={{ borderColor: theme.border.base }}
              >
                <div
                  className="text-sm font-medium mb-3"
                  style={{ color: theme.text.subtitle }}
                >
                  Temas
                </div>
                <div className="space-y-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.name}
                      className="w-full px-4 py-2 text-left flex items-center gap-3 rounded-lg transition-colors"
                      onClick={() => handleThemeChange(option.name)}
                      style={{
                        backgroundColor:
                          themeName === option.name
                            ? theme.bg.muted
                            : "transparent",
                        color: theme.text.subtitle,
                      }}
                    >
                      {option.icon}
                      <span className="capitalize">{option.label}</span>
                      {themeName === option.name && (
                        <div
                          className="ml-auto w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.border.strong }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({
  to,
  icon,
  label,
  isActive = false,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}) => {
  const { theme } = useTheme();
  return (
    <Link
      to={to}
      className="relative px-4 py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center gap-2.5 group"
      style={{
        backgroundColor: isActive ? theme.bg.muted : "transparent",
        color: isActive ? theme.text.title : theme.text.subtitle,
      }}
    >
      {icon}
      <span>{label}</span>
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200 ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{ backgroundColor: theme.border.strong }}
      />
    </Link>
  );
};

const MobileNavLink = ({
  to,
  icon,
  label,
  isActive = false,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) => {
  const { theme } = useTheme();
  return (
    <Link
      to={to}
      className="block px-4 py-3 rounded-lg transition-colors font-medium flex items-center gap-3"
      onClick={onClick}
      style={{
        backgroundColor: isActive ? theme.bg.muted : "transparent",
        color: isActive ? theme.text.title : theme.text.subtitle,
      }}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

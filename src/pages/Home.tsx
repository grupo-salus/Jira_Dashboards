import React from "react";
import { getTextColor } from "../utils/themeColors";

const Home: React.FC = () => {
  // Hook para detectar o tema atual
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">(
    "light"
  );

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

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1
        className="text-3xl font-bold mb-4"
        style={{ color: getTextColor("primary", currentTheme) }}
      >
        Bem-vindo ao Jira Dashboards
      </h1>
      <p
        className="text-lg mb-6 text-center max-w-xl"
        style={{ color: getTextColor("secondary", currentTheme) }}
      >
        Este é um sistema de dashboards para visualização e gestão de dados do
        backlog do Jira.
        <br />
        Use o menu acima para navegar entre as funcionalidades.
      </p>
    </div>
  );
};

export default Home;

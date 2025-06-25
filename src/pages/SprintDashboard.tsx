/**
 * SprintDashboard.tsx
 *
 * Este é o componente do dashboard de sprint que:
 * 1. Exibe uma mensagem de "em desenvolvimento"
 * 2. Lista as funcionalidades futuras
 * 3. Serve como placeholder para a implementação futura
 *
 * Funcionalidades planejadas:
 * - Visualização de sprints ativas
 * - Acompanhamento de progresso
 * - Métricas de velocidade
 * - Monitoramento de burndown
 */

import React from "react";
import { getTextColor, getBackgroundColor } from "../utils/themeColors";

interface SprintDashboardProps {
  lastUpdate?: Date;
}

const SprintDashboard: React.FC<SprintDashboardProps> = () => {
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
    <div
      className="h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: getBackgroundColor("page", currentTheme) }}
    >
      <div className="text-center">
        <h1
          className="text-2xl font-bold mb-4"
          style={{ color: getTextColor("primary", currentTheme) }}
        >
          Dashboard de Sprint em Desenvolvimento
        </h1>
        <p
          className="text-lg mb-6"
          style={{ color: getTextColor("secondary", currentTheme) }}
        >
          Estamos trabalhando para trazer uma visão completa das sprints ativas.
        </p>
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: getBackgroundColor("hover", currentTheme) }}
        >
          <p style={{ color: getTextColor("info", currentTheme) }}>
            Em breve você poderá:
          </p>
          <ul
            className="list-disc list-inside mt-2"
            style={{ color: getTextColor("info", currentTheme) }}
          >
            <li>Visualizar sprints ativas</li>
            <li>Acompanhar o progresso das tarefas</li>
            <li>Analisar métricas de velocidade</li>
            <li>Monitorar o burndown</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SprintDashboard;

/**
 * TIDashboard.tsx
 *
 * Este é o componente do dashboard de acompanhamento de TI que:
 * 1. Exibe uma mensagem de "em desenvolvimento"
 * 2. Lista as funcionalidades futuras
 * 3. Serve como placeholder para a implementação futura
 *
 * Funcionalidades planejadas:
 * - Visualização de atividades por membro da equipe
 * - Métricas de produtividade
 * - Distribuição de carga de trabalho
 * - Acompanhamento de prazos
 */

import React, { useState } from "react";
import { useJira } from "../context/JiraContext";
import AcompanhamentoTITable from "../components/DashAcompanhamentoTI/AcompanhamentoTITable";
import { getTextColor, getBackgroundColor } from "../utils/themeColors";

const TIDashboard: React.FC = () => {
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

  const { acompanhamentoTIData } = useJira();
  const [filtros, setFiltros] = useState({
    responsavel: "",
    prioridade: "",
    periodo_dias: 0, // 0 representa "geral"
  });

  const periodos = [
    { label: "Geral", value: 0 },
    { label: "Últimos 7 dias", value: 7 },
    { label: "Últimos 15 dias", value: 15 },
    { label: "Últimos 30 dias", value: 30 },
  ];

  if (acompanhamentoTIData.loading) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: getBackgroundColor("page", currentTheme) }}
      >
        <div
          className="text-xl"
          style={{ color: getTextColor("secondary", currentTheme) }}
        >
          Carregando dados do acompanhamento TI...
        </div>
      </div>
    );
  }

  if (acompanhamentoTIData.error) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: getBackgroundColor("page", currentTheme) }}
      >
        <div
          className="text-xl"
          style={{ color: getTextColor("error", currentTheme) }}
        >
          Erro ao carregar dados: {acompanhamentoTIData.error}
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-6"
      style={{ backgroundColor: getBackgroundColor("page", currentTheme) }}
    >
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: getTextColor("primary", currentTheme) }}
        >
          Dashboard de Acompanhamento TI
        </h1>
      </div>
      <AcompanhamentoTITable
        data={acompanhamentoTIData.rawData}
        filtros={filtros}
        onFiltrosChange={setFiltros}
        periodos={periodos}
      />
    </div>
  );
};

export default TIDashboard;

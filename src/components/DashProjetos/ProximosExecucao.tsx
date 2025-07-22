import React, { useEffect } from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getTotalizadoresConfig } from "../../constants/styleConfig";
import {
  themeColors,
  getTextColor,
  getBackgroundColor,
} from "../../utils/themeColors";
import ProximosExecucaoLinhas from "./ProximosExecucaoLinhas";

interface ProximosExecucaoProps {
  filteredData: EspacoDeProjetos[];
}

const ProximosExecucao: React.FC<ProximosExecucaoProps> = ({
  filteredData,
}) => {
  const config = getTotalizadoresConfig();

  // Hook para detectar o tema atual
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">(
    "light"
  );

  useEffect(() => {
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

  // Encontrar os projetos no backlog priorizado
  const backlogPriorizado = filteredData.filter(
    (p) => p.Status === "Backlog Priorizado"
  );

  // Obter os responsáveis únicos que existem no backlog priorizado
  const responsaveisDisponiveis = [
    "Todos",
    ...Array.from(
      new Set(
        backlogPriorizado
          .map((p) => p["Responsável Atual"] || "")
          .filter((responsavel) => responsavel && responsavel.trim() !== "")
      )
    ),
  ];

  return (
    <div className="mb-20">
      <div
        className={`rounded-lg shadow-md w-full p-4 sm:p-6 relative overflow-hidden flex flex-col gap-3`}
        style={{
          backgroundColor: getBackgroundColor("card", currentTheme),
        }}
      >
        <div className="w-full mb-3">
          <h3
            className={`font-bold ${config.titulo}`}
            style={{ color: getTextColor("primary", currentTheme) }}
          >
            Fila de Projetos por Responsável
          </h3>
          <p
            className={`text-sm ${config.label}`}
            style={{ color: getTextColor("secondary", currentTheme) }}
          >
            Fila ordenada por backlog priorizado
          </p>
        </div>

        <ProximosExecucaoLinhas
          responsaveisDisponiveis={responsaveisDisponiveis}
          backlogPriorizado={backlogPriorizado}
          currentTheme={currentTheme}
        />
      </div>
    </div>
  );
};

export default ProximosExecucao;

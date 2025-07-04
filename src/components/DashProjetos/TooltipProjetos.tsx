import React from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import {
  getTextColor,
  getBackgroundColor,
  getBorderColor,
  getPriorityConfig,
} from "../../utils/themeColors";

interface TooltipProjetosProps {
  areaLabel: string;
  projetos: EspacoDeProjetos[];
  onProjetoClick?: (projeto: EspacoDeProjetos) => void;
}

const TooltipProjetos: React.FC<TooltipProjetosProps> = ({
  areaLabel,
  projetos,
  onProjetoClick,
}) => {
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

  const handleMouseLeave = () => {
    // Fechar o tooltip quando o mouse sair da área
    const event = new CustomEvent("closeTooltip");
    document.dispatchEvent(event);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 tooltip-modal"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="rounded-xl p-6 max-h-[80vh] overflow-y-auto min-w-[300px] max-w-[600px] text-sm shadow-2xl border"
        style={{
          backgroundColor: getBackgroundColor("card", currentTheme),
          border: `1px solid ${getBorderColor("primary", currentTheme)}`,
          color: getTextColor("primary", currentTheme),
        }}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header com título */}
        <div
          className="flex justify-between items-center mb-4 pb-2 border-b"
          style={{
            borderBottomColor: getBorderColor("secondary", currentTheme),
          }}
        >
          <h3 className="font-bold text-lg">
            {areaLabel} ({projetos.length} projetos)
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            onClick={() => {
              // Fechar o tooltip - isso será controlado pelo componente pai
              const event = new CustomEvent("closeTooltip");
              document.dispatchEvent(event);
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Conteúdo dos projetos */}
        {projetos.length === 0 ? (
          <div
            className="text-center py-8"
            style={{ color: getTextColor("secondary", currentTheme) }}
          >
            Nenhum projeto encontrado.
          </div>
        ) : (
          <div className="space-y-3">
            {projetos.map((proj, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border transition-colors hover:shadow-md cursor-pointer"
                style={{
                  backgroundColor:
                    idx % 2 === 0
                      ? getBackgroundColor("hover", currentTheme)
                      : getBackgroundColor("card", currentTheme),
                  border: `1px solid ${getBorderColor(
                    "secondary",
                    currentTheme
                  )}`,
                }}
                onClick={() => onProjetoClick && onProjetoClick(proj)}
              >
                <div className="font-semibold mb-2 text-base">
                  {proj.Título}
                </div>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs"
                  style={{ color: getTextColor("secondary", currentTheme) }}
                >
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {proj.Status || "Não informado"}
                  </div>
                  <div>
                    <span className="font-medium">Prioridade:</span>{" "}
                    {proj.Prioridade ? (
                      <span
                        style={{
                          backgroundColor: getPriorityConfig(proj.Prioridade)
                            .hex,
                          color: "#fff",
                          borderRadius: "4px",
                          padding: "2px 8px",
                          fontWeight: 600,
                          fontSize: "0.85em",
                          marginLeft: 4,
                        }}
                      >
                        {getPriorityConfig(proj.Prioridade).label}
                      </span>
                    ) : (
                      <span>Não informado</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Squads:</span>{" "}
                    {proj.Squads && proj.Squads.length > 0
                      ? proj.Squads.join(", ")
                      : "Não informado"}
                  </div>
                  <div>
                    <span className="font-medium">Área:</span>{" "}
                    {proj["Departamento Solicitante"] || "Não informado"}
                  </div>
                </div>
                <div
                  className="mt-2 text-xs"
                  style={{ color: getTextColor("secondary", currentTheme) }}
                >
                  <span className="font-medium">Responsável:</span>{" "}
                  {proj.Responsável || "Não informado"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TooltipProjetos;

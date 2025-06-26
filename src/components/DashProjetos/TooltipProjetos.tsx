import React from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import {
  getTextColor,
  getBackgroundColor,
  getBorderColor,
} from "../../utils/themeColors";

interface TooltipProjetosProps {
  areaLabel: string;
  projetos: EspacoDeProjetos[];
}

const TooltipProjetos: React.FC<TooltipProjetosProps> = ({
  areaLabel,
  projetos,
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

  return (
    <div
      className="rounded-xl p-1 max-h-[150px] overflow-y-auto min-w-[120px] max-w-[180px] text-xs shadow-lg"
      style={{
        backgroundColor: getBackgroundColor("card", currentTheme),
        border: `1px solid ${getBorderColor("primary", currentTheme)}`,
        color: getTextColor("primary", currentTheme),
        zIndex: 1000,
        position: "relative",
      }}
    >
      <div className="font-bold mb-1">
        {areaLabel} ({projetos.length} projetos)
      </div>
      {projetos.length === 0 ? (
        <div>Nenhum projeto encontrado.</div>
      ) : (
        projetos.map((proj, idx) => (
          <div
            key={idx}
            className="mb-1 pb-1 rounded-lg border"
            style={{
              padding: 4,
              backgroundColor:
                idx % 2 === 0
                  ? getBackgroundColor("hover", currentTheme)
                  : getBackgroundColor("card", currentTheme),
              border: `1px solid ${getBorderColor("secondary", currentTheme)}`,
            }}
          >
            <span className="font-semibold">Título:</span>{" "}
            <span>{proj.Título}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default TooltipProjetos;

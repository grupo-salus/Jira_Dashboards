import React from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";

interface TooltipProjetosProps {
  areaLabel: string;
  projetos: EspacoDeProjetos[];
}

const TooltipProjetos: React.FC<TooltipProjetosProps> = ({
  areaLabel,
  projetos,
}) => (
  <div
    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 max-h-[220px] overflow-y-auto min-w-[180px] max-w-[260px] text-gray-900 dark:text-gray-100 shadow-lg text-xs"
    style={{
      zIndex: 1000,
      position: "relative",
    }}
  >
    <div className="font-bold mb-2">
      {areaLabel} ({projetos.length} projetos)
    </div>
    {projetos.length === 0 ? (
      <div>Nenhum projeto encontrado.</div>
    ) : (
      projetos.map((proj, idx) => (
        <div
          key={idx}
          className={`mb-2 pb-2 rounded-lg ${
            idx % 2 === 0
              ? "bg-gray-100 dark:bg-gray-700"
              : "bg-white dark:bg-gray-800"
          } border border-gray-200 dark:border-gray-700`}
          style={{ padding: 8 }}
        >
          <span className="font-semibold">Título:</span>{" "}
          <span>{proj.Título}</span>
        </div>
      ))
    )}
  </div>
);

export default TooltipProjetos;

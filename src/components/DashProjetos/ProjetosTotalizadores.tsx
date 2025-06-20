import React from "react";
import { CardsIcon, CompassIcon } from "../icons/DashboardIcons";
import { EspacoDeProjetos, JiraStatus } from "../../types/Typesjira";

interface ProjetosTotalizadoresProps {
  filteredData: EspacoDeProjetos[];
}

const ProjetosTotalizadores: React.FC<ProjetosTotalizadoresProps> = ({
  filteredData,
}) => {
  const total = filteredData.length;
  const totalProjetos = filteredData.filter((p) => {
    return p.Status !== "Backlog";
  }).length;

  return (
    <div className="flex flex-wrap gap-6 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow w-56 h-24 flex items-center px-6 py-3">
        <div className="mr-4 flex-shrink-0">
          <CardsIcon size={36} className="text-blue-500 dark:text-blue-400" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500 dark:text-gray-300 font-medium">
            Total
          </span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {total}
          </span>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow w-56 h-24 flex items-center px-6 py-3">
        <div className="mr-4 flex-shrink-0">
          <CompassIcon
            size={36}
            className="text-green-500 dark:text-green-400"
          />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500 dark:text-gray-300 font-medium">
            Total de Projetos
          </span>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalProjetos}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjetosTotalizadores;

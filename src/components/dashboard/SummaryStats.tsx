import React from "react";

interface SummaryStatsProps {
  total: number;
  totalProjetos: number;
  mediaDiasBacklog: number;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({
  total,
  totalProjetos,
  mediaDiasBacklog,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Total de Cards
        </h3>
        <p className="text-3xl font-bold text-primary-600">{total}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Total de Projetos
        </h3>
        <p className="text-3xl font-bold text-primary-600">{totalProjetos}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Média de Dias no Backlog
        </h3>
        <p className="text-3xl font-bold text-primary-600">
          {mediaDiasBacklog}
        </p>
      </div>
    </div>
  );
};

export default SummaryStats;

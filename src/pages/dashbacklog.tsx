import React from "react";

interface DashBacklogProps {
  lastUpdate?: Date;
}

const DashBacklog: React.FC<DashBacklogProps> = ({ lastUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Backlog Dashboard</h1>
          <p className="text-gray-500">
            Visualize e gerencie o backlog de forma eficiente
          </p>
        </div>
        {lastUpdate && (
          <div className="text-xs text-gray-400 mt-2 md:mt-0 md:text-right">
            Última atualização: {" "}
            {lastUpdate.toLocaleString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBacklog; 
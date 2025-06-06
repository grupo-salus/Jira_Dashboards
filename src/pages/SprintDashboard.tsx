import React from "react";

interface SprintDashboardProps {
  lastUpdate?: Date;
}

const SprintDashboard: React.FC<SprintDashboardProps> = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-xl text-gray-500">Dashboard de Sprint em construção...</p>
    </div>
  );
};

export default SprintDashboard;

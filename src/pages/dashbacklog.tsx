import React, { useEffect, useState } from "react";
import { fetchBacklogTable } from "../api/api_jira";
import { BacklogItem } from "../types/backlog";
import { calculateBacklogMetrics } from "../utils/backlogMetrics";
import { BacklogKPICards } from "../components/dashboard/BacklogKPICards";

const DashBacklog: React.FC = () => {
  const [rawData, setRawData] = useState<BacklogItem[]>([]);
  const [metrics, setMetrics] = useState<ReturnType<
    typeof calculateBacklogMetrics
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const backlogData = await fetchBacklogTable();
        setRawData(backlogData);
        setMetrics(calculateBacklogMetrics(backlogData));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">
          Carregando dados do backlog...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Erro: {error}</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">Nenhum dado disponível</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard do Backlog</h1>
      <BacklogKPICards metrics={metrics.basic} rawData={rawData} />
    </div>
  );
};

export default DashBacklog;

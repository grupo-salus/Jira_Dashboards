import React, { useEffect, useState } from "react";
import { fetchBacklogTable } from "../api/api_jira";
import { BacklogItem } from "../types/backlog";
import { calculateBacklogMetrics } from "../utils/backlogMetrics";
import { BacklogKPICards } from "../components/dashboard/BacklogKPICards";
import BacklogQueues from "../components/dashboard/BacklogQueues";
import {
  BacklogCharts,
  TarefasPorPrioridadeChart,
  SaudeBacklogChart,
} from "../components/dashboard/BacklogCharts";

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
      <div className="flex flex-col gap-6">
        {/* Linha dos cards principais */}
        <div>
          <BacklogKPICards
            metrics={{
              ...metrics.basic,
              card_mais_antigo: {
                ...metrics.basic.card_mais_antigo,
                epico: metrics.basic.card_mais_antigo.epico ?? undefined,
              },
              ...(metrics.basic.primeiro_projeto
                ? { primeiro_projeto: metrics.basic.primeiro_projeto }
                : { primeiro_projeto: undefined }),
            }}
            rawData={rawData}
          />
        </div>
        {/* Área central: 9 gráficos à esquerda, filas à direita */}
        <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-6">
          {/* Coluna dos gráficos: grid 3x3 */}
          <div className="grid grid-cols-3 grid-rows-3 gap-6 w-full">
            <BacklogCharts
              epicosPorPrioridade={metrics.epicos_por_prioridade}
            />
            <TarefasPorPrioridadeChart
              tarefasPorPrioridade={metrics.tarefas_por_prioridade}
            />
            <SaudeBacklogChart saude={metrics.saude_backlog} />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-center min-h-[120px]">
              <span className="text-gray-400">Componente 4</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-center min-h-[120px]">
              <span className="text-gray-400">Componente 5</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-center min-h-[120px]">
              <span className="text-gray-400">Componente 6</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-center min-h-[120px]">
              <span className="text-gray-400">Componente 7</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-center min-h-[120px]">
              <span className="text-gray-400">Componente 8</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-center min-h-[120px]">
              <span className="text-gray-400">Componente 9</span>
            </div>
          </div>
          {/* Coluna das filas */}
          <div className="w-full max-w-[420px]">
            <BacklogQueues
              filaAtual={metrics.fila_atual}
              filaPorProjeto={metrics.fila_por_projeto}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBacklog;

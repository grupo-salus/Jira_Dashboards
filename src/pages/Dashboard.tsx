import React, { useState, useEffect } from 'react';
import { fetchBacklogSummary, BacklogSummary } from '../api/api_jira';
import SummaryStats from '../components/dashboard/SummaryStats';
import PriorityDistribution from '../components/dashboard/PriorityDistribution';
import StatusDistribution from '../components/dashboard/StatusDistribution';
import DepartmentDistribution from '../components/dashboard/DepartmentDistribution';
import NextInQueueCard from '../components/dashboard/NextInQueueCard';
import RequestorsTable from '../components/dashboard/RequestorsTable';

interface DashboardProps {
  lastUpdate?: Date;
}

const Dashboard: React.FC<DashboardProps> = ({ lastUpdate }) => {
  const [backlogSummary, setBacklogSummary] = useState<BacklogSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const summary = await fetchBacklogSummary();
        setBacklogSummary(summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-error-500">
          <p className="text-xl font-semibold mb-2">Erro ao carregar dados</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!backlogSummary) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            JIRA Backlog Dashboard
          </h1>
          <p className="text-gray-500">
            Visualize e gerencie o backlog de forma eficiente
          </p>
        </div>
        {lastUpdate && (
          <div className="text-xs text-gray-400 mt-2 md:mt-0 md:text-right">
            Última atualização: {lastUpdate.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: '2-digit' })}
          </div>
        )}
      </div>
      <SummaryStats summary={backlogSummary} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="h-[400px]">
          <PriorityDistribution data={backlogSummary.por_prioridade} />
        </div>
        <div className="h-[400px]">
          <StatusDistribution data={backlogSummary.por_status} />
        </div>
        <div className="h-[400px]">
          <DepartmentDistribution data={backlogSummary.por_departamento} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="h-[500px]">
          <NextInQueueCard nextItems={backlogSummary.top_5_fila} />
        </div>
        <div className="h-[500px]">
          <RequestorsTable data={backlogSummary.por_solicitante} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
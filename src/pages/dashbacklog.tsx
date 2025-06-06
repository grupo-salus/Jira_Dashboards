import React from 'react';
import { useBacklog } from '../context/BacklogContext';
import {
  KPICards,
  PriorityDistributionChart,
  StatusDistributionChart,
  AgeDistributionChart,
  WorkloadByDepartmentChart,
  PriorityByDepartmentHeatmap,
  EpicDistributionChart,
  CardsWithoutEpicTable,
  QueueHighlights
} from '../components/dashboard/BacklogCharts';

interface DashBacklogProps {
  lastUpdate?: Date;
}

const DashBacklog: React.FC<DashBacklogProps> = ({ lastUpdate }) => {
  const { data, loading, error, refreshData } = useBacklog();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">Carregando dados do backlog...</div>
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

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">Nenhum dado disponível</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="text-2xl font-bold mb-2">Dashboard do Backlog</h1>
      {lastUpdate && (
        <div className="text-xs text-gray-400 mb-6">
          Última atualização: {lastUpdate.toLocaleString('pt-BR')}
        </div>
      )}

      {/* KPI Cards */}
      <KPICards data={data} />

      {/* Destaques da Fila */}
      <QueueHighlights data={data} />

      {/* Grid de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna 1 */}
        <div>
          <PriorityDistributionChart data={data} />
          <StatusDistributionChart data={data} />
          <AgeDistributionChart data={data} />
        </div>

        {/* Coluna 2 */}
        <div>
          <WorkloadByDepartmentChart data={data} />
          <PriorityByDepartmentHeatmap data={data} />
          <EpicDistributionChart data={data} />
        </div>
      </div>

      {/* Tabela de Cards sem Épico */}
      <CardsWithoutEpicTable data={data} />
    </div>
  );
};

export default DashBacklog; 
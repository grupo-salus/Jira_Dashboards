import React, { useState, useEffect } from 'react';
import { BacklogFilter, DepartmentType } from '../types/backlog';
import { fetchBacklogSummary, BacklogSummary } from '../api/backlog';
import SummaryStats from '../components/dashboard/SummaryStats';
import PriorityDistribution from '../components/dashboard/PriorityDistribution';
import GroupDistribution from '../components/dashboard/GroupDistribution';
import DepartmentDistribution from '../components/dashboard/DepartmentDistribution';
import FilterBar from '../components/dashboard/FilterBar';
import NextInQueueCard from '../components/dashboard/NextInQueueCard';
import RequestorsTable from '../components/dashboard/RequestorsTable';
import DepartmentCards from '../components/dashboard/DepartmentCards';

interface DashboardProps {
  view: 'backlog' | 'sprint';
}

const Dashboard: React.FC<DashboardProps> = ({ view }) => {
  const [backlogSummary, setBacklogSummary] = useState<BacklogSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<BacklogFilter>({
    priority: 'All',
    department: 'All',
    requestGroup: 'All',
    requestor: 'All',
    searchTerm: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const summary = await fetchBacklogSummary({
          departamento: filters.department !== 'All' ? filters.department : undefined,
          prioridade: filters.priority !== 'All' ? filters.priority : undefined,
          grupo_solicitante: filters.requestGroup !== 'All' ? filters.requestGroup : undefined,
          solicitante: filters.requestor !== 'All' ? filters.requestor : undefined
        });
        
        setBacklogSummary(summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filters]);

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {view === 'backlog' ? 'JIRA Backlog Dashboard' : 'Sprint Ativa Dashboard'}
        </h1>
        <p className="text-gray-500">
          {view === 'backlog' 
            ? 'Visualize e gerencie o backlog de forma eficiente'
            : 'Acompanhe o progresso da sprint atual'
          }
        </p>
      </div>
      
      <SummaryStats summary={backlogSummary} />
      
      <DepartmentCards 
        departments={Object.keys(backlogSummary.por_departamento) as DepartmentType[]}
        onSelectDepartment={(dept) => setFilters(prev => ({ ...prev, department: dept }))}
        data={backlogSummary.por_departamento}
      />
      
      <FilterBar 
        filters={filters}
        setFilters={setFilters}
        departments={Object.keys(backlogSummary.por_departamento) as DepartmentType[]}
        requestors={Object.keys(backlogSummary.por_solicitante)}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="h-[400px]">
          <PriorityDistribution data={backlogSummary.por_prioridade} />
        </div>
        <div className="h-[400px]">
          <GroupDistribution data={backlogSummary.por_status} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 h-[500px]">
          <DepartmentDistribution 
            data={backlogSummary.por_departamento}
            onDepartmentClick={(dept) => setFilters(prev => ({ ...prev, department: dept }))}
          />
        </div>
        <div className="h-[500px]">
          <NextInQueueCard nextItems={backlogSummary.top_5_fila} />
        </div>
      </div>
      
      <div className="mb-6">
        <RequestorsTable 
          data={backlogSummary.por_solicitante}
          onSelectRequestor={(requestor) => setFilters(prev => ({ ...prev, requestor }))}
        />
      </div>
    </div>
  );
};

export default Dashboard;
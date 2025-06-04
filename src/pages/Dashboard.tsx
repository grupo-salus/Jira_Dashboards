import React, { useState, useMemo, useEffect } from 'react';
import { BacklogItem, BacklogFilter, DepartmentType } from '../types/backlog';
import { fetchBacklogData, fetchSprintData } from '../api/backlog';
import SummaryStats from '../components/dashboard/SummaryStats';
import PriorityDistribution from '../components/dashboard/PriorityDistribution';
import GroupDistribution from '../components/dashboard/GroupDistribution';
import DepartmentDistribution from '../components/dashboard/DepartmentDistribution';
import FilterBar from '../components/dashboard/FilterBar';
import BacklogTable from '../components/dashboard/BacklogTable';
import NextInQueueCard from '../components/dashboard/NextInQueueCard';
import RequestorsTable from '../components/dashboard/RequestorsTable';
import DepartmentCards from '../components/dashboard/DepartmentCards';
import { calculateTimeInQueue, formatTimeToString } from '../utils/formatters';

interface DashboardProps {
  view: 'backlog' | 'sprint';
}

const Dashboard: React.FC<DashboardProps> = ({ view }) => {
  const [backlogData, setBacklogData] = useState<BacklogItem[]>([]);
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
        
        const data = await (view === 'backlog' ? fetchBacklogData() : fetchSprintData());
        
        // Enrich the data with calculated fields
        const enrichedData = data.map(item => {
          const timeInQueue = calculateTimeInQueue(item['Data de Criação']);
          
          return {
            ...item,
            timeInQueue: formatTimeToString(timeInQueue),
            progressPercentage: Math.min(
              Math.round((item['Controle de Tempo (segundos)'] / (item['Estimativa Original (segundos)'] || 1)) * 100), 
              100
            )
          };
        });
        
        setBacklogData(enrichedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [view]);
  
  // Extract unique departments from data
  const departments = useMemo<DepartmentType[]>(() => {
    if (!backlogData.length) return [];
    
    const deptSet = new Set<DepartmentType>();
    backlogData.forEach(item => {
      if (item['Unidade / Departamento']) {
        deptSet.add(item['Unidade / Departamento'] as DepartmentType);
      }
    });
    
    return Array.from(deptSet);
  }, [backlogData]);
  
  // Extract unique requestors from data
  const requestors = useMemo<string[]>(() => {
    if (!backlogData.length) return [];
    
    const requestorSet = new Set<string>();
    backlogData.forEach(item => {
      if (item.Solicitante) {
        requestorSet.add(item.Solicitante);
      }
    });
    
    return Array.from(requestorSet);
  }, [backlogData]);
  
  // Filter the data based on active filters
  const filteredData = useMemo(() => {
    return backlogData.filter(item => {
      if (filters.priority !== 'All' && item.Prioridade !== filters.priority) return false;
      if (filters.department !== 'All' && item['Unidade / Departamento'] !== filters.department) return false;
      if (filters.requestGroup !== 'All' && item['Grupo Solicitante'] !== filters.requestGroup) return false;
      if (filters.requestor !== 'All' && item.Solicitante !== filters.requestor) return false;
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          item.Título.toLowerCase().includes(searchLower) ||
          item.Chave.toLowerCase().includes(searchLower) ||
          item.Descrição?.toLowerCase().includes(searchLower) ||
          item.Solicitante?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [backlogData, filters]);
  
  // Get next items in queue (items in "To Do" status ordered by priority)
  const nextInQueue = useMemo(() => {
    return backlogData
      .filter(item => item.Status === 'To Do')
      .sort((a, b) => {
        // Sort by priority first
        const priorityOrder = { 'Highest': 0, 'High': 1, 'Medium': 2, 'Low': 3, 'Lowest': 4 };
        const aPriority = priorityOrder[a.Prioridade as keyof typeof priorityOrder] || 999;
        const bPriority = priorityOrder[b.Prioridade as keyof typeof priorityOrder] || 999;
        
        if (aPriority !== bPriority) return aPriority - bPriority;
        
        // Then by calculated priority
        return b['Prioridade Calculada'] - a['Prioridade Calculada'];
      });
  }, [backlogData]);
  
  // Handle department selection
  const handleDepartmentSelect = (dept: DepartmentType) => {
    setFilters(prev => ({
      ...prev,
      department: dept
    }));
  };
  
  // Handle requestor selection
  const handleRequestorSelect = (requestor: string) => {
    setFilters(prev => ({
      ...prev,
      requestor
    }));
  };

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
      
      <SummaryStats backlogItems={backlogData} />
      
      <DepartmentCards 
        backlogItems={backlogData} 
        departments={departments}
        onSelectDepartment={handleDepartmentSelect}
      />
      
      <FilterBar 
        filters={filters} 
        setFilters={setFilters}
        departments={departments}
        requestors={requestors}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PriorityDistribution backlogItems={filteredData} />
        <GroupDistribution backlogItems={filteredData} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <DepartmentDistribution 
            backlogItems={backlogData} 
            onDepartmentClick={(dept) => setFilters(prev => ({ ...prev, department: dept }))}
          />
        </div>
        <NextInQueueCard nextItems={nextInQueue} />
      </div>
      
      <div className="mb-6">
        <RequestorsTable 
          backlogItems={backlogData} 
          onSelectRequestor={handleRequestorSelect}
        />
      </div>
      
      <BacklogTable backlogItems={filteredData} />
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { BacklogFilter, DepartmentType, PriorityType, GroupType } from '../../types/backlog';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  filters: BacklogFilter;
  setFilters: React.Dispatch<React.SetStateAction<BacklogFilter>>;
  departments: DepartmentType[];
  requestors: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, departments, requestors }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  return (
    <div className="card mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2 text-gray-500" />
          <span className="font-medium">Filtros:</span>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs text-gray-500 mb-1">Prioridade</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as PriorityType | 'All' }))}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            >
              <option value="All">Todas</option>
              <option value="Highest">Highest</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Lowest">Lowest</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs text-gray-500 mb-1">Departamento</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value as DepartmentType | 'All' }))}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            >
              <option value="All">Todos</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs text-gray-500 mb-1">Grupo Solicitante</label>
            <select
              value={filters.requestGroup}
              onChange={(e) => setFilters(prev => ({ ...prev, requestGroup: e.target.value as GroupType | 'All' }))}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            >
              <option value="All">Todos</option>
              <option value="Franqueado">Franqueado</option>
              <option value="Franqueadora">Franqueadora</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs text-gray-500 mb-1">Solicitante</label>
            <select
              value={filters.requestor}
              onChange={(e) => setFilters(prev => ({ ...prev, requestor: e.target.value }))}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            >
              <option value="All">Todos</option>
              {requestors.map(requestor => (
                <option key={requestor} value={requestor}>{requestor}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-500 mb-1">Buscar</label>
            <input
              type="text"
              placeholder="Título, ID ou descrição..."
              value={filters.searchTerm}
              onChange={handleSearch}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
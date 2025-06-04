import React, { useState } from 'react';
import { BacklogItem } from '../../types/backlog';
import { formatEstimatedTime, getPriorityColorClass, formatTimeToString, calculateTimeInQueue } from '../../utils/formatters';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BacklogTableProps {
  backlogItems: BacklogItem[];
}

const BacklogTable: React.FC<BacklogTableProps> = ({ backlogItems }) => {
  const [sortField, setSortField] = useState<keyof BacklogItem>('Prioridade Calculada');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleSort = (field: keyof BacklogItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedItems = [...backlogItems].sort((a, b) => {
    let comparison = 0;
    
    if ((a?.[sortField] ?? '') < (b?.[sortField] ?? '')) {
      comparison = -1;
    } else if ((a?.[sortField] ?? '') > (b?.[sortField] ?? '')) {
      comparison = 1;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const toggleRowExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="card overflow-hidden">
      <h2 className="text-lg font-semibold mb-4">Backlog Completo</h2>
      
      <div className="overflow-x-auto">
        <table className="backlog-table">
          <thead>
            <tr>
              <th className="w-12"></th>
              <th 
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750"
                onClick={() => handleSort('Chave')}
              >
                <div className="flex items-center">
                  ID
                  {sortField === 'Chave' && (
                    sortDirection === 'asc' ? 
                    <ChevronUp className="ml-1 h-4 w-4" /> : 
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750"
                onClick={() => handleSort('Título')}
              >
                <div className="flex items-center">
                  Título
                  {sortField === 'Título' && (
                    sortDirection === 'asc' ? 
                    <ChevronUp className="ml-1 h-4 w-4" /> : 
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th>Tipo</th>
              <th>Status</th>
              <th 
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750"
                onClick={() => handleSort('Prioridade')}
              >
                <div className="flex items-center">
                  Prioridade
                  {sortField === 'Prioridade' && (
                    sortDirection === 'asc' ? 
                    <ChevronUp className="ml-1 h-4 w-4" /> : 
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th>Solicitante</th>
              <th>Departamento</th>
              <th>Grupo</th>
              <th 
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750"
                onClick={() => handleSort('Data de Criação')}
              >
                <div className="flex items-center">
                  Tempo na Fila
                  {sortField === 'Data de Criação' && (
                    sortDirection === 'asc' ? 
                    <ChevronUp className="ml-1 h-4 w-4" /> : 
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750"
                onClick={() => handleSort('Estimativa Original (segundos)')}
              >
                <div className="flex items-center">
                  Estimativa
                  {sortField === 'Estimativa Original (segundos)' && (
                    sortDirection === 'asc' ? 
                    <ChevronUp className="ml-1 h-4 w-4" /> : 
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map(item => {
              const timeInQueue = calculateTimeInQueue(item['Data de Criação']);
              const timeInQueueStr = formatTimeToString(timeInQueue);
              const isExpanded = expandedRow === item.ID;
              
              return (
                <React.Fragment key={item.ID}>
                  <tr 
                    className={`${isExpanded ? 'bg-blue-50 dark:bg-blue-900/20' : ''} hover:bg-gray-50 dark:hover:bg-gray-750`}
                    onClick={() => toggleRowExpand(item.ID)}
                  >
                    <td className="text-center">
                      {isExpanded ? 
                        <ChevronUp className="inline-block h-4 w-4 text-gray-500" /> : 
                        <ChevronDown className="inline-block h-4 w-4 text-gray-500" />
                      }
                    </td>
                    <td>{item.Chave}</td>
                    <td className="max-w-[300px] truncate">{item.Título}</td>
                    <td>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                        {item.Tipo}
                      </span>
                    </td>
                    <td>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {item.Status}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColorClass(item.Prioridade)}`}>
                        {item.Prioridade}
                      </span>
                    </td>
                    <td>{item.Solicitante}</td>
                    <td>{item['Unidade / Departamento']}</td>
                    <td>{item['Grupo Solicitante']}</td>
                    <td>{timeInQueueStr}</td>
                    <td>{formatEstimatedTime(item['Estimativa Original (segundos)'])}</td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-blue-50 dark:bg-blue-900/10">
                      <td colSpan={11} className="p-4 border-b">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Detalhes do Card</h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Responsável:</span> {item['Responsável (Dev)']}</p>
                              <p><span className="font-medium">Sprint:</span> {item.Sprint}</p>
                              <p><span className="font-medium">Versão:</span> {item.Versão}</p>
                              <p><span className="font-medium">Relator Técnico:</span> {item['Relator Técnico']}</p>
                              <p><span className="font-medium">Branch:</span> {item.Branch}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Descrição</h4>
                            <div className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 max-h-32 overflow-y-auto">
                              <p className="whitespace-pre-line">{item.Descrição}</p>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2">
                            <h4 className="font-semibold text-sm mb-2">Tempo e Progresso</h4>
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 w-full">
                              <div 
                                className="bg-blue-500 h-4 rounded-full"
                                style={{ 
                                  width: `${Math.min(
                                    (item['Controle de Tempo (segundos)'] / item['Estimativa Original (segundos)']) * 100, 
                                    100
                                  )}%` 
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                              <span>
                                Tempo gasto: {formatEstimatedTime(item['Controle de Tempo (segundos)'])}
                              </span>
                              <span>
                                {Math.min(
                                  Math.round((item['Controle de Tempo (segundos)'] / item['Estimativa Original (segundos)']) * 100), 
                                  100
                                )}% concluído
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BacklogTable;
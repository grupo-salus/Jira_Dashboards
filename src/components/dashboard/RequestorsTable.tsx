import React, { useMemo } from 'react';
import { BacklogItem } from '../../types/backlog';

interface RequestorsTableProps {
  backlogItems: BacklogItem[];
  onSelectRequestor: (requestor: string) => void;
}

const RequestorsTable: React.FC<RequestorsTableProps> = ({ 
  backlogItems,
  onSelectRequestor
}) => {
  // Get unique requestors and their card counts
  const requestorStats = useMemo(() => {
    const stats: Record<string, { count: number, departments: Set<string>, priorities: Record<string, number> }> = {};
    
    backlogItems.forEach(item => {
      const requestor = item.Solicitante;
      if (!requestor) return;
      
      if (!stats[requestor]) {
        stats[requestor] = { 
          count: 0, 
          departments: new Set(),
          priorities: {}
        };
      }
      
      stats[requestor].count++;
      stats[requestor].departments.add(item['Unidade / Departamento']);
      
      const priority = item.Prioridade;
      stats[requestor].priorities[priority] = (stats[requestor].priorities[priority] || 0) + 1;
    });
    
    return Object.entries(stats)
      .map(([name, data]) => ({
        name,
        count: data.count,
        departments: Array.from(data.departments),
        priorities: data.priorities
      }))
      .sort((a, b) => b.count - a.count);
  }, [backlogItems]);

  return (
    <div className="card overflow-hidden">
      <h2 className="text-lg font-semibold mb-4">Solicitantes</h2>
      
      <div className="overflow-x-auto">
        <table className="backlog-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cards</th>
              <th>Departamentos</th>
              <th>Prioridades</th>
            </tr>
          </thead>
          <tbody>
            {requestorStats.map(requestor => (
              <tr 
                key={requestor.name}
                onClick={() => onSelectRequestor(requestor.name)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                <td className="font-medium">{requestor.name}</td>
                <td>{requestor.count}</td>
                <td className="max-w-[200px]">
                  <div className="flex flex-wrap gap-1">
                    {requestor.departments.map(dept => (
                      <span 
                        key={dept} 
                        className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="flex gap-1">
                    {Object.entries(requestor.priorities)
                      .sort(([aPriority], [bPriority]) => {
                        const priorityOrder = { 'Highest': 0, 'High': 1, 'Medium': 2, 'Low': 3, 'Lowest': 4 };
                        return priorityOrder[aPriority as keyof typeof priorityOrder] - 
                               priorityOrder[bPriority as keyof typeof priorityOrder];
                      })
                      .map(([priority, count]) => (
                        <div 
                          key={priority} 
                          className="flex items-center"
                        >
                          <span 
                            className={`inline-block w-2 h-2 rounded-full mr-1 ${
                              priority === 'Highest' ? 'bg-red-500' :
                              priority === 'High' ? 'bg-orange-500' :
                              priority === 'Medium' ? 'bg-yellow-500' :
                              priority === 'Low' ? 'bg-blue-500' :
                              'bg-green-500'
                            }`}
                          ></span>
                          <span className="text-xs">{count}</span>
                        </div>
                      ))
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestorsTable;
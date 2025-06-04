import React from 'react';
import { BacklogItem } from '../../types/backlog';
import { ArrowRight, Clock, UserCheck } from 'lucide-react';
import { formatEstimatedTime, getPriorityColorClass } from '../../utils/formatters';

interface NextInQueueCardProps {
  nextItems: BacklogItem[];
}

const NextInQueueCard: React.FC<NextInQueueCardProps> = ({ nextItems }) => {
  if (!nextItems.length) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Próximos na Fila</h2>
        <p className="text-gray-500">Nenhum item na fila</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Próximos na Fila</h2>
      <div className="space-y-4">
        {nextItems.slice(0, 5).map((item, index) => (
          <div key={item.ID} className="flex flex-col">
            <div className="flex items-center mb-2">
              {index === 0 && (
                <div className="flex-shrink-0 mr-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center font-semibold text-lg animate-pulse">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              )}
              
              {index > 0 && (
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
              )}
              
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{item.Título}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColorClass(item.Prioridade)}`}>
                    {item.Prioridade}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    {item.Solicitante}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatEstimatedTime(item['Estimativa Original (segundos)'])}
                  </span>
                </div>
              </div>
              
              <div className="flex-shrink-0 text-xs text-gray-500">
                {item['Unidade / Departamento']}
              </div>
            </div>
            
            {index < 4 && <div className="border-b border-gray-100 dark:border-gray-700 my-2"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextInQueueCard;
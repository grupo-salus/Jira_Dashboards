import React from 'react';
import { Clock } from 'lucide-react';

interface NextInQueueItem {
  Chave: string;
  Título: string;
  dias: number;
}

interface NextInQueueCardProps {
  nextItems: NextInQueueItem[];
}

const NextInQueueCard: React.FC<NextInQueueCardProps> = ({ nextItems }) => {
  return (
    <div className="card h-full">
      <h2 className="text-lg font-semibold mb-4">Próximos na Fila</h2>
      
      {nextItems.length > 0 ? (
        <div className="space-y-4 h-[calc(100%-3rem)] overflow-y-auto pr-2">
          {nextItems.map((item) => (
            <div 
              key={item.Chave}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" title={item.Título}>
                    {item.Título}
                  </p>
                  <p className="text-xs text-gray-500">{item.Chave}</p>
                </div>
                <div className="flex items-center ml-4 text-sm text-gray-500 whitespace-nowrap">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{item.dias} dias</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[calc(100%-3rem)]">
          <p className="text-gray-500">Nenhum item na fila</p>
        </div>
      )}
    </div>
  );
};

export default NextInQueueCard;
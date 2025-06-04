import React from 'react';
import { formatTimeToString, calculateAverageTime } from '../../utils/formatters';
import { BacklogItem } from '../../types/backlog';
import { FileText, Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface SummaryStatsProps {
  backlogItems: BacklogItem[];
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ backlogItems }) => {
  const totalCards = backlogItems.length;
  const avgTime = calculateAverageTime(backlogItems);
  const avgTimeString = formatTimeToString(avgTime);
  
  const completedCards = backlogItems.filter(item => item.Status === 'Done').length;
  const completionRate = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;
  
  const oldestCard = backlogItems.reduce((oldest, current) => {
    const oldestDate = new Date(oldest['Data de Criação']);
    const currentDate = new Date(current['Data de Criação']);
    return currentDate < oldestDate ? current : oldest;
  }, backlogItems[0]);
  
  const oldestCardDate = oldestCard ? new Date(oldestCard['Data de Criação']).toLocaleDateString() : 'N/A';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="card flex items-center">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total de Cards</p>
          <p className="text-2xl font-semibold">{totalCards}</p>
        </div>
      </div>
      
      <div className="card flex items-center">
        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-4">
          <Clock className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Tempo Médio</p>
          <p className="text-2xl font-semibold">{avgTimeString}</p>
        </div>
      </div>
      
      <div className="card flex items-center">
        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Taxa de Conclusão</p>
          <p className="text-2xl font-semibold">{completionRate}%</p>
        </div>
      </div>
      
      <div className="card flex items-center">
        <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mr-4">
          <Calendar className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Card Mais Antigo</p>
          <p className="text-xl font-semibold">{oldestCardDate}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;
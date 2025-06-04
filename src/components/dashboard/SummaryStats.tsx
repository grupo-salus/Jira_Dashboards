import React from 'react';
import { BacklogSummary } from '../../api/api_jira';
import { FileText, Clock, Calendar, AlertTriangle } from 'lucide-react';

interface SummaryStatsProps {
  summary: BacklogSummary;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="card flex items-center">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total de Cards</p>
          <p className="text-2xl font-semibold">{summary.total}</p>
        </div>
      </div>
      
      <div className="card flex items-center">
        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-4">
          <Clock className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Tempo Médio (dias)</p>
          <p className="text-2xl font-semibold">{summary.tempo_medio}</p>
        </div>
      </div>
      
      <div className="card">
        <div className="flex items-center mb-2">
          <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mr-4">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Card Mais Antigo</p>
            <p className="text-xl font-semibold">{summary.mais_antigo.dias_no_backlog} dias</p>
          </div>
        </div>
        <div className="pl-16">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {summary.mais_antigo.chave}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={summary.mais_antigo.titulo}>
            {summary.mais_antigo.titulo}
          </p>
        </div>
      </div>
      
      <div className="card flex items-center">
        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Acima de 15 dias</p>
          <p className="text-2xl font-semibold">{summary.acima_de_15_dias}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats
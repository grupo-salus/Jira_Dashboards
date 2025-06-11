/**
 * SprintDashboard.tsx
 * 
 * Este é o componente do dashboard de sprint que:
 * 1. Exibe uma mensagem de "em desenvolvimento"
 * 2. Lista as funcionalidades futuras
 * 3. Serve como placeholder para a implementação futura
 * 
 * Funcionalidades planejadas:
 * - Visualização de sprints ativas
 * - Acompanhamento de progresso
 * - Métricas de velocidade
 * - Monitoramento de burndown
 */

import React from "react";

interface SprintDashboardProps {
  lastUpdate?: Date;
}

const SprintDashboard: React.FC<SprintDashboardProps> = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Dashboard de Sprint em Desenvolvimento
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Estamos trabalhando para trazer uma visão completa das sprints ativas.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200">
            Em breve você poderá:
          </p>
          <ul className="list-disc list-inside mt-2 text-blue-700 dark:text-blue-300">
            <li>Visualizar sprints ativas</li>
            <li>Acompanhar o progresso das tarefas</li>
            <li>Analisar métricas de velocidade</li>
            <li>Monitorar o burndown</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SprintDashboard;

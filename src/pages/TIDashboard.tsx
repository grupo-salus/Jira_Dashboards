/**
 * TIDashboard.tsx
 *
 * Este é o componente do dashboard de acompanhamento de TI que:
 * 1. Exibe uma mensagem de "em desenvolvimento"
 * 2. Lista as funcionalidades futuras
 * 3. Serve como placeholder para a implementação futura
 *
 * Funcionalidades planejadas:
 * - Visualização de atividades por membro da equipe
 * - Métricas de produtividade
 * - Distribuição de carga de trabalho
 * - Acompanhamento de prazos
 */

import React from "react";

interface TIDashboardProps {
  lastUpdate?: Date;
}

const TIDashboard: React.FC<TIDashboardProps> = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Dashboard de Acompanhamento TI em Desenvolvimento
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Estamos trabalhando para trazer uma visão completa das atividades da
          equipe de TI.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200">
            Em breve você poderá:
          </p>
          <ul className="list-disc list-inside mt-2 text-blue-700 dark:text-blue-300">
            <li>Visualizar atividades por membro da equipe</li>
            <li>Acompanhar métricas de produtividade</li>
            <li>Analisar distribuição de carga de trabalho</li>
            <li>Monitorar prazos e entregas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TIDashboard;

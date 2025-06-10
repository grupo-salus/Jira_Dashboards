import React, { useState } from "react";
import { getPriorityConfig } from "../../constants/priorities";

interface BacklogKPICardsProps {
  metrics: {
    total_cards: number;
    total_epicos: number;
    idade_media_dias: number;
    card_mais_antigo: {
      chave: string;
      titulo: string;
      dias: number;
      epico?: string | null;
    };
    primeiro_projeto?: {
      epico: string;
      area: string;
      prioridade: string;
      chave: string;
    };
  };
  rawData: {
    Chave: string;
    Título: string;
    Épico: string | null;
    Tipo: string;
    Prioridade: string;
  }[];
}

export const BacklogKPICards: React.FC<BacklogKPICardsProps> = ({
  metrics,
  rawData,
}) => {
  const [showCardsTooltip, setShowCardsTooltip] = useState(false);
  const [showEpicsTooltip, setShowEpicsTooltip] = useState(false);

  // Filtrar subtarefas e preparar dados para tooltips
  const cards = rawData;
  const epicos = Array.from(
    new Set(cards.map((item) => item.Épico).filter(Boolean))
  );

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {/* Card Total de Cards */}
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onMouseEnter={() => setShowCardsTooltip(true)}
        onMouseLeave={() => setShowCardsTooltip(false)}
      >
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm text-left">
              Total de Cards
            </h3>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200 text-left">
              {metrics.total_cards}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">
              Tarefas dentro dos projetos/épicos
            </p>
          </div>
        </div>
        {showCardsTooltip && (
          <div className="absolute z-10 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
              Lista de Cards
            </h4>
            <div className="max-h-40 overflow-y-auto">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="text-sm py-1 border-b last:border-b-0 border-gray-200 dark:border-gray-700"
                >
                  <p className="font-medium text-gray-700 dark:text-gray-200">
                    {card.Chave}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {card.Título}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Total de Épicos */}
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onMouseEnter={() => setShowEpicsTooltip(true)}
        onMouseLeave={() => setShowEpicsTooltip(false)}
      >
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm text-left">
              Total de Épicos
            </h3>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200 text-left">
              {metrics.total_epicos}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">
              Projetos criados no backlog
            </p>
          </div>
        </div>
        {showEpicsTooltip && (
          <div className="absolute z-10 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
              Lista de Épicos
            </h4>
            <div className="max-h-40 overflow-y-auto">
              {epicos.map((epico, index) => {
                const cardsDoEpico = rawData.filter(
                  (card) => card.Épico === epico
                );
                const prioridade =
                  cardsDoEpico.length > 0
                    ? cardsDoEpico[0].Prioridade
                    : "Não definida";
                const priorityConfig = getPriorityConfig(prioridade);
                return (
                  <div
                    key={index}
                    className="text-sm py-2 border-b last:border-b-0 border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-700 dark:text-gray-200">
                        {epico}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityConfig.color.bg} ${priorityConfig.color.text} ${priorityConfig.color.dark.bg} ${priorityConfig.color.dark.text}`}
                      >
                        {priorityConfig.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {cardsDoEpico.length}{" "}
                      {cardsDoEpico.length === 1 ? "card" : "cards"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Card Idade Média */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm text-left">
              Idade Média
            </h3>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200 text-left">
              {metrics.idade_media_dias} dias
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">
              Tempo médio dos cards no backlog
            </p>
          </div>
        </div>
      </div>

      {/* Card Mais Antigo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm text-left">
              Card Mais Antigo
            </h3>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 text-left">
              {metrics.card_mais_antigo.chave}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
              {metrics.card_mais_antigo.titulo}
            </p>
            {metrics.card_mais_antigo.epico && (
              <p className="text-sm text-red-600 dark:text-red-400 text-left">
                Épico: {metrics.card_mais_antigo.epico}
              </p>
            )}
            <p className="text-sm text-red-600 dark:text-red-400 mt-1 text-left">
              {metrics.card_mais_antigo.dias} dias
            </p>
          </div>
        </div>
      </div>

      {/* Card Próximo Projeto */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm text-left">
              Próximo Projeto
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">
              Projeto prioritário a ser iniciado
            </p>
            {metrics.primeiro_projeto ? (
              <>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 text-left">
                  {metrics.primeiro_projeto.epico}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {metrics.primeiro_projeto.area}
                  </span>
                  {(() => {
                    const priorityConfig = getPriorityConfig(
                      metrics.primeiro_projeto.prioridade
                    );
                    return (
                      <span
                        className={`text-sm font-medium px-2 py-0.5 rounded-full ${priorityConfig.color.bg} ${priorityConfig.color.text} ${priorityConfig.color.dark.bg} ${priorityConfig.color.dark.text}`}
                      >
                        {priorityConfig.label}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-left">
                  {metrics.primeiro_projeto.chave}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-left">
                Nenhum projeto encontrado
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

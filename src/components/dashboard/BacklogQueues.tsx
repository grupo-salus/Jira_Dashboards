import React from "react";
import { FilaItem } from "../../utils/backlogMetrics";
import { getPriorityConfig } from "../../constants/priorities";

interface BacklogQueuesProps {
  filaAtual: FilaItem[];
  filaPorProjeto: FilaItem[];
}

export const BacklogQueues: React.FC<BacklogQueuesProps> = ({
  filaAtual,
  filaPorProjeto,
}) => (
  <div className="flex flex-col gap-6 h-full">
    {/* Fila por Projeto */}
    <div className="card flex-1 p-0">
      <div className="flex items-center gap-2 px-2 py-3 w-full bg-white dark:bg-gray-800">
        {/* SVG de projeto */}
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h10v2H4v-2zm0 4h10v2H4v-2z"
          />
        </svg>
        <h2 className="text-lg font-semibold">
          Fila por Projeto
          <span className="ml-2 text-base text-gray-500 dark:text-gray-300 font-normal">
            ({filaPorProjeto.length})
          </span>
        </h2>
      </div>
      <div className="px-2 pb-1 text-xs text-gray-500 dark:text-gray-400">
        Um card por projeto (épico) do backlog.
      </div>
      <div className="overflow-y-auto max-h-[350px] flex flex-col gap-2 px-2">
        {filaPorProjeto.map((item, idx) => {
          const priority = getPriorityConfig(item.prioridade);
          return (
            <div
              key={item.chave}
              className="border rounded p-2 mb-1 bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-gray-500">{idx + 1}.</span>
                <span className="font-bold">{item.chave}</span>
                <span
                  className={`px-2 py-0.5 rounded font-semibold ${priority.color.bg} ${priority.color.text} ${priority.color.dark.bg} ${priority.color.dark.text}`}
                >
                  {priority.label}
                </span>
                <span
                  className="bg-purple-700 text-purple-200 rounded px-2 py-0.5 font-semibold"
                  style={{ minWidth: 32, display: "inline-block" }}
                >
                  {item.epico || "-"}
                </span>
                <span className="truncate max-w-[80px]">{item.area}</span>
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-full pl-1">
                {item.titulo}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    {/* Fila Atual */}
    <div className="card flex-1 p-0">
      <div className="flex items-center gap-2 px-2 py-3 w-full bg-white dark:bg-gray-800">
        {/* SVG de lista */}
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
          />
        </svg>
        <h2 className="text-lg font-semibold">
          Fila Atual
          <span className="ml-2 text-base text-gray-500 dark:text-gray-300 font-normal">
            ({filaAtual.length})
          </span>
        </h2>
      </div>
      <div className="px-2 pb-1 text-xs text-gray-500 dark:text-gray-400">
        Todos os cards do backlog (incluindo subtarefas).
      </div>
      <div className="overflow-y-auto max-h-[320px] flex flex-col gap-2 px-2">
        {filaAtual.map((item, idx) => {
          const priority = getPriorityConfig(item.prioridade);
          return (
            <div
              key={item.chave}
              className="border rounded p-2 mb-1 bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-gray-500">{idx + 1}.</span>
                <span className="font-bold">{item.chave}</span>
                <span
                  className={`px-2 py-0.5 rounded font-semibold ${priority.color.bg} ${priority.color.text} ${priority.color.dark.bg} ${priority.color.dark.text}`}
                >
                  {priority.label}
                </span>
                <span
                  className="bg-purple-700 text-purple-200 rounded px-2 py-0.5 font-semibold"
                  style={{ minWidth: 32, display: "inline-block" }}
                >
                  {item.epico || "-"}
                </span>
                <span className="truncate max-w-[80px]">{item.area}</span>
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-full pl-1">
                {item.titulo}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default BacklogQueues;

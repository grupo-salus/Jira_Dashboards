import React from "react";
import { EspacoDeProjetos, JiraStatus } from "../../types/Typesjira";
import {
  formatDate,
  formatarSegundos,
  getStatusColor,
  normalizarStatus,
} from "./kanbanUtils";
import {
  CalendarIcon,
  ClockIcon,
  FireIcon,
  CompassIcon,
  CardsIcon,
  EpicIcon,
  LightbulbIcon,
  ExclamationTriangleIcon,
} from "../icons/DashboardIcons";

// ============================================================================
// COMPONENTES DE CARDS ESPECÍFICOS POR STATUS
// ============================================================================

/**
 * Card para projetos em IDEAÇÃO (Backlog)
 */
const CardIdeacao: React.FC<{ projeto: EspacoDeProjetos }> = ({ projeto }) => (
  <div className="space-y-2 text-sm">
    <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm mb-2 break-words">
      <div className="bg-orange-400 rounded-md p-0.5 flex items-center justify-center">
        <LightbulbIcon size={16} className="text-white" />
      </div>
      <span>{projeto.Título}</span>
    </div>

    {/* Informações Gerais */}
    {projeto["Departamento Solicitante"] && (
      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md dark:bg-blue-900 dark:text-blue-300">
        {projeto["Departamento Solicitante"]}
      </span>
    )}
    {projeto.Categoria && (
      <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <CardsIcon size={16} className="text-purple-500" />
        Categoria: {projeto.Categoria}
      </div>
    )}

    <hr className="my-1 border-gray-300 dark:border-gray-600" />

    {/* Datas */}
    <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
      <CalendarIcon size={16} className="text-sky-500" />
      Criado em: {formatDate(projeto["Data de criação"])}
    </div>
    {projeto["Dias desde criação"] !== null && (
      <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <ClockIcon size={16} className="text-amber-500" />
        Em espera há: {projeto["Dias desde criação"]} dias
      </div>
    )}

    {/* Status de ideação */}
    {projeto["Status de ideação"] && (
      <>
        <hr className="my-1 border-gray-300 dark:border-gray-600" />
        <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <EpicIcon size={16} className="text-indigo-500" />
          <span>Status de ideação:</span>
          <span
            className={`ml-1 px-1 py-0.5 rounded text-xs font-medium ${getStatusColor(
              projeto["Status de ideação"]
            )}`}
          >
            {projeto["Status de ideação"]}
          </span>
        </div>
      </>
    )}
  </div>
);

/**
 * Card para projetos BLOQUEADOS
 */
const CardBloqueado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => (
  <div className="space-y-2 text-sm">
    <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm mb-2 break-words">
      <div className="bg-orange-400 rounded-md p-0.5 flex items-center justify-center">
        <LightbulbIcon size={16} className="text-white" />
      </div>
      <span>{projeto.Título}</span>
    </div>
    {/* Informações Gerais */}
    {projeto["Departamento Solicitante"] && (
      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md dark:bg-blue-900 dark:text-blue-300">
        {projeto["Departamento Solicitante"]}
      </span>
    )}
    {projeto.Categoria && (
      <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <CardsIcon size={16} className="text-purple-500" />
        Categoria: {projeto.Categoria}
      </div>
    )}

    <hr className="my-1 border-gray-300 dark:border-gray-600" />

    {/* Datas */}
    <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
      <CalendarIcon size={16} className="text-sky-500" />
      Criado em: {formatDate(projeto["Data de criação"])}
    </div>
    {projeto["Dias desde criação"] !== null && (
      <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <ClockIcon size={16} className="text-amber-500" />
        Em espera há: {projeto["Dias desde criação"]} dias
      </div>
    )}
    <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
      <CalendarIcon size={16} className="text-sky-500" />
      Última atualização: {formatDate(projeto["Data de atualização"])}
    </div>
  </div>
);

/**
 * Card para projetos em BACKLOG PRIORIZADO
 */
const CardBacklogPriorizado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => (
  <div className="space-y-2 text-sm">
    <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm mb-2 break-words">
      <div className="bg-orange-400 rounded-md p-0.5 flex items-center justify-center">
        <LightbulbIcon size={16} className="text-white" />
      </div>
      <span>{projeto.Título}</span>
    </div>
    {/* Informações Gerais */}
    {projeto["Departamento Solicitante"] && (
      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md dark:bg-blue-900 dark:text-blue-300">
        {projeto["Departamento Solicitante"]}
      </span>
    )}
    {projeto.Categoria && (
      <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <CardsIcon size={16} className="text-purple-500" />
        Categoria: {projeto.Categoria}
      </div>
    )}
    <hr className="my-1 border-gray-300 dark:border-gray-600" />

    {/* Datas */}
    <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
      <CalendarIcon size={16} className="text-sky-500" />
      Criado em: {formatDate(projeto["Data de criação"])}
    </div>
    {projeto["Dias desde criação"] !== null && (
      <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <ClockIcon size={16} className="text-amber-500" />
        Em espera há: {projeto["Dias desde criação"]} dias
      </div>
    )}
    {projeto["Target start"] && (
      <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <CalendarIcon size={16} className="text-sky-500" />
        Início previsto: {formatDate(projeto["Target start"])}
      </div>
    )}

    {/* Financeiro */}
    {projeto["Investimento Esperado"] && (
      <>
        <hr className="my-1 border-gray-300 dark:border-gray-600" />
        <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <ExclamationTriangleIcon size={16} className="text-red-500" />
          Investimento esperado: {projeto["Investimento Esperado"]}
        </div>
      </>
    )}
  </div>
);

/**
 * Componente reutilizável para métricas de execução
 */
const ExecutionMetrics: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => (
  <>
    <hr className="my-1 border-gray-300 dark:border-gray-600" />
    {/* Métricas de Tempo */}
    <div className="space-y-2">
      {projeto["Target start"] && projeto["Target end"] && (
        <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <CalendarIcon size={16} className="text-sky-500" />
          {formatDate(projeto["Target start"])} →{" "}
          {formatDate(projeto["Target end"])}
        </div>
      )}
      {projeto["Dias desde o início"] !== null &&
        projeto["Dias restantes"] !== null && (
          <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <ClockIcon size={16} className="text-amber-500" />
            {projeto["Dias desde o início"]} dias passados •{" "}
            {projeto["Dias restantes"]} dias restantes
          </div>
        )}
      {projeto["% do tempo decorrido"] !== null && (
        <div className="text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <ClockIcon size={16} className="text-amber-500" />
            <span>{projeto["% do tempo decorrido"]}% do tempo</span>
            {projeto["Status de prazo"] && (
              <span
                className={`ml-1 px-1 py-0.5 rounded text-xs font-medium ${getStatusColor(
                  projeto["Status de prazo"]
                )}`}
              >
                ({projeto["Status de prazo"]})
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{
                width: `${Math.min(
                  projeto["% do tempo decorrido"] || 0,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>

    <hr className="my-1 border-gray-300 dark:border-gray-600" />
    {/* Métricas de Esforço */}
    <div className="space-y-2">
      {projeto["Estimativa original (segundos)"] &&
        projeto["Tempo registrado (segundos)"] !== null && (
          <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <ClockIcon size={16} className="text-amber-500" />
            Estimativa:{" "}
            {formatarSegundos(projeto["Estimativa original (segundos)"])} •
            Registrado:{" "}
            {formatarSegundos(projeto["Tempo registrado (segundos)"])}
          </div>
        )}
      {projeto["% da estimativa usada"] !== null && (
        <div>
          <div className="flex items-center text-gray-600 dark:text-gray-400 gap-2">
            <ExclamationTriangleIcon size={16} className="text-red-500" />
            <span>Esforço: {projeto["% da estimativa usada"]}%</span>
            {projeto["Status de esforço"] && (
              <span
                className={`ml-1 px-1 py-0.5 rounded text-xs font-medium ${getStatusColor(
                  projeto["Status de esforço"]
                )}`}
              >
                ({projeto["Status de esforço"]})
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 dark:bg-gray-700">
            <div
              className="bg-green-600 h-1.5 rounded-full"
              style={{
                width: `${Math.min(
                  projeto["% da estimativa usada"] || 0,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  </>
);

/**
 * Card para projetos em EXECUÇÃO
 */
const CardEmExecucao: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => (
  <div className="space-y-2 text-sm">
    <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm mb-2 break-words">
      <div className="bg-orange-400 rounded-md p-0.5 flex items-center justify-center">
        <LightbulbIcon size={16} className="text-white" />
      </div>
      <span>{projeto.Título}</span>
    </div>
    {/* Informações Gerais */}
    {projeto["Departamento Solicitante"] && (
      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md dark:bg-blue-900 dark:text-blue-300">
        {projeto["Departamento Solicitante"]}
      </span>
    )}
    {projeto.Categoria && (
      <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <CardsIcon size={16} className="text-purple-500" />
        Categoria: {projeto.Categoria}
      </div>
    )}
    {/* Criado em */}
    <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
      <CalendarIcon size={16} className="text-sky-500" />
      Criado em: {formatDate(projeto["Data de criação"])}
    </div>
    <ExecutionMetrics projeto={projeto} />
  </div>
);

/**
 * Card para projetos em ENCERRAMENTO
 */
const CardEncerramento: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => (
  <div className="space-y-2 text-sm">
    <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm mb-2 break-words">
      <div className="bg-orange-400 rounded-md p-0.5 flex items-center justify-center">
        <LightbulbIcon size={16} className="text-white" />
      </div>
      <span>{projeto.Título}</span>
    </div>
    {/* Informações Gerais */}
    {projeto["Departamento Solicitante"] && (
      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md dark:bg-blue-900 dark:text-blue-300">
        {projeto["Departamento Solicitante"]}
      </span>
    )}
    {projeto.Categoria && (
      <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <CardsIcon size={16} className="text-purple-500" />
        Categoria: {projeto.Categoria}
      </div>
    )}

    <hr className="my-1 border-gray-300 dark:border-gray-600" />

    {/* Datas */}
    <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
      <CalendarIcon size={16} className="text-sky-500" />
      Criado em: {formatDate(projeto["Data de criação"])}
    </div>
    <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
      <CalendarIcon size={16} className="text-sky-500" />
      Resolvido em: {formatDate(projeto["Data de atualização"])}
    </div>
    <ExecutionMetrics projeto={projeto} />
  </div>
);

/**
 * Card para projetos ENTREGUE (Concluído)
 */
const CardEntregue: React.FC<{ projeto: EspacoDeProjetos }> = ({ projeto }) => (
  <div className="space-y-2 text-sm">
    <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm mb-2 break-words">
      <div className="bg-orange-400 rounded-md p-0.5 flex items-center justify-center">
        <LightbulbIcon size={16} className="text-white" />
      </div>
      <span>{projeto.Título}</span>
    </div>
    {/* Informações Gerais */}
    {projeto["Departamento Solicitante"] && (
      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md dark:bg-blue-900 dark:text-blue-300">
        {projeto["Departamento Solicitante"]}
      </span>
    )}
    {projeto.Categoria && (
      <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <CardsIcon size={16} className="text-purple-500" />
        Categoria: {projeto.Categoria}
      </div>
    )}
    <hr className="my-1 border-gray-300 dark:border-gray-600" />

    {/* Datas */}
    <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
      <CalendarIcon size={16} className="text-sky-500" />
      Criado em: {formatDate(projeto["Data de criação"])}
    </div>
    <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
      <CalendarIcon size={16} className="text-sky-500" />
      Entregue em: {formatDate(projeto["Data de término"])}
    </div>
    <ExecutionMetrics projeto={projeto} />
  </div>
);

/**
 * Card para projetos CANCELADOS
 */
const CardCancelado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => (
  <div className="space-y-2 text-sm">
    <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm mb-2 break-words">
      <div className="bg-orange-400 rounded-md p-0.5 flex items-center justify-center">
        <LightbulbIcon size={16} className="text-white" />
      </div>
      <span>{projeto.Título}</span>
    </div>
    {/* Informações Gerais */}
    {projeto["Departamento Solicitante"] && (
      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md dark:bg-blue-900 dark:text-blue-300">
        {projeto["Departamento Solicitante"]}
      </span>
    )}
    {projeto.Categoria && (
      <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <CardsIcon size={16} className="text-purple-500" />
        Categoria: {projeto.Categoria}
      </div>
    )}

    <hr className="my-1 border-gray-300 dark:border-gray-600" />

    {/* Datas */}
    <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
      <CalendarIcon size={16} className="text-sky-500" />
      Criado em: {formatDate(projeto["Data de criação"])}
    </div>
    <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
      <CalendarIcon size={16} className="text-sky-500" />
      Cancelado em: {formatDate(projeto["Data de atualização"])}
    </div>
  </div>
);

// ============================================================================
// COMPONENTE PRINCIPAL QUE SELECIONA O CARD ADEQUADO
// ============================================================================

/**
 * Componente que renderiza o card adequado baseado no status do projeto
 */
export const KanbanCardContent: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  const statusNormalizado = normalizarStatus(projeto.Status);

  switch (statusNormalizado) {
    case "Backlog":
      return <CardIdeacao projeto={projeto} />;
    case "Bloqueado":
      return <CardBloqueado projeto={projeto} />;
    case "Backlog Priorizado":
      return <CardBacklogPriorizado projeto={projeto} />;
    case "Em andamento":
      return <CardEmExecucao projeto={projeto} />;
    case "ENCERRAMENTO":
      return <CardEncerramento projeto={projeto} />;
    case "Concluído":
      return <CardEntregue projeto={projeto} />;
    case "Cancelado":
      return <CardCancelado projeto={projeto} />;
    default:
      // Fallback para status não reconhecidos
      return (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm mb-2 break-words">
            <div className="bg-orange-400 rounded-md p-0.5 flex items-center justify-center">
              <LightbulbIcon size={16} className="text-white" />
            </div>
            <span>{projeto.Título}</span>
          </div>
          {/* Informações Gerais */}
          {projeto["Departamento Solicitante"] && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md dark:bg-blue-900 dark:text-blue-300">
              {projeto["Departamento Solicitante"]}
            </span>
          )}
          {projeto.Categoria && (
            <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <CardsIcon size={16} className="text-purple-500" />
              Categoria: {projeto.Categoria}
            </div>
          )}
          {projeto.Responsável && (
            <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <EpicIcon size={16} className="text-indigo-500" />
              Responsável: {projeto.Responsável}
            </div>
          )}

          <hr className="my-1 border-gray-300 dark:border-gray-600" />

          {/* Datas */}
          <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <CalendarIcon size={16} className="text-sky-500" />
            Criado em: {formatDate(projeto["Data de criação"])}
          </div>
        </div>
      );
  }
};

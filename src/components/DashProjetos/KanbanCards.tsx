import React from "react";
import { EspacoDeProjetos, JiraStatus } from "../../types/Typesjira";
import {
  formatDate,
  formatarSegundos,
  getStatusColor,
  normalizarStatus,
} from "./kanbanUtils";

// ============================================================================
// COMPONENTES DE CARDS ESPECÍFICOS POR STATUS
// ============================================================================

/**
 * Card para projetos em IDEAÇÃO (Backlog)
 */
const CardIdeacao: React.FC<{ projeto: EspacoDeProjetos }> = ({ projeto }) => (
  <div className="space-y-1.5 text-xs">
    <div className="font-semibold text-gray-900 dark:text-white text-xs mb-1.5 break-words">
      {projeto.Título}
    </div>
    {/* 📅 Data de criação */}
    <div className="text-gray-600 dark:text-gray-400">
      📅 Criado em: {formatDate(projeto["Data de criação"])}
    </div>

    {/* ⏳ Dias desde criação */}
    {projeto["Dias desde criação"] !== null && (
      <div className="text-gray-600 dark:text-gray-400">
        🕒 Em espera há: {projeto["Dias desde criação"]} dias
      </div>
    )}

    {/* 🧠 Status de ideação */}
    {projeto["Status de ideação"] && (
      <div className="text-gray-600 dark:text-gray-400">
        📌 Status de ideação: {projeto["Status de ideação"]}
      </div>
    )}

    {/* 🏷️ Categoria */}
    {projeto.Categoria && (
      <div className="text-gray-600 dark:text-gray-400">
        🏷️ Categoria: {projeto.Categoria}
      </div>
    )}
    {/* Área */}
    {projeto["Departamento Solicitante"] && (
      <div className="text-gray-600 dark:text-gray-400">
        🏢 Área: {projeto["Departamento Solicitante"]}
      </div>
    )}
  </div>
);

/**
 * Card para projetos BLOQUEADOS
 */
const CardBloqueado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => (
  <div className="space-y-1.5 text-xs">
    <div className="font-semibold text-gray-900 dark:text-white text-xs mb-1.5 break-words">
      {projeto.Título}
    </div>
    {/* Criado em */}
    <div className="text-gray-600 dark:text-gray-400">
      📅 Criado em: {formatDate(projeto["Data de criação"])}
    </div>

    {/* Em espera */}
    {projeto["Dias desde criação"] !== null && (
      <div className="text-gray-600 dark:text-gray-400">
        🕒 Em espera há: {projeto["Dias desde criação"]} dias
      </div>
    )}

    {/* Categoria */}
    {projeto.Categoria && (
      <div className="text-gray-600 dark:text-gray-400">
        🏷️ Categoria: {projeto.Categoria}
      </div>
    )}

    {/* Área */}
    {projeto["Departamento Solicitante"] && (
      <div className="text-gray-600 dark:text-gray-400">
        🏢 Área: {projeto["Departamento Solicitante"]}
      </div>
    )}

    {/* Última atualização */}
    <div className="text-gray-600 dark:text-gray-400">
      🔄 Última atualização: {formatDate(projeto["Data de atualização"])}
    </div>
  </div>
);

/**
 * Card para projetos em BACKLOG PRIORIZADO
 */
const CardBacklogPriorizado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => (
  <div className="space-y-1.5 text-xs">
    <div className="font-semibold text-gray-900 dark:text-white text-xs mb-1.5 break-words">
      {projeto.Título}
    </div>
    {/* Criado em */}
    <div className="text-gray-600 dark:text-gray-400">
      📅 Criado em: {formatDate(projeto["Data de criação"])}
    </div>

    {/* Em espera */}
    {projeto["Dias desde criação"] !== null && (
      <div className="text-gray-600 dark:text-gray-400">
        🕒 Em espera há: {projeto["Dias desde criação"]} dias
      </div>
    )}

    {/* 💰 Investimento esperado */}
    {projeto["Investimento Esperado"] && (
      <div className="text-gray-600 dark:text-gray-400">
        💰 Investimento esperado: {projeto["Investimento Esperado"]}
      </div>
    )}

    {/* 📅 Data planejada de início */}
    {projeto["Target start"] && (
      <div className="text-gray-600 dark:text-gray-400">
        📅 Início previsto: {formatDate(projeto["Target start"])}
      </div>
    )}

    {/* Área */}
    {projeto["Departamento Solicitante"] && (
      <div className="text-gray-600 dark:text-gray-400">
        🏢 Área: {projeto["Departamento Solicitante"]}
      </div>
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
    {/* 📅 Target start → end */}
    {projeto["Target start"] && projeto["Target end"] && (
      <div className="text-gray-600 dark:text-gray-400">
        📅 {formatDate(projeto["Target start"])} →{" "}
        {formatDate(projeto["Target end"])}
      </div>
    )}

    {/* 📈 Dias passados / restantes */}
    {projeto["Dias desde o início"] !== null &&
      projeto["Dias restantes"] !== null && (
        <div className="text-gray-600 dark:text-gray-400">
          🗓️ {projeto["Dias desde o início"]} dias passados •{" "}
          {projeto["Dias restantes"]} dias restantes
        </div>
      )}

    {/* ⏳ % tempo decorrido */}
    {projeto["% do tempo decorrido"] !== null && (
      <div className="text-gray-600 dark:text-gray-400 mt-1.5">
        <div className="flex items-center">
          <span>⏳ {projeto["% do tempo decorrido"]}% do tempo -[] </span>
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
              width: `${Math.min(projeto["% do tempo decorrido"] || 0, 100)}%`,
            }}
          ></div>
        </div>
      </div>
    )}

    {/* 🕐 Estimativa × tempo usado */}
    {projeto["Estimativa original (segundos)"] &&
      projeto["Tempo registrado (segundos)"] !== null && (
        <div className="text-gray-600 dark:text-gray-400 mt-1.5">
          🕐 Estimativa:{" "}
          {formatarSegundos(projeto["Estimativa original (segundos)"])} •
          Registrado: {formatarSegundos(projeto["Tempo registrado (segundos)"])}
        </div>
      )}

    {/* Esforço e Barra de Progresso */}
    {projeto["% da estimativa usada"] !== null && (
      <div className="mt-1.5">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <span>📊 Esforço: {projeto["% da estimativa usada"]}%</span>
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
              width: `${Math.min(projeto["% da estimativa usada"] || 0, 100)}%`,
            }}
          ></div>
        </div>
      </div>
    )}
  </>
);

/**
 * Card para projetos em EXECUÇÃO
 */
const CardEmExecucao: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => (
  <div className="space-y-1.5 text-xs">
    <div className="font-semibold text-gray-900 dark:text-white text-xs mb-1.5 break-words">
      {projeto.Título}
    </div>
    {/* Área */}
    {projeto["Departamento Solicitante"] && (
      <div className="text-gray-600 dark:text-gray-400">
        🏢 Área: {projeto["Departamento Solicitante"]}
      </div>
    )}
    <ExecutionMetrics projeto={projeto} />
  </div>
);

/**
 * Card para projetos em ENCERRAMENTO
 */
const CardEncerramento: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => (
  <div className="space-y-1.5 text-xs">
    <div className="font-semibold text-gray-900 dark:text-white text-xs mb-1.5 break-words">
      {projeto.Título}
    </div>
    {/* Área */}
    {projeto["Departamento Solicitante"] && (
      <div className="text-gray-600 dark:text-gray-400">
        🏢 Área: {projeto["Departamento Solicitante"]}
      </div>
    )}
    {/* Categoria */}
    {projeto.Categoria && (
      <div className="text-gray-600 dark:text-gray-400">
        🏷️ Categoria: {projeto.Categoria}
      </div>
    )}
    {/* Data de Resolução/Atualização */}
    <div className="text-gray-600 dark:text-gray-400">
      ✅ Resolvido em: {formatDate(projeto["Data de atualização"])}
    </div>
    <ExecutionMetrics projeto={projeto} />
  </div>
);

/**
 * Card para projetos ENTREGUE (Concluído)
 */
const CardEntregue: React.FC<{ projeto: EspacoDeProjetos }> = ({ projeto }) => (
  <div className="space-y-1.5 text-xs">
    <div className="font-semibold text-gray-900 dark:text-white text-xs mb-1.5 break-words">
      {projeto.Título}
    </div>
    {/* Área */}
    {projeto["Departamento Solicitante"] && (
      <div className="text-gray-600 dark:text-gray-400">
        🏢 Área: {projeto["Departamento Solicitante"]}
      </div>
    )}
    {/* Categoria */}
    {projeto.Categoria && (
      <div className="text-gray-600 dark:text-gray-400">
        🏷️ Categoria: {projeto.Categoria}
      </div>
    )}
    {/* Data de Resolução/Atualização */}
    <div className="text-gray-600 dark:text-gray-400">
      ✅ Entregue em: {formatDate(projeto["Data de término"])}
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
  <div className="space-y-1.5 text-xs">
    <div className="font-semibold text-gray-900 dark:text-white text-xs mb-1.5 break-words">
      {projeto.Título}
    </div>
    {/* Área */}
    {projeto["Departamento Solicitante"] && (
      <div className="text-gray-600 dark:text-gray-400">
        🏢 Área: {projeto["Departamento Solicitante"]}
      </div>
    )}
    {/* Categoria */}
    {projeto.Categoria && (
      <div className="text-gray-600 dark:text-gray-400">
        🏷️ Categoria: {projeto.Categoria}
      </div>
    )}
    {/* Data de Resolução/Atualização */}
    <div className="text-gray-600 dark:text-gray-400">
      ❌ Cancelado em: {formatDate(projeto["Data de atualização"])}
    </div>
    <ExecutionMetrics projeto={projeto} />
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
        <div className="space-y-1.5 text-xs">
          <div className="font-semibold text-gray-900 dark:text-white text-xs mb-1.5 break-words">
            {projeto.Título}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            📅 Criado em: {formatDate(projeto["Data de criação"])}
          </div>
          {projeto.Responsável && (
            <div className="text-gray-600 dark:text-gray-400">
              👤 Responsável: {projeto.Responsável}
            </div>
          )}
          {projeto.Categoria && (
            <div className="text-gray-600 dark:text-gray-400">
              🏷️ Categoria: {projeto.Categoria}
            </div>
          )}
          {/* Área */}
          {projeto["Departamento Solicitante"] && (
            <div className="text-gray-600 dark:text-gray-400">
              🏢 Área: {projeto["Departamento Solicitante"]}
            </div>
          )}
        </div>
      );
  }
};

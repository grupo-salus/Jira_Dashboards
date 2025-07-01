import React from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import {
  formatDate,
  formatarSegundos,
  getStatusColor,
  normalizarStatus,
} from "./kanbanUtils";
import { getFontSizes } from "../../constants/styleConfig";

const fontSizes = getFontSizes();

const JIRA_URL_BASE =
  "https://tigruposalus.atlassian.net/jira/software/c/projects/EP/boards/323?selectedIssue=";

function withJiraLink(projeto: EspacoDeProjetos, children: React.ReactNode) {
  return (
    <a
      href={`${JIRA_URL_BASE}${projeto.Chave}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", display: "block", height: "100%" }}
    >
      {children}
    </a>
  );
}

// ============================================================================
// COMPONENTES DE CARDS ESPECÍFICOS POR STATUS
// ============================================================================

/**
 * Card para projetos em IDEAÇÃO (Backlog)
 */
const CardIdeacao: React.FC<{ projeto: EspacoDeProjetos }> = ({ projeto }) => {
  return withJiraLink(
    projeto,
    <div
      className={`space-y-2 ${fontSizes.corpoCardKanban}`}
      title={projeto.Descrição || "Sem descrição disponível"}
    >
      <div
        className={`font-semibold text-gray-900 dark:text-white mb-2 break-words ${fontSizes.tituloCardKanban}`}
      >
        <span>{projeto.Título}</span>
      </div>

      {/* Área */}
      {projeto["Departamento Solicitante"] && (
        <div className="flex items-center gap-2">
          <span
            className={`inline-block bg-white text-gray-800 font-medium px-2 py-1 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${fontSizes.tagCardKanban}`}
          >
            {projeto["Departamento Solicitante"]}
          </span>
        </div>
      )}

      {/* Squad */}
      {projeto.Squad && (
        <div className="text-gray-600 dark:text-gray-100">
          Squad: {projeto.Squad}
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Data de ideação */}
      {projeto["Data: Início Backlog"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Data de ideação: {formatDate(projeto["Data: Início Backlog"])}
        </div>
      )}

      {/* Dias em espera */}
      {projeto["Dias na fase atual"] !== null &&
        projeto["Dias na fase atual"] !== undefined && (
          <div className="text-gray-600 dark:text-gray-200">
            Em espera há: {projeto["Dias na fase atual"]} dias
          </div>
        )}

      {/* Data fim de ideação */}
      {projeto["Data: Fim Backlog"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Data fim de ideação: {formatDate(projeto["Data: Fim Backlog"])}
        </div>
      )}

      {/* Status de ideação */}
      {projeto["Status de ideação"] && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="text-gray-600 dark:text-gray-200">
            Status de ideação: {projeto["Status de ideação"]}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Card para projetos BLOQUEADOS
 */
const CardBloqueado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  return withJiraLink(
    projeto,
    <div className={`space-y-2 ${fontSizes.corpoCardKanban}`}>
      <div
        className={`font-semibold text-gray-900 dark:text-white mb-2 break-words ${fontSizes.tituloCardKanban}`}
      >
        <span>{projeto.Título}</span>
      </div>
      {/* Informações Gerais */}
      {projeto["Departamento Solicitante"] && (
        <div className="flex items-center gap-2">
          <span
            className={`inline-block bg-white text-gray-800 font-medium px-2 py-1 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${fontSizes.tagCardKanban}`}
          >
            {projeto["Departamento Solicitante"]}
          </span>
        </div>
      )}
      {projeto.Squad && (
        <div className="text-gray-600 dark:text-gray-200">
          Squad: {projeto.Squad}
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Datas */}
      <div className="text-gray-600 dark:text-gray-200">
        Criado em: {formatDate(projeto["Data de criação"])}
      </div>
      <div className="text-gray-600 dark:text-gray-200">
        Última atualização: {formatDate(projeto["Data de atualização"])}
      </div>

      {/* Datas planejadas */}
      {projeto["Target start"] && projeto["Target end"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Período planejado: <br />
          {formatDate(projeto["Target start"])} →{" "}
          {formatDate(projeto["Target end"])} <br />
        </div>
      )}

      {/* Status de prazo */}
      {projeto["Status de prazo"] && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status de prazo:</span>
              <span
                className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                  projeto["Status de prazo"]
                )} ${fontSizes.statusCardKanban}`}
              >
                {projeto["Status de prazo"]}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Esforço */}
      {projeto["Estimativa original (segundos)"] &&
        projeto["Tempo registrado (segundos)"] !== null && (
          <>
            <hr className="my-1 border-gray-300 dark:border-gray-600" />
            <div className="pt-2">
              <div className="font-medium">Estimativa vs. Registrado:</div>
              <div className="text-gray-600 dark:text-gray-200">
                Estimativa:{" "}
                {formatarSegundos(projeto["Estimativa original (segundos)"])} •
                Registrado:{" "}
                {formatarSegundos(projeto["Tempo registrado (segundos)"])}
              </div>
            </div>
          </>
        )}
    </div>
  );
};

/**
 * Card para projetos em BACKLOG PRIORIZADO
 */
const CardBacklogPriorizado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  return withJiraLink(
    projeto,
    <div
      className={`space-y-2 ${fontSizes.corpoCardKanban}`}
      title={projeto.Descrição || "Sem descrição disponível"}
    >
      <div
        className={`font-semibold text-gray-900 dark:text-white mb-2 break-words ${fontSizes.tituloCardKanban}`}
      >
        <span>{projeto.Título}</span>
      </div>

      {/* Posição no backlog e Área */}
      <div className="flex items-center gap-2">
        {projeto.PosicaoBacklog && (
          <span
            className="font-bold text-sm flex items-center justify-center rounded-full aspect-square overflow-hidden"
            style={{
              background: "#10b981",
              color: "#fff",
              width: 28,
              height: 28,
              minWidth: 28,
              minHeight: 28,
              display: "inline-flex",
              textAlign: "center",
            }}
          >
            #{projeto.PosicaoBacklog}
          </span>
        )}
        {projeto["Departamento Solicitante"] && (
          <span
            className={`inline-block bg-white text-gray-800 font-medium px-2 py-1 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${fontSizes.tagCardKanban}`}
          >
            {projeto["Departamento Solicitante"]}
          </span>
        )}
      </div>

      {/* Squad */}
      {projeto.Squad && (
        <div className="text-gray-600 dark:text-gray-200">
          Squad: {projeto.Squad}
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Data que entrou em backlog priorizado */}
      {projeto["Data: Início Backlog priorizado"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Entrou em backlog priorizado:{" "}
          {formatDate(projeto["Data: Início Backlog priorizado"])}
        </div>
      )}

      {/* Dias em espera */}
      {projeto["Dias na fase atual"] !== null &&
        projeto["Dias na fase atual"] !== undefined && (
          <div className="text-gray-600 dark:text-gray-200">
            Em espera há: {projeto["Dias na fase atual"]} dias
          </div>
        )}

      {/* Datas adicionais (se disponíveis) */}
      {(projeto["Data: Fim Backlog priorizado"] ||
        projeto["Target start"] ||
        projeto["Target end"]) && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />

          {/* Data fim backlog priorizado */}
          {projeto["Data: Fim Backlog priorizado"] && (
            <div className="text-gray-600 dark:text-gray-200">
              Data fim backlog priorizado:{" "}
              {formatDate(projeto["Data: Fim Backlog priorizado"])}
            </div>
          )}

          {/* Data prevista de início */}
          {projeto["Target start"] && (
            <div className="text-gray-600 dark:text-gray-200">
              Data prevista de início: {formatDate(projeto["Target start"])}
            </div>
          )}

          {/* Data prevista para término */}
          {projeto["Target end"] && (
            <div className="text-gray-600 dark:text-gray-200">
              Data prevista para término: {formatDate(projeto["Target end"])}
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Card para projetos em DESENVOLVIMENTO
 */
const CardEmDesenvolvimento: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  return withJiraLink(
    projeto,
    <div className={`space-y-3 ${fontSizes.corpoCardKanban}`}>
      {/* Cabeçalho */}
      <div
        className={`font-semibold text-gray-900 dark:text-white mb-2 break-words ${fontSizes.tituloCardKanban}`}
      >
        <span>{projeto.Título}</span>
      </div>

      {/* Informações Gerais */}
      {projeto["Departamento Solicitante"] && (
        <div className="flex items-center gap-2">
          <span
            className={`inline-block bg-white text-gray-800 font-medium px-2 py-1 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${fontSizes.tagCardKanban}`}
          >
            {projeto["Departamento Solicitante"]}
          </span>
        </div>
      )}
      {projeto.Squad && (
        <div className="text-gray-600 dark:text-gray-200">
          Squad: {projeto.Squad}
        </div>
      )}
      <hr className="my-1 border-gray-300 dark:border-gray-600" />
      {/* Datas */}
      <div className="text-gray-600 dark:text-gray-200">
        Criado em: {formatDate(projeto["Data de criação"])}
      </div>
      {projeto["Target start"] && projeto["Target end"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Período planejado: <br />
          {formatDate(projeto["Target start"])} →{" "}
          {formatDate(projeto["Target end"])} <br />
        </div>
      )}
      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Status de prazo */}
      {projeto["Status de prazo"] && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status de prazo:</span>
              <span
                className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                  projeto["Status de prazo"]
                )} ${fontSizes.statusCardKanban}`}
              >
                {projeto["Status de prazo"]}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Esforço */}
      {projeto["Estimativa original (segundos)"] &&
        projeto["Tempo registrado (segundos)"] !== null && (
          <>
            <hr className="my-1 border-gray-300 dark:border-gray-600" />
            <div className="pt-2">
              <div className="font-medium">Estimativa vs. Registrado:</div>
              <div className="text-gray-600 dark:text-gray-200">
                Estimativa:{" "}
                {formatarSegundos(projeto["Estimativa original (segundos)"])} •
                Registrado:{" "}
                {formatarSegundos(projeto["Tempo registrado (segundos)"])}
              </div>
            </div>
          </>
        )}
    </div>
  );
};

/**
 * Card para projetos em HOMOLOGAÇÃO
 */
const CardEmHomologacao: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  return withJiraLink(
    projeto,
    <div className={`space-y-3 ${fontSizes.corpoCardKanban}`}>
      {/* Cabeçalho */}
      <div
        className={`font-semibold text-gray-900 dark:text-white mb-2 break-words ${fontSizes.tituloCardKanban}`}
      >
        <span>{projeto.Título}</span>
      </div>

      {/* Informações Gerais */}
      {projeto["Departamento Solicitante"] && (
        <div className="flex items-center gap-2">
          <span
            className={`inline-block bg-white text-gray-800 font-medium px-2 py-1 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${fontSizes.tagCardKanban}`}
          >
            {projeto["Departamento Solicitante"]}
          </span>
        </div>
      )}
      {projeto.Squad && (
        <div className="text-gray-600 dark:text-gray-200">
          Squad: {projeto.Squad}
        </div>
      )}
      <hr className="my-1 border-gray-300 dark:border-gray-600" />
      {/* Datas */}
      <div className="text-gray-600 dark:text-gray-200">
        Criado em: {formatDate(projeto["Data de criação"])}
      </div>
      {projeto["Target start"] && projeto["Target end"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Período planejado: <br />
          {formatDate(projeto["Target start"])} →{" "}
          {formatDate(projeto["Target end"])} <br />
        </div>
      )}
      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Status de prazo */}
      {projeto["Status de prazo"] && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status de prazo:</span>
              <span
                className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                  projeto["Status de prazo"]
                )} ${fontSizes.statusCardKanban}`}
              >
                {projeto["Status de prazo"]}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Esforço */}
      {projeto["Estimativa original (segundos)"] &&
        projeto["Tempo registrado (segundos)"] !== null && (
          <>
            <hr className="my-1 border-gray-300 dark:border-gray-600" />
            <div className="pt-2">
              <div className="font-medium">Estimativa vs. Registrado:</div>
              <div className="text-gray-600 dark:text-gray-200">
                Estimativa:{" "}
                {formatarSegundos(projeto["Estimativa original (segundos)"])} •
                Registrado:{" "}
                {formatarSegundos(projeto["Tempo registrado (segundos)"])}
              </div>
            </div>
          </>
        )}
    </div>
  );
};

/**
 * Card para projetos em Operação Assistida
 */
const CardOperacaoAssistida: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  return withJiraLink(
    projeto,
    <div className={`space-y-3 ${fontSizes.corpoCardKanban}`}>
      {/* Cabeçalho */}
      <div
        className={`font-semibold text-gray-900 dark:text-white mb-2 break-words ${fontSizes.tituloCardKanban}`}
      >
        <span>{projeto.Título}</span>
      </div>
      {/* Informações Gerais */}
      {projeto["Departamento Solicitante"] && (
        <div className="flex items-center gap-2">
          <span
            className={`inline-block bg-white text-gray-800 font-medium px-2 py-1 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${fontSizes.tagCardKanban}`}
          >
            {projeto["Departamento Solicitante"]}
          </span>
        </div>
      )}
      {projeto.Squad && (
        <div className="text-gray-600 dark:text-gray-200">
          Squad: {projeto.Squad}
        </div>
      )}
      {(projeto["Data de criação"] ||
        projeto["Data de atualização"] ||
        (projeto["Target start"] && projeto["Target end"])) && (
        <hr className="my-1 border-gray-300 dark:border-gray-600" />
      )}
      {/* Datas */}
      {projeto["Data de criação"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Criado em: {formatDate(projeto["Data de criação"])}
        </div>
      )}
      {projeto["Data de atualização"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Resolvido em: {formatDate(projeto["Data de atualização"])}
        </div>
      )}
      {projeto["Target start"] && projeto["Target end"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Período planejado: <br />
          {formatDate(projeto["Target start"])} →{" "}
          {formatDate(projeto["Target end"])} <br />
        </div>
      )}

      {/* Status de prazo */}
      {projeto["Status de prazo"] && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status de prazo:</span>
              <span
                className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                  projeto["Status de prazo"]
                )} ${fontSizes.statusCardKanban}`}
              >
                {projeto["Status de prazo"]}
              </span>
            </div>
          </div>
        </>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />
      {/* Esforço */}
      {projeto["Estimativa original (segundos)"] &&
        projeto["Tempo registrado (segundos)"] !== null && (
          <div className="pt-2">
            <div className="font-medium">Estimativa vs. Registrado:</div>
            <div className="text-gray-600 dark:text-gray-200">
              Estimativa:{" "}
              {formatarSegundos(projeto["Estimativa original (segundos)"])} •
              Registrado:{" "}
              {formatarSegundos(projeto["Tempo registrado (segundos)"])}
            </div>
          </div>
        )}
    </div>
  );
};

/**
 * Card para projetos ENTREGUE (Concluído)
 */
const CardEntregue: React.FC<{ projeto: EspacoDeProjetos }> = ({ projeto }) => {
  return withJiraLink(
    projeto,
    <div className={`space-y-3 ${fontSizes.corpoCardKanban}`}>
      {/* Cabeçalho */}
      <div
        className={`font-semibold text-gray-900 dark:text-white mb-2 break-words ${fontSizes.tituloCardKanban}`}
      >
        <span>{projeto.Título}</span>
      </div>
      {/* Informações Gerais */}
      {projeto["Departamento Solicitante"] && (
        <div className="flex items-center gap-2">
          <span
            className={`inline-block bg-white text-gray-800 font-medium px-2 py-1 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${fontSizes.tagCardKanban}`}
          >
            {projeto["Departamento Solicitante"]}
          </span>
        </div>
      )}
      {projeto.Squad && (
        <div className="text-gray-600 dark:text-gray-200">
          Squad: {projeto.Squad}
        </div>
      )}
      <hr className="my-1 border-gray-300 dark:border-gray-600" />
      {/* Datas */}
      <div className="text-gray-600 dark:text-gray-200">
        Criado em: {formatDate(projeto["Data de criação"])}
      </div>
      <div className="text-gray-600 dark:text-gray-200">
        Entregue em: {formatDate(projeto["Data de término"])}
      </div>
      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Status de prazo */}
      {projeto["Status de prazo"] && (
        <div className="pt-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Status de prazo:</span>
            <span
              className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                projeto["Status de prazo"]
              )} ${fontSizes.statusCardKanban}`}
            >
              {projeto["Status de prazo"]}
            </span>
          </div>
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />
      {/* Esforço */}
      <div className="pt-2">
        <div className="font-medium">Estimativa vs. Registrado:</div>
        {projeto["Estimativa original (segundos)"] &&
          projeto["Tempo registrado (segundos)"] !== null && (
            <div className="text-gray-600 dark:text-gray-200">
              Estimativa:{" "}
              {formatarSegundos(projeto["Estimativa original (segundos)"])} •
              Registrado:{" "}
              {formatarSegundos(projeto["Tempo registrado (segundos)"])}
            </div>
          )}
      </div>
    </div>
  );
};

/**
 * Card para projetos CANCELADOS
 */
const CardCancelado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  return withJiraLink(
    projeto,
    <div className={`space-y-2 ${fontSizes.corpoCardKanban}`}>
      <div
        className={`font-semibold text-gray-900 dark:text-white mb-2 break-words ${fontSizes.tituloCardKanban}`}
      >
        <span>{projeto.Título}</span>
      </div>
      {/* Informações Gerais */}
      {projeto["Departamento Solicitante"] && (
        <div className="flex items-center gap-2">
          <span
            className={`inline-block bg-white text-gray-800 font-medium px-2 py-1 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${fontSizes.tagCardKanban}`}
          >
            {projeto["Departamento Solicitante"]}
          </span>
        </div>
      )}
      {projeto.Squad && (
        <div className="text-gray-600 dark:text-gray-200">
          Squad: {projeto.Squad}
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Datas */}
      <div className="text-gray-600 dark:text-gray-200">
        Criado em: {formatDate(projeto["Data de criação"])}
      </div>
      <div className="text-gray-600 dark:text-gray-200">
        Cancelado em: {formatDate(projeto["Data de atualização"])}
      </div>
    </div>
  );
};

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
    case "Em Andamento":
      return <CardEmDesenvolvimento projeto={projeto} />;
    case "Em Homologação":
      return <CardEmHomologacao projeto={projeto} />;
    case "Operação Assistida":
      return <CardOperacaoAssistida projeto={projeto} />;
    case "Concluído":
      return <CardEntregue projeto={projeto} />;
    case "Cancelado":
      return <CardCancelado projeto={projeto} />;
    default:
      // Fallback para status não reconhecidos
      return (
        <div className={`space-y-2 ${fontSizes.corpoCardKanban}`}>
          <div
            className={`font-semibold text-gray-900 dark:text-white mb-2 break-words ${fontSizes.tituloCardKanban}`}
          >
            <span>{projeto.Título}</span>
          </div>
          {/* Informações Gerais */}
          {projeto["Departamento Solicitante"] && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-block bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-md dark:bg-blue-900 dark:text-blue-300 ${fontSizes.tagCardKanban}`}
              >
                {projeto["Departamento Solicitante"]}
              </span>
            </div>
          )}
          {projeto.Squad && (
            <div className="text-gray-600 dark:text-gray-200">
              Squad: {projeto.Squad}
            </div>
          )}
          {projeto.Responsável && (
            <div className="text-gray-600 dark:text-gray-200">
              Responsável: {projeto.Responsável}
            </div>
          )}

          <hr className="my-1 border-gray-300 dark:border-gray-600" />

          {/* Datas */}
          <div className="text-gray-600 dark:text-gray-200">
            Criado em: {formatDate(projeto["Data de criação"])}
          </div>
        </div>
      );
  }
};

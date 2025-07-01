import React, { useState } from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import {
  formatDate,
  formatarSegundos,
  getStatusColor,
  normalizarStatus,
} from "./kanbanUtils";
import { getFontSizes } from "../../constants/styleConfig";
import { useTheme } from "../../context/ThemeContext";
import { getPriorityConfig } from "../../utils/themeColors";

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

/**
 * Calcula o progresso baseado na data que entrou em desenvolvimento até a data de término
 */
const calcularProgresso = (
  dataInicioDesenvolvimento: string,
  dataTermino: string
): number => {
  const inicioDev = new Date(dataInicioDesenvolvimento);
  const termino = new Date(dataTermino);
  const hoje = new Date();

  // Se ainda não entrou em desenvolvimento
  if (hoje < inicioDev) {
    return 0;
  }

  // Se já passou da data de término
  if (hoje > termino) {
    return 100;
  }

  // Calcula o tempo total planejado (desde início do desenvolvimento até término)
  const totalDias =
    (termino.getTime() - inicioDev.getTime()) / (1000 * 60 * 60 * 24);

  // Calcula o tempo decorrido desde que entrou em desenvolvimento até hoje
  const diasDecorridos =
    (hoje.getTime() - inicioDev.getTime()) / (1000 * 60 * 60 * 24);

  const progresso = Math.min(
    100,
    Math.max(0, (diasDecorridos / totalDias) * 100)
  );

  return progresso;
};

const fontSizes = getFontSizes();

const JIRA_URL_BASE =
  "https://tigruposalus.atlassian.net/jira/software/c/projects/EP/boards/323?selectedIssue=";

// ============================================================================
// COMPONENTE DE TOOLTIP PERSONALIZADO
// ============================================================================

interface CustomTooltipProps {
  content: string;
  children: React.ReactNode;
  priority?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  content,
  children,
  priority,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const { theme } = useTheme();
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  // Obtém a cor da prioridade
  const priorityConfig = priority ? getPriorityConfig(priority) : null;
  const priorityColor =
    priorityConfig?.hex || (theme === "dark" ? "#10b981" : "#3b82f6");

  if (!content || content === "Sem descrição disponível") {
    return <>{children}</>;
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top,
      left: rect.right + 8,
    });
    setIsVisible(true);
  };

  return (
    <div
      className="relative inline-block w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed px-4 py-3 text-sm rounded-lg shadow-lg max-w-md break-words"
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(31, 41, 55, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
            color: theme === "dark" ? "#d1d5db" : "#374151",
            border: `2px solid ${priorityColor}`,
            boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.3)`,
            zIndex: 9999,
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            minWidth: "300px",
            maxWidth: "400px",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

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
    <CustomTooltip
      content={projeto.Descrição || "Sem descrição disponível"}
      priority={projeto.Prioridade}
    >
      <div className={`space-y-2 ${fontSizes.corpoCardKanban}`}>
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
    </CustomTooltip>
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
    <CustomTooltip
      content={projeto.Descrição || "Sem descrição disponível"}
      priority={projeto.Prioridade}
    >
      <div className={`space-y-2 ${fontSizes.corpoCardKanban}`}>
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
    </CustomTooltip>
  );
};

/**
 * Card para projetos em DESENVOLVIMENTO
 */
const CardEmDesenvolvimento: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  // Calcula o progresso se tiver as datas necessárias
  const progresso =
    projeto["Data: Início Em andamento"] && projeto["Target end"]
      ? calcularProgresso(
          projeto["Data: Início Em andamento"],
          projeto["Target end"]
        )
      : null;

  return withJiraLink(
    projeto,
    <div className={`space-y-3 ${fontSizes.corpoCardKanban}`}>
      {/* Cabeçalho */}
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
        <div className="text-gray-600 dark:text-gray-200">
          Squad: {projeto.Squad}
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Data que entrou em desenvolvimento */}
      {projeto["Data: Início Em andamento"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Entrou em desenvolvimento:{" "}
          {formatDate(projeto["Data: Início Em andamento"])}
        </div>
      )}

      {/* Data que saiu de desenvolvimento (se houver) */}
      {projeto["Data: Fim Em andamento"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Saiu de desenvolvimento:{" "}
          {formatDate(projeto["Data: Fim Em andamento"])}
        </div>
      )}

      {/* Datas de início e término planejado */}
      {projeto["Target start"] && projeto["Target end"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Período planejado: <br />
          {formatDate(projeto["Target start"])} →{" "}
          {formatDate(projeto["Target end"])}
        </div>
      )}

      {/* Dias em desenvolvimento */}
      {projeto["Tempo na fase Em desenvolvimento (dias)"] !== null &&
        projeto["Tempo na fase Em desenvolvimento (dias)"] !== undefined && (
          <div className="text-gray-600 dark:text-gray-200">
            Dias em desenvolvimento:{" "}
            {projeto["Tempo na fase Em desenvolvimento (dias)"]} dias
          </div>
        )}

      {/* Barra de progresso */}
      {progresso !== null && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progresso do desenvolvimento:</span>
              <span className="text-gray-600 dark:text-gray-400">
                {Math.round(progresso)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  getStatusColor(projeto["Status de prazo"] || "No prazo")
                    .split(" ")
                    .find((c) => c.startsWith("bg-")) || "bg-blue-600"
                }`}
                style={{ width: `${progresso}%` }}
              />
            </div>
            {/* Dias decorridos */}
            {projeto["Data: Início Em andamento"] &&
              projeto["Target end"] &&
              (() => {
                const inicioDev = new Date(
                  projeto["Data: Início Em andamento"]
                );
                const terminoPrevisto = new Date(projeto["Target end"]);
                const fimReal = projeto["Data: Fim Em andamento"]
                  ? new Date(projeto["Data: Fim Em andamento"])
                  : null;
                const hoje = new Date();
                const totalDias = Math.round(
                  (terminoPrevisto.getTime() - inicioDev.getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                // Dias decorridos: do início até hoje ou até a data de término real, se houver
                let diasDecorridos = Math.round(
                  ((fimReal ? fimReal : hoje).getTime() - inicioDev.getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                if (diasDecorridos < 0) diasDecorridos = 0;
                return (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Dias decorridos: <b>{diasDecorridos}</b> / {totalDias} dias
                  </div>
                );
              })()}
          </div>
        </>
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

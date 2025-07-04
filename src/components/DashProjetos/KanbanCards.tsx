import React, { useState } from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import {
  formatDate,
  formatarSegundos,
  getStatusColor,
  getPrazoBackgroundColor,
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
 * Card para projetos em IDEAÇÃO
 */
const CardIdeacao: React.FC<{ projeto: EspacoDeProjetos }> = ({ projeto }) => {
  return withJiraLink(
    projeto,
    <CustomTooltip
      content={projeto.Descrição || "Sem descrição disponível"}
      priority={projeto.Prioridade}
    >
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

        {/* Squads */}
        {projeto.Squads && projeto.Squads.length > 0 && (
          <div className="text-gray-600 dark:text-gray-100">
            Squads: {projeto.Squads.join(", ")}
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
  const { theme } = useTheme();

  // Cálculo do tempo bloqueado
  const inicioBloqueado = projeto["Data: Início Bloqueado"]
    ? new Date(projeto["Data: Início Bloqueado"])
    : null;
  const fimBloqueado = projeto["Data: Fim Bloqueado"]
    ? new Date(projeto["Data: Fim Bloqueado"])
    : null;
  const hoje = new Date();
  let diasBloqueado = null;
  if (inicioBloqueado) {
    const dataFinal = fimBloqueado ? fimBloqueado : hoje;
    diasBloqueado = Math.max(
      0,
      Math.floor(
        (dataFinal.getTime() - inicioBloqueado.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
  }

  return withJiraLink(
    projeto,
    <CustomTooltip
      content={projeto.Descrição || "Sem descrição disponível"}
      priority={projeto.Prioridade}
    >
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
        {/* Squads */}
        {projeto.Squads && projeto.Squads.length > 0 && (
          <div className="text-gray-600 dark:text-gray-200">
            Squads: {projeto.Squads.join(", ")}
          </div>
        )}
        {/* Datas planejadas */}
        {projeto["Target start"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Target start: {formatDate(projeto["Target start"])}
          </div>
        )}
        {projeto["Target end"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Target end: {formatDate(projeto["Target end"])}
          </div>
        )}
        <hr className="my-1 border-gray-300 dark:border-gray-600" />
        {/* Data que entrou em bloqueado */}
        {projeto["Data: Início Bloqueado"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Entrou em bloqueado: {formatDate(projeto["Data: Início Bloqueado"])}
          </div>
        )}
        {/* Dias bloqueado */}
        {diasBloqueado !== null && (
          <div className="text-gray-600 dark:text-gray-200">
            Tempo bloqueado: {diasBloqueado} dias
          </div>
        )}
        {/* Data de fim do bloqueio */}
        {projeto["Data: Fim Bloqueado"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Saiu do bloqueio: {formatDate(projeto["Data: Fim Bloqueado"])}
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
                  style={{
                    backgroundColor: getPrazoBackgroundColor(
                      projeto["Status de prazo"],
                      theme
                    ),
                  }}
                >
                  {projeto["Status de prazo"]}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </CustomTooltip>
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

        {/* Squads */}
        {projeto.Squads && projeto.Squads.length > 0 && (
          <div className="text-gray-600 dark:text-gray-200">
            Squads: {projeto.Squads.join(", ")}
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
  const { theme } = useTheme();

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

      {/* Squads */}
      {projeto.Squads && projeto.Squads.length > 0 && (
        <div className="text-gray-600 dark:text-gray-200">
          Squads: {projeto.Squads.join(", ")}
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Data prevista de início */}
      {projeto["Target start"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Target start: {formatDate(projeto["Target start"])}
        </div>
      )}

      {/* Data prevista para término */}
      {projeto["Target end"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Target end: {formatDate(projeto["Target end"])}
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

      {/* Dias em desenvolvimento */}
      {projeto["Tempo na fase Em andamento (dias)"] !== null &&
        projeto["Tempo na fase Em andamento (dias)"] !== undefined &&
        projeto["Tempo na fase Em andamento (dias)"] !== 0 && (
          <div className="text-gray-600 dark:text-gray-200">
            Tempo em desenvolvimento:{" "}
            {projeto["Tempo na fase Em andamento (dias)"]} dias
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
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progresso}%`,
                  backgroundColor: getPrazoBackgroundColor(
                    projeto["Status de prazo"] || "No prazo",
                    theme
                  ),
                }}
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
                let diasDecorridos = Math.floor(
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
                style={{
                  backgroundColor: getPrazoBackgroundColor(
                    projeto["Status de prazo"],
                    theme
                  ),
                }}
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
  const { theme } = useTheme();

  // Datas de homologação
  const inicioHom = projeto["Data: Início Em homologação"]
    ? new Date(projeto["Data: Início Em homologação"])
    : null;
  const fimHom = projeto["Data: Fim Em homologação"]
    ? new Date(projeto["Data: Fim Em homologação"])
    : null;
  const hoje = new Date();

  // Progresso: dias decorridos e total
  let diasDecorridos = 0;
  let totalDias = 0;
  let atraso = false;
  if (inicioHom && fimHom) {
    totalDias = Math.floor(
      (fimHom.getTime() - inicioHom.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Verifica se o projeto ainda está em homologação
    const aindaEmHomologacao = projeto.Status === "Em Homologação";

    if (aindaEmHomologacao) {
      // Se ainda está em homologação, conta até hoje
      diasDecorridos = Math.floor(
        (hoje.getTime() - inicioHom.getTime()) / (1000 * 60 * 60 * 24)
      );
      // Se passou do prazo, marca como atrasado
      if (hoje > fimHom) {
        atraso = true;
      }
    } else {
      // Se já saiu da homologação, conta apenas até a data de fim
      diasDecorridos = Math.floor(
        (fimHom.getTime() - inicioHom.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    if (diasDecorridos < 0) diasDecorridos = 0;
  }
  const progresso =
    inicioHom && fimHom && totalDias > 0
      ? Math.min((diasDecorridos / totalDias) * 100, 100)
      : 0;

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

      {/* Squads */}
      {projeto.Squads && projeto.Squads.length > 0 && (
        <div className="text-gray-600 dark:text-gray-200">
          Squads: {projeto.Squads.join(", ")}
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Data prevista de início */}
      {projeto["Target start"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Target start: {formatDate(projeto["Target start"])}
        </div>
      )}

      {/* Data prevista para término */}
      {projeto["Target end"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Target end: {formatDate(projeto["Target end"])}
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

      {/* Data que entrou em homologação */}
      {projeto["Data: Início Em homologação"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Entrou em homologação:{" "}
          {formatDate(projeto["Data: Início Em homologação"])}
        </div>
      )}

      {/* Tempo em homologação */}
      {inicioHom && fimHom && (
        <div className="text-gray-600 dark:text-gray-200">
          Tempo em homologação: {diasDecorridos} dias
        </div>
      )}

      {/* Data fim homologação - lógica condicional */}
      {projeto["Data: Fim Em homologação"] && fimHom && (
        <div className="text-gray-600 dark:text-gray-200">
          {hoje < fimHom ? (
            <>
              Fim previsto homologação:{" "}
              {formatDate(projeto["Data: Fim Em homologação"])}
            </>
          ) : (
            <>
              Saiu da homologação:{" "}
              {formatDate(projeto["Data: Fim Em homologação"])}
            </>
          )}
        </div>
      )}

      <hr />
      {/* Progresso da homologação (padrão igual ao desenvolvimento) */}
      {inicioHom && fimHom && (
        <>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progresso da homologação:</span>
            <span className="text-gray-600 dark:text-gray-400">
              {Math.round(progresso)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-1">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                atraso ? "bg-red-500" : "bg-blue-400"
              }`}
              style={{ width: `${Math.min(progresso, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Dias decorridos:{" "}
            <b>
              {diasDecorridos} / {totalDias} dias
            </b>
          </div>

          {atraso && (
            <div className="text-xs text-red-600 font-bold mt-1">
              Homologação atrasada — prazo previsto era até{" "}
              {formatDate(fimHom.toISOString())}
            </div>
          )}
        </>
      )}

      {/* Status de prazo - sempre fora do bloco acima */}
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
                style={{
                  backgroundColor: getPrazoBackgroundColor(
                    projeto["Status de prazo"],
                    theme
                  ),
                }}
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
 * Card para projetos em Operação Assistida
 */
const CardOperacaoAssistida: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  const { theme } = useTheme();

  // Datas de operação assistida
  const inicioOp = projeto["Data: Início Operação assistida"]
    ? new Date(projeto["Data: Início Operação assistida"])
    : null;
  const fimOp = projeto["Data: Fim Operação assistida"]
    ? new Date(projeto["Data: Fim Operação assistida"])
    : null;
  const hoje = new Date();

  // Progresso: dias decorridos e total
  let diasDecorridos = 0;
  let totalDias = 0;
  let atraso = false;
  if (inicioOp && fimOp) {
    totalDias = Math.floor(
      (fimOp.getTime() - inicioOp.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Verifica se o projeto ainda está em operação assistida
    const aindaEmOperacaoAssistida = projeto.Status === "Operação Assistida";

    if (aindaEmOperacaoAssistida) {
      // Se ainda está em operação assistida, conta até hoje
      diasDecorridos = Math.floor(
        (hoje.getTime() - inicioOp.getTime()) / (1000 * 60 * 60 * 24)
      );
      // Se passou do prazo, marca como atrasado
      if (hoje > fimOp) {
        atraso = true;
      }
    } else {
      // Se já saiu da operação assistida, conta apenas até a data de fim
      diasDecorridos = Math.floor(
        (fimOp.getTime() - inicioOp.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    if (diasDecorridos < 0) diasDecorridos = 0;
  }
  const progresso =
    inicioOp && fimOp && totalDias > 0
      ? Math.min((diasDecorridos / totalDias) * 100, 100)
      : 0;

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

      {/* Squads */}
      {projeto.Squads && projeto.Squads.length > 0 && (
        <div className="text-gray-600 dark:text-gray-200">
          Squads: {projeto.Squads.join(", ")}
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Data prevista de início */}
      {projeto["Target start"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Target start: {formatDate(projeto["Target start"])}
        </div>
      )}

      {/* Data prevista para término */}
      {projeto["Target end"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Target end: {formatDate(projeto["Target end"])}
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

      {/* Data que saiu da homologação */}
      {projeto["Data: Fim Em homologação"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Saiu da homologação: {formatDate(projeto["Data: Fim Em homologação"])}
        </div>
      )}

      {/* Data de finalização (fim do desenvolvimento) */}
      {projeto["Data: Fim Em andamento"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Data de finalização: {formatDate(projeto["Data: Fim Em andamento"])}
        </div>
      )}

      {/* Data que entrou em operação assistida */}
      {projeto["Data: Início Operação assistida"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Entrou em operação assistida:{" "}
          {formatDate(projeto["Data: Início Operação assistida"])}
        </div>
      )}

      {/* Tempo em operação assistida */}
      {inicioOp && fimOp && (
        <div className="text-gray-600 dark:text-gray-200">
          Tempo em operação assistida: {diasDecorridos} dias
        </div>
      )}

      {/* Data fim operação assistida - lógica condicional */}
      {projeto["Data: Fim Operação assistida"] && fimOp && (
        <div className="text-gray-600 dark:text-gray-200">
          {hoje < fimOp ? (
            <>
              Fim previsto operação assistida:{" "}
              {formatDate(projeto["Data: Fim Operação assistida"])}
            </>
          ) : (
            <>
              Saiu da operação assistida:{" "}
              {formatDate(projeto["Data: Fim Operação assistida"])}
            </>
          )}
        </div>
      )}

      <hr />

      {/* Progresso da operação assistida */}
      {inicioOp && fimOp && (
        <>
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              Progresso da operação assistida:
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {Math.round(progresso)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-1">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                atraso ? "bg-red-500" : "bg-blue-400"
              }`}
              style={{ width: `${Math.min(progresso, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Dias decorridos:{" "}
            <b>
              {diasDecorridos} / {totalDias} dias
            </b>
          </div>

          {atraso && (
            <div className="text-xs text-red-600 font-bold mt-1">
              Operação assistida atrasada — prazo previsto era até{" "}
              {formatDate(fimOp.toISOString())}
            </div>
          )}
        </>
      )}

      {/* Status de prazo - sempre fora do bloco acima */}
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
                style={{
                  backgroundColor: getPrazoBackgroundColor(
                    projeto["Status de prazo"],
                    theme
                  ),
                }}
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
    <CustomTooltip
      content={projeto.Descrição || "Sem descrição disponível"}
      priority={projeto.Prioridade}
    >
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
        {/* Squads */}
        {projeto.Squads && projeto.Squads.length > 0 && (
          <div className="text-gray-600 dark:text-gray-200">
            Squads: {projeto.Squads.join(", ")}
          </div>
        )}
        {/* Target start */}
        {projeto["Target start"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Target start: {formatDate(projeto["Target start"])}
          </div>
        )}
        {/* Target end */}
        {projeto["Target end"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Target end: {formatDate(projeto["Target end"])}
          </div>
        )}
        <hr className="my-1 border-gray-300 dark:border-gray-600" />
        {/* Entrou em desenvolvimento */}
        {projeto["Data: Início Em andamento"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Entrou em desenvolvimento:{" "}
            {formatDate(projeto["Data: Início Em andamento"])}
          </div>
        )}
        {/* Data de fim do desenvolvimento */}
        {projeto["Data: Fim Em andamento"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Data de fim do desenvolvimento:{" "}
            {formatDate(projeto["Data: Fim Em andamento"])}
          </div>
        )}
        {/* Tempo em desenvolvimento */}
        {projeto["Tempo na fase Em andamento (dias)"] !== null &&
          projeto["Tempo na fase Em andamento (dias)"] !== undefined && (
            <div className="text-gray-600 dark:text-gray-200">
              Tempo em desenvolvimento:{" "}
              {projeto["Tempo na fase Em andamento (dias)"]} dias
            </div>
          )}
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
      </div>
    </CustomTooltip>
  );
};

/**
 * Card para projetos CANCELADOS
 */
const CardCancelado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  // Cálculo do tempo em cancelamento
  const inicioCancelado = projeto["Data: Início Cancelado"]
    ? new Date(projeto["Data: Início Cancelado"])
    : null;
  const fimCancelado = projeto["Data: Fim Cancelado"]
    ? new Date(projeto["Data: Fim Cancelado"])
    : null;
  const hoje = new Date();
  let diasCancelado = null;
  if (inicioCancelado) {
    const dataFinal = fimCancelado ? fimCancelado : hoje;
    diasCancelado = Math.max(
      0,
      Math.floor(
        (dataFinal.getTime() - inicioCancelado.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
  }

  return withJiraLink(
    projeto,
    <CustomTooltip
      content={projeto.Descrição || "Sem descrição disponível"}
      priority={projeto.Prioridade}
    >
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
        {/* Squads */}
        {projeto.Squads && projeto.Squads.length > 0 && (
          <div className="text-gray-600 dark:text-gray-200">
            Squads: {projeto.Squads.join(", ")}
          </div>
        )}
        {/* Datas planejadas */}
        {projeto["Target start"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Target start: {formatDate(projeto["Target start"])}
          </div>
        )}
        {projeto["Target end"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Target end: {formatDate(projeto["Target end"])}
          </div>
        )}
        <hr className="my-1 border-gray-300 dark:border-gray-600" />
        {/* Data que entrou em cancelamento */}
        {projeto["Data: Início Cancelado"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Data que entrou em cancelamento:{" "}
            {formatDate(projeto["Data: Início Cancelado"])}
          </div>
        )}
        {/* Data que saiu do cancelamento */}
        {projeto["Data: Fim Cancelado"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Data que saiu do cancelamento:{" "}
            {formatDate(projeto["Data: Fim Cancelado"])}
          </div>
        )}
        {/* Tempo em cancelamento */}
        {diasCancelado !== null && (
          <div className="text-gray-600 dark:text-gray-200">
            Tempo em cancelamento: {diasCancelado} dias
          </div>
        )}
        {/* Motivo do cancelamento */}
        {projeto["Motivo para Bloqueio de Projeto"] && (
          <div className="text-gray-600 dark:text-gray-200">
            Motivo do cancelamento: {projeto["Motivo para Bloqueio de Projeto"]}
          </div>
        )}
      </div>
    </CustomTooltip>
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
          {projeto.Squads && projeto.Squads.length > 0 && (
            <div className="text-gray-600 dark:text-gray-200">
              Squads: {projeto.Squads.join(", ")}
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

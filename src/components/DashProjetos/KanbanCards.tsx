import React from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import {
  formatDate,
  formatarSegundos,
  getStatusColor,
  normalizarStatus,
} from "./kanbanUtils";
import { LightbulbIcon } from "../icons/DashboardIcons";
import { getFontSizes, getKanbanConfig } from "../../constants/styleConfig";

const KANBAN_CONFIG = getKanbanConfig();
const fontSizes = getFontSizes();

// ============================================================================
// COMPONENTES DE CARDS ESPECÍFICOS POR STATUS
// ============================================================================

/**
 * Card para projetos em IDEAÇÃO (Backlog)
 */
const CardIdeacao: React.FC<{ projeto: EspacoDeProjetos }> = ({ projeto }) => {
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
            className={`inline-block bg-white text-gray-800 font-medium px-2 py-1 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${fontSizes.tagCardKanban}`}
          >
            {projeto["Departamento Solicitante"]}
          </span>
        </div>
      )}
      {projeto.Categoria && (
        <div className="text-gray-600 dark:text-gray-100">
          Categoria: {projeto.Categoria}
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Datas */}
      <div className="text-gray-600 dark:text-gray-200">
        Criado em: {formatDate(projeto["Data de criação"])}
      </div>
      {projeto["Dias desde criação"] !== null && (
        <div className="text-gray-600 dark:text-gray-200">
          Em espera há: {projeto["Dias desde criação"]} dias
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
            className={`inline-block bg-white text-gray-800 font-medium px-2 py-1 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${fontSizes.tagCardKanban}`}
          >
            {projeto["Departamento Solicitante"]}
          </span>
        </div>
      )}
      {projeto.Categoria && (
        <div className="text-gray-600 dark:text-gray-200">
          Categoria: {projeto.Categoria}
        </div>
      )}

      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Datas */}
      <div className="text-gray-600 dark:text-gray-200">
        Criado em: {formatDate(projeto["Data de criação"])}
      </div>
      {projeto["Dias desde criação"] !== null && (
        <div className="text-gray-600 dark:text-gray-200">
          Em espera há: {projeto["Dias desde criação"]} dias
        </div>
      )}
      <div className="text-gray-600 dark:text-gray-200">
        Última atualização: {formatDate(projeto["Data de atualização"])}
      </div>
    </div>
  );
};

/**
 * Card para projetos em BACKLOG PRIORIZADO
 */
const CardBacklogPriorizado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  return (
    <div className={`space-y-2 ${fontSizes.corpoCardKanban}`}>
      <div
        className={`font-semibold text-gray-900 dark:text-white mb-2 break-words ${fontSizes.tituloCardKanban}`}
      >
        <span>{projeto.Título}</span>
      </div>

      {/* Informações Gerais */}
      {projeto["Departamento Solicitante"] ? (
        <div className="flex items-center gap-2">
          {projeto.PosicaoBacklog && (
            <span className="text-orange-500 dark:text-orange-400 font-bold text-sm">
              #{projeto.PosicaoBacklog}
            </span>
          )}
          <span
            className={`inline-block bg-white text-gray-800 font-medium px-2 py-1 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${fontSizes.tagCardKanban}`}
          >
            {projeto["Departamento Solicitante"]}
          </span>
        </div>
      ) : (
        projeto.PosicaoBacklog && (
          <div className="flex items-center gap-2">
            <span className="text-orange-500 dark:text-orange-400 font-bold text-sm">
              #{projeto.PosicaoBacklog}
            </span>
          </div>
        )
      )}
      {projeto.Categoria && (
        <div className="text-gray-600 dark:text-gray-200">
          Categoria: {projeto.Categoria}
        </div>
      )}
      <hr className="my-1 border-gray-300 dark:border-gray-600" />

      {/* Datas */}
      <div className="text-gray-600 dark:text-gray-200">
        Criado em: {formatDate(projeto["Data de criação"])}
      </div>
      {projeto["Dias desde criação"] !== null && (
        <div className="text-gray-600 dark:text-gray-200">
          Em espera há: {projeto["Dias desde criação"]} dias
        </div>
      )}
      {projeto["Target start"] && (
        <div className="text-gray-600 dark:text-gray-200">
          Início previsto: {formatDate(projeto["Target start"])}
        </div>
      )}

      {/* Financeiro */}
      {projeto["Investimento Esperado"] && (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="text-gray-600 dark:text-gray-200">
            Investimento esperado: {projeto["Investimento Esperado"]}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Card para projetos em EXECUÇÃO
 */
const CardEmExecucao: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  return (
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
      {projeto.Categoria && (
        <div className="text-gray-600 dark:text-gray-200">
          Categoria: {projeto.Categoria}
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
      {/* Progresso */}
      {(projeto["Dias desde o início"] !== null &&
        projeto["Dias restantes"] !== null) ||
      projeto["% do tempo decorrido"] !== null ? (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="pt-2">
            {projeto["Dias desde o início"] !== null &&
              projeto["Dias restantes"] !== null && (
                <div className="text-gray-600 dark:text-gray-200">
                  Dias desde o início: {projeto["Dias desde o início"]}
                  {(() => {
                    const status = normalizarStatus(projeto.Status);
                    const finalizado = [
                      "ENCERRAMENTO",
                      "Concluído",
                      "Cancelado",
                    ].includes(status);
                    const diasRestantes = projeto["Dias restantes"];
                    if (finalizado) {
                      if (diasRestantes < 0) {
                        return (
                          <span>
                            {" "}
                            • {Math.abs(diasRestantes)} dia
                            {Math.abs(diasRestantes) > 1 ? "s" : ""} de atraso
                          </span>
                        );
                      } else if (diasRestantes === 0) {
                        return <span> • Entregue no prazo</span>;
                      } else {
                        return (
                          <span>
                            {" "}
                            • {diasRestantes} dia{diasRestantes > 1 ? "s" : ""}{" "}
                            restantes
                          </span>
                        );
                      }
                    } else {
                      return (
                        <span>
                          {" "}
                          • {diasRestantes} dia
                          {diasRestantes > 1 || diasRestantes < -1
                            ? "s"
                            : ""}{" "}
                          restantes
                        </span>
                      );
                    }
                  })()}
                </div>
              )}
            {projeto["% do tempo decorrido"] !== null && (
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">% do tempo decorrido:</span>
                  <span>{projeto["% do tempo decorrido"]}%</span>
                  {projeto["Status de prazo"] && (
                    <span
                      className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                        projeto["Status de prazo"]
                      )} ${fontSizes.statusCardKanban}`}
                    >
                      {projeto["Status de prazo"]}
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
        </>
      ) : null}
      {/* Esforço */}
      {(projeto["Estimativa original (segundos)"] &&
        projeto["Tempo registrado (segundos)"] !== null) ||
      projeto["% da estimativa usada"] !== null ? (
        <>
          <hr className="my-1 border-gray-300 dark:border-gray-600" />
          <div className="pt-2">
            <div className="font-medium">Estimativa vs. Registrado:</div>
            {projeto["Estimativa original (segundos)"] &&
              projeto["Tempo registrado (segundos)"] !== null && (
                <div className="text-gray-600 dark:text-gray-200">
                  Estimativa:{" "}
                  {formatarSegundos(projeto["Estimativa original (segundos)"])}{" "}
                  • Registrado:{" "}
                  {formatarSegundos(projeto["Tempo registrado (segundos)"])}
                </div>
              )}
            {projeto["% da estimativa usada"] !== null && (
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <span>{projeto["% da estimativa usada"]}%</span>
                  {projeto["Status de esforço"] && (
                    <span
                      className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                        projeto["Status de esforço"]
                      )} ${fontSizes.statusCardKanban}`}
                    >
                      {projeto["Status de esforço"]}
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
      ) : null}
    </div>
  );
};

/**
 * Card para projetos em ENCERRAMENTO
 */
const CardEncerramento: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
  return (
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
      {projeto.Categoria && (
        <div className="text-gray-600 dark:text-gray-200">
          Categoria: {projeto.Categoria}
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
      {(projeto["Dias desde o início"] !== null &&
        projeto["Dias restantes"] !== null) ||
      projeto["% do tempo decorrido"] !== null ? (
        <hr className="my-1 border-gray-300 dark:border-gray-600" />
      ) : null}
      {/* Progresso */}
      <div className="pt-2">
        {projeto["Dias desde o início"] !== null &&
          projeto["Dias restantes"] !== null && (
            <div className="text-gray-600 dark:text-gray-200">
              Dias desde o início: {projeto["Dias desde o início"]}
              {(() => {
                const status = normalizarStatus(projeto.Status);
                const finalizado = [
                  "ENCERRAMENTO",
                  "Concluído",
                  "Cancelado",
                ].includes(status);
                const diasRestantes = projeto["Dias restantes"];
                if (finalizado) {
                  if (diasRestantes < 0) {
                    return (
                      <span>
                        {" "}
                        • {Math.abs(diasRestantes)} dia
                        {Math.abs(diasRestantes) > 1 ? "s" : ""} de atraso
                      </span>
                    );
                  } else if (diasRestantes === 0) {
                    return <span> • Entregue no prazo</span>;
                  } else {
                    return (
                      <span>
                        {" "}
                        • {diasRestantes} dia{diasRestantes > 1 ? "s" : ""}{" "}
                        restantes
                      </span>
                    );
                  }
                } else {
                  return (
                    <span>
                      {" "}
                      • {diasRestantes} dia
                      {diasRestantes > 1 || diasRestantes < -1 ? "s" : ""}{" "}
                      restantes
                    </span>
                  );
                }
              })()}
            </div>
          )}
        {projeto["% do tempo decorrido"] !== null && (
          <div className="mt-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">% do tempo decorrido:</span>
              <span>{projeto["% do tempo decorrido"]}%</span>
              {projeto["Status de prazo"] && (
                <span
                  className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                    projeto["Status de prazo"]
                  )} ${fontSizes.statusCardKanban}`}
                >
                  {projeto["Status de prazo"]}
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
        {projeto["% da estimativa usada"] !== null && (
          <div className="mt-1">
            <div className="flex items-center gap-2">
              <span>{projeto["% da estimativa usada"]}%</span>
              {projeto["Status de esforço"] && (
                <span
                  className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                    projeto["Status de esforço"]
                  )} ${fontSizes.statusCardKanban}`}
                >
                  {projeto["Status de esforço"]}
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
    </div>
  );
};

/**
 * Card para projetos ENTREGUE (Concluído)
 */
const CardEntregue: React.FC<{ projeto: EspacoDeProjetos }> = ({ projeto }) => {
  return (
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
      {projeto.Categoria && (
        <div className="text-gray-600 dark:text-gray-200">
          Categoria: {projeto.Categoria}
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
      {/* Progresso */}
      <div className="pt-2">
        {projeto["Dias desde o início"] !== null &&
          projeto["Dias restantes"] !== null && (
            <div className="text-gray-600 dark:text-gray-200">
              Dias desde o início: {projeto["Dias desde o início"]}
              {(() => {
                const status = normalizarStatus(projeto.Status);
                const finalizado = [
                  "ENCERRAMENTO",
                  "Concluído",
                  "Cancelado",
                ].includes(status);
                const diasRestantes = projeto["Dias restantes"];
                if (finalizado) {
                  if (diasRestantes < 0) {
                    return (
                      <span>
                        {" "}
                        • {Math.abs(diasRestantes)} dia
                        {Math.abs(diasRestantes) > 1 ? "s" : ""} de atraso
                      </span>
                    );
                  } else if (diasRestantes === 0) {
                    return <span> • Entregue no prazo</span>;
                  } else {
                    return (
                      <span>
                        {" "}
                        • {diasRestantes} dia{diasRestantes > 1 ? "s" : ""}{" "}
                        restantes
                      </span>
                    );
                  }
                } else {
                  return (
                    <span>
                      {" "}
                      • {diasRestantes} dia
                      {diasRestantes > 1 || diasRestantes < -1 ? "s" : ""}{" "}
                      restantes
                    </span>
                  );
                }
              })()}
            </div>
          )}
        {projeto["% do tempo decorrido"] !== null && (
          <div className="mt-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">% do tempo decorrido:</span>
              <span>{projeto["% do tempo decorrido"]}%</span>
              {projeto["Status de prazo"] && (
                <span
                  className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                    projeto["Status de prazo"]
                  )} ${fontSizes.statusCardKanban}`}
                >
                  {projeto["Status de prazo"]}
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
        {projeto["% da estimativa usada"] !== null && (
          <div className="mt-1">
            <div className="flex items-center gap-2">
              <span>{projeto["% da estimativa usada"]}%</span>
              {projeto["Status de esforço"] && (
                <span
                  className={`ml-2 px-1 py-0.5 rounded font-medium ${getStatusColor(
                    projeto["Status de esforço"]
                  )} ${fontSizes.statusCardKanban}`}
                >
                  {projeto["Status de esforço"]}
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
    </div>
  );
};

/**
 * Card para projetos CANCELADOS
 */
const CardCancelado: React.FC<{ projeto: EspacoDeProjetos }> = ({
  projeto,
}) => {
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
            className={`inline-block bg-white text-gray-800 font-medium px-2 py-1 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${fontSizes.tagCardKanban}`}
          >
            {projeto["Departamento Solicitante"]}
          </span>
        </div>
      )}
      {projeto.Categoria && (
        <div className="text-gray-600 dark:text-gray-200">
          Categoria: {projeto.Categoria}
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
          {projeto.Categoria && (
            <div className="text-gray-600 dark:text-gray-200">
              Categoria: {projeto.Categoria}
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

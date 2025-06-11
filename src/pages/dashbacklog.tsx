/**
 * dashbacklog.tsx
 *
 * Este é o componente principal do dashboard de backlog que:
 * 1. Exibe métricas e gráficos do backlog
 * 2. Gerencia filtros (projeto, área, solicitante, prioridade)
 * 3. Renderiza diferentes visualizações dos dados
 *
 * Componentes utilizados:
 * - BacklogKPICards: Exibe métricas principais
 * - BacklogQueues: Mostra as filas de cards
 * - BacklogCharts: Renderiza gráficos e análises
 *
 * O componente também:
 * - Gerencia o estado dos filtros
 * - Calcula dados filtrados em tempo real
 * - Trata estados de loading e erro
 */

import React, { useState, useMemo } from "react";
import { calculateBacklogMetrics } from "../utils/backlogMetrics";
import { BacklogKPICards } from "../components/dashboard/BacklogKPICards";
import BacklogQueues from "../components/dashboard/BacklogQueues";
import { useJira } from "../context/JiraContext";
import {
  BacklogCharts,
  SaudeBacklogChart,
  ProjetosPorAreaChart,
  CardsPorAreaChart,
  ProjetosPorSolicitanteChart,
} from "../components/dashboard/BacklogCharts";

const DashBacklog: React.FC = () => {
  const { backlogData } = useJira();
  const [filtros, setFiltros] = useState({
    projeto: "",
    area: "",
    solicitante: "",
    prioridade: "",
  });

  // Função auxiliar para normalizar strings
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const filteredData = useMemo(() => {
    return backlogData.rawData.filter((item) => {
      const matchesProjeto =
        !filtros.projeto ||
        normalizeString(item.Projeto || "") ===
          normalizeString(filtros.projeto);

      const matchesArea =
        !filtros.area ||
        normalizeString(item["Unidade / Departamento"] || "") ===
          normalizeString(filtros.area);

      const matchesSolicitante =
        !filtros.solicitante ||
        normalizeString(item.Solicitante || "") ===
          normalizeString(filtros.solicitante);

      const matchesPrioridade =
        !filtros.prioridade ||
        normalizeString(item.Prioridade || "") ===
          normalizeString(filtros.prioridade);

      return (
        matchesProjeto && matchesArea && matchesSolicitante && matchesPrioridade
      );
    });
  }, [backlogData.rawData, filtros]);

  const projetosOptions = useMemo(
    () =>
      [
        ...new Set(backlogData.rawData.map((i) => i.Projeto).filter(Boolean)),
      ] as string[],
    [backlogData.rawData]
  );
  const areaOptions = useMemo(
    () => [
      ...new Set(
        backlogData.rawData
          .map((i) => i["Unidade / Departamento"])
          .filter(Boolean)
      ),
    ],
    [backlogData.rawData]
  );
  const solicitanteOptions = useMemo(
    () => [
      ...new Set(backlogData.rawData.map((i) => i.Solicitante).filter(Boolean)),
    ],
    [backlogData.rawData]
  );
  const prioridadeOptions = useMemo(
    () => [
      ...new Set(backlogData.rawData.map((i) => i.Prioridade).filter(Boolean)),
    ],
    [backlogData.rawData]
  );

  if (backlogData.loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">
          Carregando dados do backlog...
        </div>
      </div>
    );
  }

  if (backlogData.error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">
          Erro ao carregar dados: {backlogData.error}
        </div>
      </div>
    );
  }

  const metrics = calculateBacklogMetrics(filteredData);

  // ==================================================================
  // ========= Seção de Filtros Redesenhada ===========================
  // ==================================================================
  const renderFilters = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Filtros
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro de Projeto */}
        <div>
          <label
            htmlFor="projeto-filter"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Projeto
          </label>
          <select
            id="projeto-filter"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={filtros.projeto}
            onChange={(e) =>
              setFiltros((f) => ({ ...f, projeto: e.target.value }))
            }
          >
            <option value="">Todos</option>
            {projetosOptions.map((projeto) => (
              <option key={projeto} value={projeto}>
                {projeto}
              </option>
            ))}
          </select>
        </div>
        {/* Filtro de Área */}
        <div>
          <label
            htmlFor="area-filter"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Área
          </label>
          <select
            id="area-filter"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={filtros.area}
            onChange={(e) =>
              setFiltros((f) => ({ ...f, area: e.target.value }))
            }
          >
            <option value="">Todas</option>
            {areaOptions.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
        {/* Filtro de Solicitante */}
        <div>
          <label
            htmlFor="solicitante-filter"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Solicitante
          </label>
          <select
            id="solicitante-filter"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={filtros.solicitante}
            onChange={(e) =>
              setFiltros((f) => ({ ...f, solicitante: e.target.value }))
            }
          >
            <option value="">Todos</option>
            {solicitanteOptions.map((sol) => (
              <option key={sol} value={sol}>
                {sol}
              </option>
            ))}
          </select>
        </div>
        {/* Filtro de Prioridade */}
        <div>
          <label
            htmlFor="prioridade-filter"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Prioridade
          </label>
          <select
            id="prioridade-filter"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={filtros.prioridade}
            onChange={(e) =>
              setFiltros((f) => ({ ...f, prioridade: e.target.value }))
            }
          >
            <option value="">Todas</option>
            {prioridadeOptions.map((prio) => (
              <option key={prio} value={prio}>
                {prio}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  if (!metrics || filteredData.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard do Backlog</h1>
        {renderFilters()}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center justify-center h-96">
          <div className="text-xl text-gray-500 dark:text-gray-400">
            Nenhum dado encontrado para os filtros selecionados.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard do Backlog</h1>
      {renderFilters()}
      <div className="flex flex-col gap-6">
        <div>
          <BacklogKPICards
            metrics={{
              total_cards: metrics.basic.total_cards,
              total_projetos: metrics.basic.total_projetos,
              idade_media_dias: metrics.saude_backlog.idade_media,
              card_mais_antigo: {
                chave: metrics.saude_backlog.projeto_mais_antigo.chave,
                titulo: metrics.saude_backlog.projeto_mais_antigo.titulo,
                dias: metrics.saude_backlog.mais_antigo,
                projeto: metrics.saude_backlog.projeto_mais_antigo.projeto,
              },
              primeiro_projeto: metrics.basic.primeiro_projeto
                ? {
                    projeto: metrics.basic.primeiro_projeto.projeto,
                    area: metrics.basic.primeiro_projeto.departamento,
                    prioridade: metrics.basic.primeiro_projeto.prioridade,
                    chave: metrics.basic.primeiro_projeto.chave,
                  }
                : undefined,
            }}
            rawData={filteredData}
          />
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-6">
          <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
            <div className="break-inside-avoid">
              <BacklogCharts
                projetosPorPrioridade={metrics.projetos_por_prioridade}
              />
            </div>
            <div className="break-inside-avoid">
              <SaudeBacklogChart
                saude={{
                  ...metrics.saude_backlog,
                  projeto_mais_antigo: {
                    ...metrics.saude_backlog.projeto_mais_antigo,
                    dias: metrics.saude_backlog.mais_antigo,
                  },
                }}
              />
            </div>
            <div className="break-inside-avoid">
              <ProjetosPorAreaChart
                projetosPorArea={metrics.projetos_por_area}
              />
            </div>
            <div className="break-inside-avoid">
              <CardsPorAreaChart cardsPorArea={metrics.cards_por_area} />
            </div>
            <div className="break-inside-avoid">
              <ProjetosPorSolicitanteChart
                projetosPorSolicitante={metrics.projetos_por_solicitante}
              />
            </div>
          </div>
          <div className="w-full max-w-[420px]">
            <BacklogQueues
              filaAtual={metrics.fila_atual}
              filaPorProjeto={metrics.fila_por_projeto}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBacklog;

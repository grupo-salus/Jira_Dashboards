import React, { useEffect, useState, useMemo } from "react";
import { fetchBacklogTable } from "../api/api_jira";
import { BacklogItem } from "../types/backlog";
import { calculateBacklogMetrics } from "../utils/backlogMetrics";
import { BacklogKPICards } from "../components/dashboard/BacklogKPICards";
import BacklogQueues from "../components/dashboard/BacklogQueues";
import {
  BacklogCharts,
  SaudeBacklogChart,
  ProjetosPorAreaChart,
  CardsPorAreaChart,
  ProjetosPorSolicitanteChart,
} from "../components/dashboard/BacklogCharts";

const DashBacklog: React.FC = () => {
  const [rawData, setRawData] = useState<BacklogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState({
    projeto: "",
    area: "",
    solicitante: "",
    prioridade: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const backlogData = await fetchBacklogTable();
        setRawData(backlogData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return rawData.filter(
      (item) =>
        (filtros.projeto ? item.Projeto === filtros.projeto : true) &&
        (filtros.area
          ? item["Unidade / Departamento"] === filtros.area
          : true) &&
        (filtros.solicitante
          ? item.Solicitante === filtros.solicitante
          : true) &&
        (filtros.prioridade ? item.Prioridade === filtros.prioridade : true)
    );
  }, [rawData, filtros]);

  const projetosOptions = useMemo(
    () =>
      [...new Set(rawData.map((i) => i.Projeto).filter(Boolean))] as string[],
    [rawData]
  );
  const areaOptions = useMemo(
    () => [
      ...new Set(
        rawData.map((i) => i["Unidade / Departamento"]).filter(Boolean)
      ),
    ],
    [rawData]
  );
  const solicitanteOptions = useMemo(
    () => [...new Set(rawData.map((i) => i.Solicitante).filter(Boolean))],
    [rawData]
  );
  const prioridadeOptions = useMemo(
    () => [...new Set(rawData.map((i) => i.Prioridade).filter(Boolean))],
    [rawData]
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">
          Carregando dados do backlog...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">
          Erro ao carregar dados: {error}
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
              ...metrics.basic,
              card_mais_antigo: {
                ...(metrics.basic.card_mais_antigo ?? {}),
                projeto: metrics.basic.card_mais_antigo?.projeto ?? undefined,
              },
              primeiro_projeto: metrics.basic.primeiro_projeto
                ? {
                    ...metrics.basic.primeiro_projeto,
                    area: metrics.basic.primeiro_projeto.departamento,
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

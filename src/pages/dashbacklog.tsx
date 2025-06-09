import React, { useEffect, useState, useMemo } from "react";
import { fetchBacklogTable } from "../api/api_jira";
import { BacklogItem } from "../types/backlog";
import { calculateBacklogMetrics } from "../utils/backlogMetrics";
import { BacklogKPICards } from "../components/dashboard/BacklogKPICards";
import BacklogQueues from "../components/dashboard/BacklogQueues";
import {
  BacklogCharts,
  TarefasPorPrioridadeChart,
  SaudeBacklogChart,
  EpicosPorDepartamentoChart,
  CardsPorDepartamentoChart,
  ProjetosPorSolicitanteChart,
  CardsPorSolicitanteChart,
} from "../components/dashboard/BacklogCharts";

const DashBacklog: React.FC = () => {
  const [rawData, setRawData] = useState<BacklogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState({
    epico: "",
    departamento: "",
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
        (filtros.epico ? item.Épico === filtros.epico : true) &&
        (filtros.departamento
          ? item["Unidade / Departamento"] === filtros.departamento
          : true) &&
        (filtros.solicitante
          ? item.Solicitante === filtros.solicitante
          : true) &&
        (filtros.prioridade ? item.Prioridade === filtros.prioridade : true)
    );
  }, [rawData, filtros]);

  const epicosOptions = useMemo(
    () => [...new Set(rawData.map((i) => i.Épico).filter(Boolean))],
    [rawData]
  );
  const departamentoOptions = useMemo(
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
        {/* Filtro de Épico/Projeto */}
        <div>
          <label
            htmlFor="epico-filter"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Épico/Projeto
          </label>
          <select
            id="epico-filter"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={filtros.epico}
            onChange={(e) =>
              setFiltros((f) => ({ ...f, epico: e.target.value }))
            }
          >
            <option value="">Todos</option>
            {epicosOptions.map((epico) => (
              <option key={epico} value={epico}>
                {epico}
              </option>
            ))}
          </select>
        </div>
        {/* Filtro de Departamento */}
        <div>
          <label
            htmlFor="departamento-filter"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Departamento
          </label>
          <select
            id="departamento-filter"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={filtros.departamento}
            onChange={(e) =>
              setFiltros((f) => ({ ...f, departamento: e.target.value }))
            }
          >
            <option value="">Todos</option>
            {departamentoOptions.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
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
                epico: metrics.basic.card_mais_antigo?.epico ?? null,
              },
              primeiro_projeto: metrics.basic.primeiro_projeto ?? undefined,
            }}
            rawData={filteredData}
          />
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-6">
          <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
            <div className="break-inside-avoid">
              <BacklogCharts
                epicosPorPrioridade={metrics.epicos_por_prioridade}
              />
            </div>
            <div className="break-inside-avoid">
              <TarefasPorPrioridadeChart
                tarefasPorPrioridade={metrics.tarefas_por_prioridade}
              />
            </div>
            <div className="break-inside-avoid">
              <SaudeBacklogChart saude={metrics.saude_backlog} />
            </div>
            <div className="break-inside-avoid">
              <EpicosPorDepartamentoChart
                epicosPorDepartamento={metrics.epicos_por_departamento}
              />
            </div>
            <div className="break-inside-avoid">
              <CardsPorDepartamentoChart
                cardsPorDepartamento={metrics.cards_por_departamento}
              />
            </div>
            <div className="break-inside-avoid">
              <ProjetosPorSolicitanteChart
                projetosPorSolicitante={metrics.projetos_por_solicitante}
              />
            </div>
            <div className="break-inside-avoid">
              <CardsPorSolicitanteChart
                cardsPorSolicitante={metrics.cards_por_solicitante}
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

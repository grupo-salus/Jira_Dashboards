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
import { useJira } from "../context/JiraContext";
import BacklogTable from "../components/DashBacklog/BacklogTable";

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard do Backlog</h1>

      {/* Seção de Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
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

      {/* Resultados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-lg font-semibold mb-4">
          Resultados: {filteredData.length} itens encontrados
        </div>
        <BacklogTable data={filteredData} />
      </div>
    </div>
  );
};

export default DashBacklog;

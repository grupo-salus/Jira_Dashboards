/**
 * dashprojetos.tsx
 *
 * Este é o componente principal do dashboard de Espaço de Projetos que:
 * 1. Exibe métricas e gráficos dos projetos
 * 2. Gerencia filtros (área, projeto, solicitante, prioridade, status, grupo solicitante)
 * 3. Renderiza diferentes visualizações dos dados
 *
 * Componentes utilizados:
 * - ProjetosTable: Exibe a tabela de projetos
 *
 * O componente também:
 * - Gerencia o estado dos filtros
 * - Calcula dados filtrados em tempo real
 * - Trata estados de loading e erro
 */

import React, { useState, useMemo } from "react";
import { useJira } from "../context/JiraContext";
import { EspacoDeProjetos } from "../types/Typesjira";
import ProjetosTable from "../components/DashProjetos/ProjetosTable";

const DashProjetos: React.FC = () => {
  const { projetosData } = useJira();
  const [filtros, setFiltros] = useState({
    area: "",
    projeto: "",
    solicitante: "",
    prioridade: "",
    status: "",
    grupo_solicitante: "",
  });

  // Função auxiliar para normalizar strings
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const filteredData = useMemo(() => {
    return projetosData.rawData.filter((item: EspacoDeProjetos) => {
      const matchesArea =
        !filtros.area ||
        normalizeString(item["Departamento Solicitante"] || "") ===
          normalizeString(filtros.area);

      const matchesProjeto =
        !filtros.projeto ||
        normalizeString(item.Título || "") === normalizeString(filtros.projeto);

      const matchesSolicitante =
        !filtros.solicitante ||
        normalizeString(item.Solicitante || "") ===
          normalizeString(filtros.solicitante);

      const matchesPrioridade =
        !filtros.prioridade ||
        normalizeString(item.Prioridade || "") ===
          normalizeString(filtros.prioridade);

      const matchesStatus =
        !filtros.status ||
        normalizeString(item.Status || "") === normalizeString(filtros.status);

      const matchesGrupoSolicitante =
        !filtros.grupo_solicitante ||
        normalizeString(item["Grupo Solicitante"] || "") ===
          normalizeString(filtros.grupo_solicitante);

      return (
        matchesArea &&
        matchesProjeto &&
        matchesSolicitante &&
        matchesPrioridade &&
        matchesStatus &&
        matchesGrupoSolicitante
      );
    });
  }, [projetosData.rawData, filtros]);

  const areaOptions = useMemo(
    () => [
      ...new Set(
        projetosData.rawData
          .map((i: EspacoDeProjetos) => i["Departamento Solicitante"])
          .filter(Boolean)
      ),
    ],
    [projetosData.rawData]
  );

  const projetoOptions = useMemo(
    () =>
      [
        ...new Set(
          projetosData.rawData
            .map((i: EspacoDeProjetos) => i.Título)
            .filter(Boolean)
        ),
      ] as string[],
    [projetosData.rawData]
  );

  const solicitanteOptions = useMemo(
    () => [
      ...new Set(
        projetosData.rawData
          .map((i: EspacoDeProjetos) => i.Solicitante)
          .filter(Boolean)
      ),
    ],
    [projetosData.rawData]
  );

  const prioridadeOptions = useMemo(
    () => [
      ...new Set(
        projetosData.rawData
          .map((i: EspacoDeProjetos) => i.Prioridade)
          .filter(Boolean)
      ),
    ],
    [projetosData.rawData]
  );

  const statusOptions = useMemo(
    () => [
      ...new Set(
        projetosData.rawData
          .map((i: EspacoDeProjetos) => i.Status)
          .filter(Boolean)
      ),
    ],
    [projetosData.rawData]
  );

  const grupoSolicitanteOptions = useMemo(
    () => [
      ...new Set(
        projetosData.rawData
          .map((i: EspacoDeProjetos) => i["Grupo Solicitante"])
          .filter(Boolean)
      ),
    ],
    [projetosData.rawData]
  );

  if (projetosData.loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">
          Carregando dados dos projetos...
        </div>
      </div>
    );
  }

  if (projetosData.error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">
          Erro ao carregar dados: {projetosData.error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard de Espaço de Projetos
      </h1>

      {/* Seção de Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
              {projetoOptions.map((projeto) => (
                <option key={projeto} value={projeto}>
                  {projeto}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Status */}
          <div>
            <label
              htmlFor="status-filter"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Status
            </label>
            <select
              id="status-filter"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={filtros.status}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, status: e.target.value }))
              }
            >
              <option value="">Todos</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
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

          {/* Filtro de Grupo Solicitante */}
          <div>
            <label
              htmlFor="grupo-solicitante-filter"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Grupo Solicitante
            </label>
            <select
              id="grupo-solicitante-filter"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={filtros.grupo_solicitante}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, grupo_solicitante: e.target.value }))
              }
            >
              <option value="">Todos</option>
              {grupoSolicitanteOptions.map((grupo) => (
                <option key={grupo} value={grupo}>
                  {grupo}
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
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-lg font-semibold mb-4">
          Resultados: {filteredData.length} itens encontrados
        </div>
        <ProjetosTable data={filteredData} />
      </div>
    </div>
  );
};

export default DashProjetos;

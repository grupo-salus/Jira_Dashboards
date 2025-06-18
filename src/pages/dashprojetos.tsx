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
 * - ProjetosKanban: Exibe o quadro de tarefas (Kanban)
 *
 * O componente também:
 * - Gerencia o estado dos filtros
 * - Calcula dados filtrados em tempo real
 * - Trata estados de loading e erro
 */

import React, { useState, useMemo } from "react";
import { useJira } from "../context/JiraContext";
import { EspacoDeProjetos } from "../types/Typesjira";
import { ProjetosTable, ProjetosKanban } from "../components/DashProjetos";
import { getPriorityConfig } from "../constants/priorities";
import {
  STATUS_MAP,
  COLUMN_ORDER,
  STATUS_COLUMNS,
} from "../components/DashProjetos/ProjetosKanban";
import ProjetosBarPorArea from "../components/DashProjetos/ProjetosBarPorArea";
import ProjetosRadarPorPrioridade from "../components/DashProjetos/ProjetosRadarPorPrioridade";
import ProjetosPiePorStatus from "../components/DashProjetos/ProjetosPiePorStatus";

const DashProjetos: React.FC = () => {
  const { projetosData } = useJira();
  const [visualizacao, setVisualizacao] = useState<"tabela" | "kanban">(
    "kanban"
  );
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

  // Função para aplicar filtros em cascata
  const aplicarFiltrosCascata = (
    dados: EspacoDeProjetos[],
    filtrosAtivos: typeof filtros
  ) => {
    return dados.filter((item: EspacoDeProjetos) => {
      const matchesArea =
        !filtrosAtivos.area ||
        normalizeString(item["Departamento Solicitante"] || "") ===
          normalizeString(filtrosAtivos.area);

      const matchesProjeto =
        !filtrosAtivos.projeto ||
        normalizeString(item.Título || "") ===
          normalizeString(filtrosAtivos.projeto);

      const matchesSolicitante =
        !filtrosAtivos.solicitante ||
        normalizeString(item.Solicitante || "") ===
          normalizeString(filtrosAtivos.solicitante);

      const matchesPrioridade =
        !filtrosAtivos.prioridade ||
        normalizeString(item.Prioridade || "") ===
          normalizeString(filtrosAtivos.prioridade);

      const matchesStatus =
        !filtrosAtivos.status ||
        normalizeString(item.Status || "") ===
          normalizeString(filtrosAtivos.status);

      const matchesGrupoSolicitante =
        !filtrosAtivos.grupo_solicitante ||
        normalizeString(item["Grupo Solicitante"] || "") ===
          normalizeString(filtrosAtivos.grupo_solicitante);

      return (
        matchesArea &&
        matchesProjeto &&
        matchesSolicitante &&
        matchesPrioridade &&
        matchesStatus &&
        matchesGrupoSolicitante
      );
    });
  };

  // Dados filtrados finais (para a tabela)
  const filteredData = useMemo(() => {
    return aplicarFiltrosCascata(projetosData.rawData, filtros);
  }, [projetosData.rawData, filtros]);

  // Dados filtrados para cada dropdown (cascata)
  const dadosParaArea = useMemo(() => {
    return projetosData.rawData;
  }, [projetosData.rawData]);

  const dadosParaProjeto = useMemo(() => {
    const filtrosTemp = { ...filtros, projeto: "" };
    return aplicarFiltrosCascata(projetosData.rawData, filtrosTemp);
  }, [
    projetosData.rawData,
    filtros.area,
    filtros.solicitante,
    filtros.prioridade,
    filtros.status,
    filtros.grupo_solicitante,
  ]);

  const dadosParaSolicitante = useMemo(() => {
    const filtrosTemp = { ...filtros, solicitante: "" };
    return aplicarFiltrosCascata(projetosData.rawData, filtrosTemp);
  }, [
    projetosData.rawData,
    filtros.area,
    filtros.projeto,
    filtros.prioridade,
    filtros.status,
    filtros.grupo_solicitante,
  ]);

  const dadosParaPrioridade = useMemo(() => {
    const filtrosTemp = { ...filtros, prioridade: "" };
    return aplicarFiltrosCascata(projetosData.rawData, filtrosTemp);
  }, [
    projetosData.rawData,
    filtros.area,
    filtros.projeto,
    filtros.solicitante,
    filtros.status,
    filtros.grupo_solicitante,
  ]);

  const dadosParaStatus = useMemo(() => {
    const filtrosTemp = { ...filtros, status: "" };
    return aplicarFiltrosCascata(projetosData.rawData, filtrosTemp);
  }, [
    projetosData.rawData,
    filtros.area,
    filtros.projeto,
    filtros.solicitante,
    filtros.prioridade,
    filtros.grupo_solicitante,
  ]);

  const dadosParaGrupoSolicitante = useMemo(() => {
    const filtrosTemp = { ...filtros, grupo_solicitante: "" };
    return aplicarFiltrosCascata(projetosData.rawData, filtrosTemp);
  }, [
    projetosData.rawData,
    filtros.area,
    filtros.projeto,
    filtros.solicitante,
    filtros.prioridade,
    filtros.status,
  ]);

  // Opções para cada dropdown baseadas nos dados filtrados
  const areaOptions = useMemo(
    () => [
      ...new Set(
        dadosParaArea
          .map((i: EspacoDeProjetos) => i["Departamento Solicitante"])
          .filter((value): value is string => Boolean(value))
      ),
    ],
    [dadosParaArea]
  );

  const projetoOptions = useMemo(
    () => [
      ...new Set(
        dadosParaProjeto
          .map((i: EspacoDeProjetos) => i.Título)
          .filter((value): value is string => Boolean(value))
      ),
    ],
    [dadosParaProjeto]
  );

  const solicitanteOptions = useMemo(
    () => [
      ...new Set(
        dadosParaSolicitante
          .map((i: EspacoDeProjetos) => i.Solicitante)
          .filter((value): value is string => Boolean(value))
      ),
    ],
    [dadosParaSolicitante]
  );

  const prioridadeOptions = useMemo(
    () => [
      ...new Set(
        dadosParaPrioridade
          .map((i: EspacoDeProjetos) => i.Prioridade)
          .filter((value): value is string => Boolean(value))
      ),
    ],
    [dadosParaPrioridade]
  );

  // Opções de prioridade traduzidas para o dropdown
  const prioridadeOptionsTraduzidas = useMemo(() => {
    return prioridadeOptions.map((prioridade) => ({
      valor: prioridade,
      label: getPriorityConfig(prioridade).label,
    }));
  }, [prioridadeOptions]);

  // Opções de status padronizadas para o filtro
  const statusOptions = useMemo(() => {
    // Pega todos os status únicos dos dados filtrados
    const statusSet = new Set<
      keyof typeof STATUS_MAP | keyof typeof STATUS_COLUMNS
    >(
      dadosParaStatus.map((i: EspacoDeProjetos) => {
        const rawStatus = (i.Status || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "");
        return STATUS_MAP[rawStatus] || "Backlog";
      })
    );
    // Retorna na ordem do Kanban
    return COLUMN_ORDER.filter((status) =>
      statusSet.has(status as keyof typeof STATUS_COLUMNS)
    );
  }, [dadosParaStatus]);

  const grupoSolicitanteOptions = useMemo(
    () => [
      ...new Set(
        dadosParaGrupoSolicitante
          .map((i: EspacoDeProjetos) => i["Grupo Solicitante"])
          .filter((value): value is string => Boolean(value))
      ),
    ],
    [dadosParaGrupoSolicitante]
  );

  // Função para limpar filtros dependentes quando um filtro é alterado
  const handleFiltroChange = (campo: keyof typeof filtros, valor: string) => {
    setFiltros((prev) => {
      const novosFiltros = { ...prev, [campo]: valor };

      // Limpar filtros dependentes baseado na hierarquia
      if (campo === "area") {
        novosFiltros.projeto = "";
        novosFiltros.solicitante = "";
        novosFiltros.prioridade = "";
        novosFiltros.status = "";
        novosFiltros.grupo_solicitante = "";
      } else if (campo === "projeto") {
        novosFiltros.solicitante = "";
        novosFiltros.prioridade = "";
        novosFiltros.status = "";
        novosFiltros.grupo_solicitante = "";
      } else if (campo === "solicitante") {
        novosFiltros.prioridade = "";
        novosFiltros.status = "";
        novosFiltros.grupo_solicitante = "";
      } else if (campo === "prioridade") {
        novosFiltros.status = "";
        novosFiltros.grupo_solicitante = "";
      } else if (campo === "status") {
        novosFiltros.grupo_solicitante = "";
      }

      return novosFiltros;
    });
  };

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
      {/* Seção de Filtros */}
      <div className="mb-6">
        <div className="flex flex-wrap items-end gap-3 w-full">
          {/* Filtro de Área */}
          <div>
            <label
              htmlFor="area-filter"
              className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
            >
              Área
            </label>
            <select
              id="area-filter"
              className="bg-gray-50 border border-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-36 h-8 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={filtros.area}
              onChange={(e) => handleFiltroChange("area", e.target.value)}
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
              className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
            >
              Projeto
            </label>
            <select
              id="projeto-filter"
              className="bg-gray-50 border border-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-36 h-8 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={filtros.projeto}
              onChange={(e) => handleFiltroChange("projeto", e.target.value)}
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
              className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
            >
              Status
            </label>
            <select
              id="status-filter"
              className="bg-gray-50 border border-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-36 h-8 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={filtros.status}
              onChange={(e) => handleFiltroChange("status", e.target.value)}
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
              className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
            >
              Prioridade
            </label>
            <select
              id="prioridade-filter"
              className="bg-gray-50 border border-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-36 h-8 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={filtros.prioridade}
              onChange={(e) => handleFiltroChange("prioridade", e.target.value)}
            >
              <option value="">Todas</option>
              {prioridadeOptionsTraduzidas.map((prio) => (
                <option key={prio.valor} value={prio.valor}>
                  {prio.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Grupo Solicitante */}
          <div>
            <label
              htmlFor="grupo-solicitante-filter"
              className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
            >
              Grupo Solicitante
            </label>
            <select
              id="grupo-solicitante-filter"
              className="bg-gray-50 border border-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-36 h-8 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={filtros.grupo_solicitante}
              onChange={(e) =>
                handleFiltroChange("grupo_solicitante", e.target.value)
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
              className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
            >
              Solicitante
            </label>
            <select
              id="solicitante-filter"
              className="bg-gray-50 border border-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-36 h-8 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={filtros.solicitante}
              onChange={(e) =>
                handleFiltroChange("solicitante", e.target.value)
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

          {/* Botão Limpar Filtros */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-1 flex justify-end">
            <button
              onClick={() =>
                setFiltros({
                  area: "",
                  projeto: "",
                  solicitante: "",
                  prioridade: "",
                  status: "",
                  grupo_solicitante: "",
                })
              }
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 h-8"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Gráficos do dashboard */}
      <div className="mb-6 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="font-semibold text-gray-900 dark:text-white mb-2 text-lg text-left">
            Projetos por Área
          </div>
          <ProjetosBarPorArea data={filteredData} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="font-semibold text-gray-900 dark:text-white mb-2 text-lg text-left">
            Projetos por Prioridade
          </div>
          <ProjetosRadarPorPrioridade data={filteredData} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div className="font-semibold text-gray-900 dark:text-white mb-2 text-lg text-left">
            Projetos por Status
          </div>
          <ProjetosPiePorStatus data={filteredData} />
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">
            Resultados: {filteredData.length} itens encontrados
          </div>

          {/* Toggle de visualização */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setVisualizacao("kanban")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                visualizacao === "kanban"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setVisualizacao("tabela")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                visualizacao === "tabela"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Tabela
            </button>
          </div>
        </div>

        {/* Renderização condicional */}
        {visualizacao === "kanban" ? (
          <ProjetosKanban data={filteredData} />
        ) : (
          <ProjetosTable data={filteredData} />
        )}
      </div>
    </div>
  );
};

export default DashProjetos;

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

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useJira } from "../context/JiraContext";
import { EspacoDeProjetos, JiraStatus } from "../types/Typesjira";
import { ProjetosTable, ProjetosKanban } from "../components/DashProjetos";
import { getPriorityConfig } from "../constants/priorities";
import { COLUMN_ORDER } from "../components/DashProjetos/kanbanUtils";
import ProjetosBarPorArea from "../components/DashProjetos/ProjetosBarPorArea";
import ProjetosBarPorPrioridade from "../components/DashProjetos/ProjetosBarPorPrioridade";
import ProjetosTotalizadores from "../components/DashProjetos/ProjetosTotalizadores";
import AnaliseDemandasPorCategoria from "../components/DashProjetos/AnaliseDemandasPorCategoria";
import IdeiasObsoletas from "../components/DashProjetos/IdeiasObsoletas";
import {
  getFontSizes,
  setTamanhoGlobal,
  getTamanhoGlobal,
} from "../constants/styleConfig";
import CustomDropdown from "../components/common/CustomDropdown";

// Mapeamento de nomes de status para exibição
const statusNameMap: Record<string, string> = {
  Backlog: "Ideação",
  "Em andamento": "Em Execução",
  Concluído: "Entregue",
};

const DashProjetos: React.FC = () => {
  const { projetosData } = useJira();
  const [visualizacao, setVisualizacao] = useState<"tabela" | "kanban">(
    "kanban"
  );
  const [menuAberto, setMenuAberto] = useState(false);
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(true);
  const [tamanhoAtual, setTamanhoAtual] = useState(getTamanhoGlobal());
  const [, setForceUpdate] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const [filtros, setFiltros] = useState({
    area: "",
    projeto: "",
    solicitante: "",
    prioridade: "",
    status: "" as JiraStatus | "",
    grupo_solicitante: "",
    categoria: "",
  });

  // Obter configurações de fonte atuais
  const fontSizes = getFontSizes();

  const tamanhoOptions = [
    { value: "pequeno", label: "Pequeno" },
    { value: "medio", label: "Médio" },
    { value: "grande", label: "Grande" },
    { value: "muitoGrande", label: "Muito Grande" },
  ];

  // Listener para mudanças no tamanho global
  useEffect(() => {
    const handleTamanhoChange = () => {
      setTamanhoAtual(getTamanhoGlobal());
      setForceUpdate((prev) => prev + 1); // Força re-render
    };

    window.addEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    return () => {
      window.removeEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    };
  }, []);

  // Função para alterar o tamanho
  const handleTamanhoChange = (
    novoTamanho: "pequeno" | "medio" | "grande" | "muitoGrande"
  ) => {
    setTamanhoGlobal(novoTamanho);
    setTamanhoAtual(novoTamanho);
    setForceUpdate((prev) => prev + 1); // Força re-render
  };

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
    };

    if (menuAberto) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuAberto]);

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

      const matchesCategoria =
        !filtrosAtivos.categoria ||
        normalizeString(item.Categoria || "") ===
          normalizeString(filtrosAtivos.categoria);

      return (
        matchesArea &&
        matchesProjeto &&
        matchesSolicitante &&
        matchesPrioridade &&
        matchesStatus &&
        matchesGrupoSolicitante &&
        matchesCategoria
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
    const filtrosTemp = { ...filtros, status: "" as JiraStatus | "" };
    return aplicarFiltrosCascata(projetosData.rawData, filtrosTemp);
  }, [
    projetosData.rawData,
    filtros.area,
    filtros.projeto,
    filtros.solicitante,
    filtros.prioridade,
    filtros.grupo_solicitante,
  ]);

  const dadosParaCategoria = useMemo(() => {
    const filtrosTemp = { ...filtros, categoria: "" };
    return aplicarFiltrosCascata(projetosData.rawData, filtrosTemp);
  }, [
    projetosData.rawData,
    filtros.area,
    filtros.projeto,
    filtros.solicitante,
    filtros.prioridade,
    filtros.status,
    filtros.grupo_solicitante,
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
    const statusSet = new Set<JiraStatus>(
      dadosParaStatus.map((i: EspacoDeProjetos) => i.Status as JiraStatus)
    );
    // Retorna na ordem do Kanban e mapeia os nomes
    return COLUMN_ORDER.filter((status) => statusSet.has(status)).map(
      (status) => ({
        value: status,
        label: statusNameMap[status] || status,
      })
    );
  }, [dadosParaStatus]);

  const categoriaOptions = useMemo(
    () => [
      ...new Set(
        dadosParaCategoria
          .map((i: EspacoDeProjetos) => i.Categoria)
          .filter((value): value is string => Boolean(value))
      ),
    ],
    [dadosParaCategoria]
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
        novosFiltros.status = "" as JiraStatus | "";
        novosFiltros.grupo_solicitante = "";
        novosFiltros.categoria = "";
      } else if (campo === "projeto") {
        novosFiltros.solicitante = "";
        novosFiltros.prioridade = "";
        novosFiltros.status = "" as JiraStatus | "";
        novosFiltros.grupo_solicitante = "";
        novosFiltros.categoria = "";
      } else if (campo === "solicitante") {
        novosFiltros.prioridade = "";
        novosFiltros.status = "" as JiraStatus | "";
        novosFiltros.grupo_solicitante = "";
        novosFiltros.categoria = "";
      } else if (campo === "prioridade") {
        novosFiltros.status = "" as JiraStatus | "";
        novosFiltros.grupo_solicitante = "";
        novosFiltros.categoria = "";
      } else if (campo === "status") {
        novosFiltros.grupo_solicitante = "";
        novosFiltros.categoria = "";
      } else if (campo === "grupo_solicitante") {
        novosFiltros.categoria = "";
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
    <div className="p-6 w-full max-w-none relative">
      {/* Botões de Controle - Linha acima dos totalizadores */}
      <div className="flex items-center justify-end gap-2">
        {/* Dropdown de Tamanho */}
        <CustomDropdown
          options={tamanhoOptions}
          value={tamanhoAtual}
          onChange={(val) =>
            handleTamanhoChange(
              val as "pequeno" | "medio" | "grande" | "muitoGrande"
            )
          }
          buttonClassName={`relative h-10 px-4 text-left bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 shadow-md hover:shadow-lg transform hover:scale-105 ${fontSizes.textoBotao}`}
        />

        {/* Botão Toggle Filtros */}
        <button
          onClick={() => setFiltrosVisiveis(!filtrosVisiveis)}
          className={`flex items-center justify-center gap-2 h-10 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 shadow-md hover:shadow-lg transform hover:scale-105 ${fontSizes.textoBotao}`}
        >
          {filtrosVisiveis ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Ocultar
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filtros
            </>
          )}
        </button>
      </div>

      {/* Seção de Filtros */}
      <div
        className={`mb-6 transition-all duration-300 ease-in-out overflow-hidden ${
          filtrosVisiveis ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ zIndex: filtrosVisiveis ? 10 : 1 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {/* Filtro de Área */}
            <div className="flex flex-col">
              <label
                htmlFor="area-filter"
                className={`block mb-3 font-semibold text-gray-700 dark:text-gray-200 ${fontSizes.labelFiltro}`}
              >
                Área
              </label>
              <select
                id="area-filter"
                className={`bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md ${fontSizes.inputFiltro}`}
                value={filtros.area}
                onChange={(e) => handleFiltroChange("area", e.target.value)}
                style={{ height: undefined }}
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
            <div className="flex flex-col">
              <label
                htmlFor="projeto-filter"
                className={`block mb-3 font-semibold text-gray-700 dark:text-gray-200 ${fontSizes.labelFiltro}`}
              >
                Projeto
              </label>
              <select
                id="projeto-filter"
                className={`bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md ${fontSizes.inputFiltro}`}
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
            <div className="flex flex-col">
              <label
                htmlFor="status-filter"
                className={`block mb-3 font-semibold text-gray-700 dark:text-gray-200 ${fontSizes.labelFiltro}`}
              >
                Status
              </label>
              <select
                id="status-filter"
                className={`bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md ${fontSizes.inputFiltro}`}
                value={filtros.status}
                onChange={(e) => handleFiltroChange("status", e.target.value)}
              >
                <option value="">Todos</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Prioridade */}
            <div className="flex flex-col">
              <label
                htmlFor="prioridade-filter"
                className={`block mb-3 font-semibold text-gray-700 dark:text-gray-200 ${fontSizes.labelFiltro}`}
              >
                Prioridade
              </label>
              <select
                id="prioridade-filter"
                className={`bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md ${fontSizes.inputFiltro}`}
                value={filtros.prioridade}
                onChange={(e) =>
                  handleFiltroChange("prioridade", e.target.value)
                }
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
            <div className="flex flex-col">
              <label
                htmlFor="grupo-solicitante-filter"
                className={`block mb-3 font-semibold text-gray-700 dark:text-gray-200 ${fontSizes.labelFiltro}`}
              >
                Grupo Solicitante
              </label>
              <select
                id="grupo-solicitante-filter"
                value={filtros.grupo_solicitante}
                onChange={(e) =>
                  handleFiltroChange("grupo_solicitante", e.target.value)
                }
                className={`bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md ${fontSizes.inputFiltro}`}
              >
                <option value="">Todos os Grupos</option>
                {areaOptions.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Categoria */}
            <div className="flex flex-col">
              <label
                htmlFor="categoria-filter"
                className={`block mb-3 font-semibold text-gray-700 dark:text-gray-200 ${fontSizes.labelFiltro}`}
              >
                Categoria
              </label>
              <select
                id="categoria-filter"
                value={filtros.categoria}
                onChange={(e) =>
                  handleFiltroChange("categoria", e.target.value)
                }
                className={`bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md ${fontSizes.inputFiltro}`}
              >
                <option value="">Todas as Categorias</option>
                {categoriaOptions.map((categoria) => (
                  <option key={categoria} value={categoria || ""}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>

            {/* Botão Limpar Filtros */}
            <div className="flex flex-col justify-end">
              <button
                onClick={() =>
                  setFiltros({
                    area: "",
                    projeto: "",
                    solicitante: "",
                    prioridade: "",
                    status: "" as JiraStatus | "",
                    grupo_solicitante: "",
                    categoria: "",
                  })
                }
                className={`px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-300 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 h-12 ${fontSizes.textoBotao}`}
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Totalizadores */}
      <ProjetosTotalizadores filteredData={filteredData} />

      {/* Gráficos do dashboard */}
      {/* Primeira linha - 3 gráficos */}
      <div className="mb-6 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col h-72">
          <div
            className={`font-semibold text-gray-900 dark:text-white mb-2 text-left ${fontSizes.tituloGrafico}`}
          >
            Projetos por Área
          </div>
          <ProjetosBarPorArea
            data={filteredData}
            onAreaClick={(area) => handleFiltroChange("area", area)}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col h-72">
          <div
            className={`font-semibold text-gray-900 dark:text-white mb-2 text-left ${fontSizes.tituloGrafico}`}
          >
            Projetos por Prioridade
          </div>
          <ProjetosBarPorPrioridade
            data={filteredData}
            onPrioridadeClick={(prioridade) =>
              handleFiltroChange("prioridade", prioridade)
            }
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col h-72">
          <div
            className={`font-semibold text-gray-900 dark:text-white mb-2 text-left ${fontSizes.tituloGrafico}`}
          >
            Análise de Demandas por Categoria
          </div>
          <AnaliseDemandasPorCategoria
            data={filteredData}
            onCategoriaClick={(categoria) =>
              handleFiltroChange("categoria", categoria)
            }
          />
        </div>
      </div>

      {/* Segunda linha - 1 gráfico */}
      {/* <div className="mb-6 w-full grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <div
            className={`font-semibold text-gray-900 dark:text-white mb-2 text-left ${fontSizes.tituloGrafico}`}
          >
            Ideações por Tempo de Espera
          </div>
          <IdeacoesPorTempoDeEspera data={filteredData} />
        </div>
      </div> */}

      {/* Seção de Ideias Obsoletas */}
      <IdeiasObsoletas data={projetosData.rawData} />

      {/* Resultados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-1 relative">
        {/* Menu de três pontos flutuante */}
        <div className="absolute top-2 right-2 z-50" ref={menuRef}>
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Opções de visualização"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {menuAberto && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-600">
              <div className="py-1">
                <button
                  onClick={() => {
                    setVisualizacao("kanban");
                    setMenuAberto(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                    visualizacao === "kanban"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300"
                  } ${fontSizes.textoBotao}`}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Kanban
                  </div>
                </button>
                <button
                  onClick={() => {
                    setVisualizacao("tabela");
                    setMenuAberto(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                    visualizacao === "tabela"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300"
                  } ${fontSizes.textoBotao}`}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Tabela
                  </div>
                </button>
              </div>
            </div>
          )}
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

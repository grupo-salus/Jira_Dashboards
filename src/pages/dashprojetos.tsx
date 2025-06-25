/**
 * dashprojetos.tsx
 *
 * Este é o componente principal do dashboard de Espaço de Projetos que:
 * 1. Exibe totalizadores dos projetos
 * 2. Exibe 3 gráficos principais (área, prioridade, categoria)
 * 3. Gerencia filtros (área, prioridade, status, categoria)
 * 4. Renderiza visualização Kanban ou Tabela
 *
 * Componentes utilizados:
 * - ProjetosTotalizadores: Cards com totais
 * - ProjetosBarPorArea: Gráfico de barras por área
 * - ProjetosBarPorPrioridade: Gráfico de barras por prioridade
 * - AnaliseDemandasPorCategoria: Gráfico de pizza por categoria
 * - ProjetosTable: Exibe a tabela de projetos
 * - ProjetosKanban: Exibe o quadro de tarefas (Kanban)
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
import {
  getFontSizes,
  setTamanhoGlobal,
  getTamanhoGlobal,
} from "../constants/styleConfig";
import CustomDropdown from "../components/common/CustomDropdown";
import {
  themeColors,
  getTextColor,
  getBackgroundColor,
  getBorderColor,
} from "../utils/themeColors";

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
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);
  const [tamanhoAtual, setTamanhoAtual] = useState(getTamanhoGlobal());
  const [, setForceUpdate] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Filtros simplificados - apenas os essenciais
  const [filtros, setFiltros] = useState({
    area: "",
    prioridade: "",
    status: "" as JiraStatus | "",
    categoria: "",
  });

  // Obter configurações de fonte atuais
  const fontSizes = getFontSizes();

  // Hook para detectar o tema atual
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setCurrentTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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
      setForceUpdate((prev) => prev + 1);
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
    setForceUpdate((prev) => prev + 1);
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

  // Função para aplicar filtros
  const aplicarFiltros = (
    dados: EspacoDeProjetos[],
    filtrosAtivos: typeof filtros
  ) => {
    return dados.filter((item: EspacoDeProjetos) => {
      const matchesArea =
        !filtrosAtivos.area ||
        normalizeString(item["Departamento Solicitante"] || "") ===
          normalizeString(filtrosAtivos.area);

      const matchesPrioridade =
        !filtrosAtivos.prioridade ||
        normalizeString(item.Prioridade || "") ===
          normalizeString(filtrosAtivos.prioridade);

      const matchesStatus =
        !filtrosAtivos.status ||
        normalizeString(item.Status || "") ===
          normalizeString(filtrosAtivos.status);

      const matchesCategoria =
        !filtrosAtivos.categoria ||
        normalizeString(item.Categoria || "") ===
          normalizeString(filtrosAtivos.categoria);

      return (
        matchesArea && matchesPrioridade && matchesStatus && matchesCategoria
      );
    });
  };

  // Dados filtrados finais
  const filteredData = useMemo(() => {
    return aplicarFiltros(projetosData.rawData, filtros);
  }, [projetosData.rawData, filtros]);

  // Opções para dropdowns baseadas nos dados
  const areaOptions = useMemo(
    () => [
      ...new Set(
        projetosData.rawData
          .map((i: EspacoDeProjetos) => i["Departamento Solicitante"])
          .filter((value): value is string => Boolean(value))
      ),
    ],
    [projetosData.rawData]
  );

  const prioridadeOptions = useMemo(
    () => [
      ...new Set(
        projetosData.rawData
          .map((i: EspacoDeProjetos) => i.Prioridade)
          .filter((value): value is string => Boolean(value))
      ),
    ],
    [projetosData.rawData]
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
    const statusSet = new Set<JiraStatus>(
      projetosData.rawData.map((i: EspacoDeProjetos) => i.Status as JiraStatus)
    );
    return COLUMN_ORDER.filter((status) => statusSet.has(status)).map(
      (status) => ({
        value: status,
        label: statusNameMap[status] || status,
      })
    );
  }, [projetosData.rawData]);

  const categoriaOptions = useMemo(
    () => [
      ...new Set(
        projetosData.rawData
          .map((i: EspacoDeProjetos) => i.Categoria)
          .filter((value): value is string => Boolean(value))
      ),
    ],
    [projetosData.rawData]
  );

  // Função para alterar filtros
  const handleFiltroChange = (campo: keyof typeof filtros, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  if (projetosData.loading) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: getBackgroundColor("page", currentTheme) }}
      >
        <div
          className="text-xl"
          style={{ color: getTextColor("secondary", currentTheme) }}
        >
          Carregando dados dos projetos...
        </div>
      </div>
    );
  }

  if (projetosData.error) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: getBackgroundColor("page", currentTheme) }}
      >
        <div
          className="text-xl"
          style={{ color: getTextColor("error", currentTheme) }}
        >
          Erro ao carregar dados: {projetosData.error}
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-6 w-full max-w-none relative"
      style={{ backgroundColor: getBackgroundColor("page", currentTheme) }}
    >
      {/* Botões de Controle */}
      <div className="flex items-center justify-end gap-2 mb-4">
        {/* Dropdown de Tamanho */}
        <CustomDropdown
          options={tamanhoOptions}
          value={tamanhoAtual}
          onChange={(val) =>
            handleTamanhoChange(
              val as "pequeno" | "medio" | "grande" | "muitoGrande"
            )
          }
          buttonClassName={`relative h-10 px-4 text-left font-semibold rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105 ${fontSizes.textoBotao}`}
        />

        {/* Botão Toggle Filtros */}
        <button
          onClick={() => setFiltrosVisiveis(!filtrosVisiveis)}
          className={`flex items-center justify-center gap-2 h-10 px-4 font-semibold rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105 ${fontSizes.textoBotao}`}
          style={{
            background: themeColors.components.buttons.primary.bg[currentTheme],
            color: themeColors.components.buttons.primary.text,
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.background =
              themeColors.components.buttons.primary.hover[currentTheme];
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.background =
              themeColors.components.buttons.primary.bg[currentTheme];
          }}
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
        <div
          className="rounded-xl shadow-lg p-6"
          style={{
            backgroundColor: getBackgroundColor("card", currentTheme),
            border: `1px solid ${getBorderColor("primary", currentTheme)}`,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {/* Filtro de Área */}
            <div className="flex flex-col">
              <label
                htmlFor="area-filter"
                className={`block mb-3 font-semibold ${fontSizes.labelFiltro}`}
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Área
              </label>
              <select
                id="area-filter"
                className={`bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md ${fontSizes.inputFiltro}`}
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

            {/* Filtro de Status */}
            <div className="flex flex-col">
              <label
                htmlFor="status-filter"
                className={`block mb-3 font-semibold ${fontSizes.labelFiltro}`}
                style={{ color: getTextColor("primary", currentTheme) }}
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
                className={`block mb-3 font-semibold ${fontSizes.labelFiltro}`}
                style={{ color: getTextColor("primary", currentTheme) }}
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

            {/* Filtro de Categoria */}
            <div className="flex flex-col">
              <label
                htmlFor="categoria-filter"
                className={`block mb-3 font-semibold ${fontSizes.labelFiltro}`}
                style={{ color: getTextColor("primary", currentTheme) }}
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
          </div>
        </div>
      </div>

      {/* Totalizadores */}
      <ProjetosTotalizadores filteredData={filteredData} />

      {/* Gráficos do dashboard - 3 gráficos em linha */}
      <div className="mb-6 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gráfico 1: Projetos por Área */}
        <div
          className="rounded-lg shadow p-4 flex flex-col h-72 relative"
          style={{ backgroundColor: getBackgroundColor("card", currentTheme) }}
        >
          <div
            className={`font-semibold mb-2 text-left ${fontSizes.tituloGrafico}`}
            style={{ color: getTextColor("primary", currentTheme) }}
          >
            Projetos por Área
            {filtros.area && (
              <button
                onClick={() => handleFiltroChange("area", "")}
                className="absolute top-2 right-2 flex items-center gap-1 p-1 bg-transparent rounded-full transition-colors"
                style={{ color: themeColors.text.error[currentTheme] }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = getBackgroundColor(
                    "hover",
                    currentTheme
                  );
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title="Limpar filtro de área"
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: themeColors.text.error[currentTheme] }}
                >
                  Limpar filtro
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ color: themeColors.text.error[currentTheme] }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <ProjetosBarPorArea
            data={filteredData}
            onAreaClick={(area) => handleFiltroChange("area", area)}
          />
        </div>

        {/* Gráfico 2: Projetos por Prioridade */}
        <div
          className="rounded-lg shadow p-4 flex flex-col h-72 relative"
          style={{ backgroundColor: getBackgroundColor("card", currentTheme) }}
        >
          <div
            className={`font-semibold mb-2 text-left ${fontSizes.tituloGrafico}`}
            style={{ color: getTextColor("primary", currentTheme) }}
          >
            Projetos por Prioridade
            {filtros.prioridade && (
              <button
                onClick={() => handleFiltroChange("prioridade", "")}
                className="absolute top-2 right-2 flex items-center gap-1 p-1 bg-transparent rounded-full transition-colors"
                style={{ color: themeColors.text.error[currentTheme] }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = getBackgroundColor(
                    "hover",
                    currentTheme
                  );
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title="Limpar filtro de prioridade"
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: themeColors.text.error[currentTheme] }}
                >
                  Limpar filtro
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ color: themeColors.text.error[currentTheme] }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <ProjetosBarPorPrioridade
            data={filteredData}
            onPrioridadeClick={(prioridade) =>
              handleFiltroChange("prioridade", prioridade)
            }
          />
        </div>

        {/* Gráfico 3: Análise de Demandas por Categoria */}
        <div
          className="rounded-lg shadow p-4 flex flex-col h-72 relative"
          style={{ backgroundColor: getBackgroundColor("card", currentTheme) }}
        >
          <div
            className={`font-semibold mb-2 text-left ${fontSizes.tituloGrafico}`}
            style={{ color: getTextColor("primary", currentTheme) }}
          >
            Análise de Demandas por Categoria
            {filtros.categoria && (
              <button
                onClick={() => handleFiltroChange("categoria", "")}
                className="absolute top-2 right-2 flex items-center gap-1 p-1 bg-transparent rounded-full transition-colors"
                style={{ color: themeColors.text.error[currentTheme] }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = getBackgroundColor(
                    "hover",
                    currentTheme
                  );
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title="Limpar filtro de categoria"
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: themeColors.text.error[currentTheme] }}
                >
                  Limpar filtro
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ color: themeColors.text.error[currentTheme] }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <AnaliseDemandasPorCategoria
            data={filteredData}
            onCategoriaClick={(categoria) =>
              handleFiltroChange("categoria", categoria)
            }
          />
        </div>
      </div>

      {/* Controles de visualização */}
      <div className="flex justify-end mb-4" ref={menuRef}>
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="p-2 transition-colors rounded-lg"
          style={{ color: getTextColor("secondary", currentTheme) }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.color = getTextColor("primary", currentTheme);
            e.currentTarget.style.backgroundColor = getBackgroundColor(
              "hover",
              currentTheme
            );
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.color = getTextColor(
              "secondary",
              currentTheme
            );
            e.currentTarget.style.backgroundColor = "transparent";
          }}
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
          <div
            className="absolute mt-10 w-48 rounded-lg shadow-lg z-50"
            style={{
              backgroundColor: getBackgroundColor("card", currentTheme),
              border: `1px solid ${getBorderColor("primary", currentTheme)}`,
            }}
          >
            <div className="py-1">
              <button
                onClick={() => {
                  setVisualizacao("kanban");
                  setMenuAberto(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${fontSizes.textoBotao}`}
                style={{
                  color:
                    visualizacao === "kanban"
                      ? themeColors.text.info[currentTheme]
                      : getTextColor("primary", currentTheme),
                  backgroundColor:
                    visualizacao === "kanban"
                      ? themeColors.info[50]
                      : "transparent",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (visualizacao !== "kanban") {
                    e.currentTarget.style.backgroundColor = getBackgroundColor(
                      "hover",
                      currentTheme
                    );
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (visualizacao !== "kanban") {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
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
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${fontSizes.textoBotao}`}
                style={{
                  color:
                    visualizacao === "tabela"
                      ? themeColors.text.info[currentTheme]
                      : getTextColor("primary", currentTheme),
                  backgroundColor:
                    visualizacao === "tabela"
                      ? themeColors.info[50]
                      : "transparent",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (visualizacao !== "tabela") {
                    e.currentTarget.style.backgroundColor = getBackgroundColor(
                      "hover",
                      currentTheme
                    );
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (visualizacao !== "tabela") {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
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

      {/* Resultados - Kanban ou Tabela */}
      <div
        className="rounded-lg shadow p-1 relative"
        style={{ backgroundColor: getBackgroundColor("card", currentTheme) }}
      >
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

/**
 * dashprojetos.tsx
 *
 * Este é o componente principal do dashboard de Espaço de Projetos que:
 * 1. Exibe totalizadores dos projetos
 * 2. Exibe 3 gráficos principais (área, prioridade, squad)
 * 3. Gerencia filtros (área, prioridade, status, squad)
 * 4. Renderiza visualização Kanban ou Tabela
 *
 * Componentes utilizados:
 * - ProjetosTotalizadores: Cards com totais
 * - ProjetosBarPorArea: Gráfico de barras por área
 * - ProjetosBarPorPrioridade: Gráfico de barras por prioridade
 * - AnaliseDemandasPorSquad: Gráfico de pizza por squad
 * - ProjetosTable: Exibe a tabela de projetos
 * - ProjetosKanban: Exibe o quadro de tarefas (Kanban)
 */

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useJira } from "../context/JiraContext";
import { EspacoDeProjetos } from "../types/Typesjira";
import { ProjetosTable, ProjetosKanban } from "../components/DashProjetos";
import { getPriorityConfig } from "../utils/themeColors";
import {
  COLUMN_ORDER,
  normalizarStatus,
  normalizarStatusDisplay,
} from "../components/DashProjetos/kanbanUtils";
import ProjetosBarPorArea from "../components/DashProjetos/ProjetosBarPorArea";
import ProjetosBarPorPrioridade from "../components/DashProjetos/ProjetosBarPorPrioridade";
import ProjetosTotalizadores from "../components/DashProjetos/ProjetosTotalizadores";
import AnaliseDemandasPorSquad from "../components/DashProjetos/AnaliseDemandasPorSquad";
import { getFontSizes } from "../constants/styleConfig";
import {
  themeColors,
  getTextColor,
  getBackgroundColor,
  getBorderColor,
} from "../utils/themeColors";
import { DotsVerticalIcon } from "../components/icons/DashboardIcons";
import Select, { components as selectComponents } from "react-select";

// Mapeamento de nomes de status para exibição
const statusNameMap: Record<string, string> = {
  Backlog: "Ideação",
  "Em Andamento": "Em Desenvolvimento",
  "Em Homologação": "Em Homologação",
  "Operação Assistida": "Operação Assistida",
  Concluído: "Entregue",
};

const DashProjetos: React.FC = () => {
  const { projetosData } = useJira();
  const [visualizacao, setVisualizacao] = useState<"tabela" | "kanban">(
    "kanban"
  );
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Filtros simplificados - apenas os essenciais
  const [filtros, setFiltros] = useState({
    area: [] as string[],
    prioridade: [] as string[],
    status: [] as string[],
    squad: [] as string[],
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

  // Função para aplicar filtros
  const aplicarFiltros = (
    dados: EspacoDeProjetos[],
    filtrosAtivos: typeof filtros
  ) => {
    return dados.filter((item: EspacoDeProjetos) => {
      const matchesArea =
        filtrosAtivos.area.length === 0 ||
        filtrosAtivos.area.includes(item["Departamento Solicitante"] || "");

      const matchesPrioridade =
        filtrosAtivos.prioridade.length === 0 ||
        filtrosAtivos.prioridade.includes(item.Prioridade || "");

      const matchesStatus =
        filtrosAtivos.status.length === 0 ||
        filtrosAtivos.status.includes(
          normalizarStatusDisplay(item.Status || "")
        );

      const matchesSquad =
        filtrosAtivos.squad.length === 0 ||
        filtrosAtivos.squad.includes(item.Squad || "");

      return matchesArea && matchesPrioridade && matchesStatus && matchesSquad;
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
    // Normalizar os status que vêm do Jira para comparar com COLUMN_ORDER
    const statusSet = new Set<string>(
      projetosData.rawData.map((i: EspacoDeProjetos) =>
        normalizarStatusDisplay(i.Status || "")
      )
    );

    return COLUMN_ORDER.filter((status) => statusSet.has(status)).map(
      (status) => ({
        value: status,
        label: normalizarStatusDisplay(statusNameMap[status] || status),
      })
    );
  }, [projetosData.rawData]);

  const squadOptions = useMemo(
    () => [
      ...new Set(
        projetosData.rawData
          .map((i: EspacoDeProjetos) => i.Squad)
          .filter((value): value is string => Boolean(value))
      ),
    ],
    [projetosData.rawData]
  );

  // Opções para react-select
  const areaOptionsSelect = areaOptions.map((area) => ({
    value: area,
    label: area,
  }));

  const statusOptionsSelect = statusOptions.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const prioridadeOptionsSelect = prioridadeOptionsTraduzidas.map((prio) => ({
    value: prio.valor,
    label: prio.label,
  }));

  const squadOptionsSelect = squadOptions.map((squad) => ({
    value: squad,
    label: squad,
  }));

  // Componente customizado para o ClearIndicator
  const CustomClearIndicator = (props: any) => {
    return (
      <selectComponents.ClearIndicator {...props}>
        <svg height="20" width="20" viewBox="0 0 20 20">
          <path
            d="M14 6L6 14M6 6l8 8"
            stroke={themeColors.text.error[currentTheme]}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </selectComponents.ClearIndicator>
    );
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
      {/* Título do Dashboard */}
      <div className="mb-8">
        <h1
          className={fontSizes.tituloPagina}
          style={{ color: getTextColor("primary", currentTheme) }}
        >
          Status Report de Projetos
        </h1>
      </div>

      {/* Seção de Filtros - Sempre Visível */}
      <div className="mb-6">
        <div className="p-0 shadow-none">
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
              <Select
                inputId="area-filter"
                isMulti
                options={areaOptionsSelect}
                value={areaOptionsSelect.filter((opt) =>
                  filtros.area.includes(opt.value)
                )}
                onChange={(selected) =>
                  setFiltros((f) => ({
                    ...f,
                    area: selected ? selected.map((s: any) => s.value) : [],
                  }))
                }
                placeholder="Todas"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor:
                      currentTheme === "dark"
                        ? themeColors.background.card.dark
                        : themeColors.components.filtros.input.bg[currentTheme],
                    borderColor: base.isFocused
                      ? themeColors.components.filtros.input.focus[currentTheme]
                      : themeColors.components.filtros.input.border[
                          currentTheme
                        ],
                    color: getTextColor("primary", currentTheme),
                    minHeight: 40,
                    boxShadow: base.isFocused
                      ? `0 0 0 2px ${themeColors.components.filtros.input.focus[currentTheme]}`
                      : undefined,
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor:
                      currentTheme === "dark"
                        ? themeColors.secondary[800]
                        : themeColors.components.filtros.input.bg[currentTheme],
                    color: getTextColor("primary", currentTheme),
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: getTextColor("primary", currentTheme),
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: themeColors.text.error[currentTheme],
                    ":hover": {
                      backgroundColor:
                        currentTheme === "dark"
                          ? themeColors.error[700]
                          : themeColors.error[100],
                      color:
                        currentTheme === "dark"
                          ? themeColors.text.error.dark
                          : themeColors.text.error.light,
                    },
                  }),
                  option: (base) => ({
                    ...base,
                    backgroundColor: base.isSelected
                      ? currentTheme === "dark"
                        ? themeColors.components.buttons.primary.bg.dark
                        : themeColors.components.buttons.primary.bg.light
                      : base.isFocused
                      ? currentTheme === "dark"
                        ? themeColors.background.hover.dark
                        : themeColors.components.filtros.input.focus.light
                      : currentTheme === "dark"
                      ? themeColors.background.card.dark
                      : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor:
                      currentTheme === "dark"
                        ? themeColors.background.card.dark
                        : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: getTextColor("primary", currentTheme),
                  }),
                }}
                noOptionsMessage={() => "Sem opções"}
                components={{ ClearIndicator: CustomClearIndicator }}
              />
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
              <Select
                inputId="status-filter"
                isMulti
                options={statusOptionsSelect}
                value={statusOptionsSelect.filter((opt) =>
                  filtros.status.includes(opt.value)
                )}
                onChange={(selected) =>
                  setFiltros((f) => ({
                    ...f,
                    status: selected ? selected.map((s: any) => s.value) : [],
                  }))
                }
                placeholder="Todos"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor:
                      currentTheme === "dark"
                        ? themeColors.background.card.dark
                        : themeColors.components.filtros.input.bg[currentTheme],
                    borderColor: base.isFocused
                      ? themeColors.components.filtros.input.focus[currentTheme]
                      : themeColors.components.filtros.input.border[
                          currentTheme
                        ],
                    color: getTextColor("primary", currentTheme),
                    minHeight: 40,
                    boxShadow: base.isFocused
                      ? `0 0 0 2px ${themeColors.components.filtros.input.focus[currentTheme]}`
                      : undefined,
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor:
                      currentTheme === "dark"
                        ? themeColors.secondary[800]
                        : themeColors.components.filtros.input.bg[currentTheme],
                    color: getTextColor("primary", currentTheme),
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: getTextColor("primary", currentTheme),
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: themeColors.text.error[currentTheme],
                    ":hover": {
                      backgroundColor:
                        currentTheme === "dark"
                          ? themeColors.error[700]
                          : themeColors.error[100],
                      color:
                        currentTheme === "dark"
                          ? themeColors.text.error.dark
                          : themeColors.text.error.light,
                    },
                  }),
                  option: (base) => ({
                    ...base,
                    backgroundColor: base.isSelected
                      ? currentTheme === "dark"
                        ? themeColors.components.buttons.primary.bg.dark
                        : themeColors.components.buttons.primary.bg.light
                      : base.isFocused
                      ? currentTheme === "dark"
                        ? themeColors.background.hover.dark
                        : themeColors.components.filtros.input.focus.light
                      : currentTheme === "dark"
                      ? themeColors.background.card.dark
                      : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor:
                      currentTheme === "dark"
                        ? themeColors.background.card.dark
                        : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: getTextColor("primary", currentTheme),
                  }),
                }}
                noOptionsMessage={() => "Sem opções"}
                components={{ ClearIndicator: CustomClearIndicator }}
              />
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
              <Select
                inputId="prioridade-filter"
                isMulti
                options={prioridadeOptionsSelect}
                value={prioridadeOptionsSelect.filter((opt) =>
                  filtros.prioridade.includes(opt.value)
                )}
                onChange={(selected) =>
                  setFiltros((f) => ({
                    ...f,
                    prioridade: selected
                      ? selected.map((s: any) => s.value)
                      : [],
                  }))
                }
                placeholder="Todas"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor:
                      currentTheme === "dark"
                        ? themeColors.background.card.dark
                        : themeColors.components.filtros.input.bg[currentTheme],
                    borderColor: base.isFocused
                      ? themeColors.components.filtros.input.focus[currentTheme]
                      : themeColors.components.filtros.input.border[
                          currentTheme
                        ],
                    color: getTextColor("primary", currentTheme),
                    minHeight: 40,
                    boxShadow: base.isFocused
                      ? `0 0 0 2px ${themeColors.components.filtros.input.focus[currentTheme]}`
                      : undefined,
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor:
                      currentTheme === "dark"
                        ? themeColors.secondary[800]
                        : themeColors.components.filtros.input.bg[currentTheme],
                    color: getTextColor("primary", currentTheme),
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: getTextColor("primary", currentTheme),
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: themeColors.text.error[currentTheme],
                    ":hover": {
                      backgroundColor:
                        currentTheme === "dark"
                          ? themeColors.error[700]
                          : themeColors.error[100],
                      color:
                        currentTheme === "dark"
                          ? themeColors.text.error.dark
                          : themeColors.text.error.light,
                    },
                  }),
                  option: (base) => ({
                    ...base,
                    backgroundColor: base.isSelected
                      ? currentTheme === "dark"
                        ? themeColors.components.buttons.primary.bg.dark
                        : themeColors.components.buttons.primary.bg.light
                      : base.isFocused
                      ? currentTheme === "dark"
                        ? themeColors.background.hover.dark
                        : themeColors.components.filtros.input.focus.light
                      : currentTheme === "dark"
                      ? themeColors.background.card.dark
                      : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor:
                      currentTheme === "dark"
                        ? themeColors.background.card.dark
                        : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: getTextColor("primary", currentTheme),
                  }),
                }}
                noOptionsMessage={() => "Sem opções"}
                components={{ ClearIndicator: CustomClearIndicator }}
              />
            </div>

            {/* Filtro de Squad */}
            <div className="flex flex-col">
              <label
                htmlFor="squad-filter"
                className={`block mb-3 font-semibold ${fontSizes.labelFiltro}`}
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Squad
              </label>
              <Select
                inputId="squad-filter"
                isMulti
                options={squadOptionsSelect}
                value={squadOptionsSelect.filter((opt) =>
                  filtros.squad.includes(opt.value)
                )}
                onChange={(selected) =>
                  setFiltros((f) => ({
                    ...f,
                    squad: selected ? selected.map((s: any) => s.value) : [],
                  }))
                }
                placeholder="Todas as Squads"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor:
                      currentTheme === "dark"
                        ? themeColors.background.card.dark
                        : themeColors.components.filtros.input.bg[currentTheme],
                    borderColor: base.isFocused
                      ? themeColors.components.filtros.input.focus[currentTheme]
                      : themeColors.components.filtros.input.border[
                          currentTheme
                        ],
                    color: getTextColor("primary", currentTheme),
                    minHeight: 40,
                    boxShadow: base.isFocused
                      ? `0 0 0 2px ${themeColors.components.filtros.input.focus[currentTheme]}`
                      : undefined,
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor:
                      currentTheme === "dark"
                        ? themeColors.secondary[800]
                        : themeColors.components.filtros.input.bg[currentTheme],
                    color: getTextColor("primary", currentTheme),
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: getTextColor("primary", currentTheme),
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: themeColors.text.error[currentTheme],
                    ":hover": {
                      backgroundColor:
                        currentTheme === "dark"
                          ? themeColors.error[700]
                          : themeColors.error[100],
                      color:
                        currentTheme === "dark"
                          ? themeColors.text.error.dark
                          : themeColors.text.error.light,
                    },
                  }),
                  option: (base) => ({
                    ...base,
                    backgroundColor: base.isSelected
                      ? currentTheme === "dark"
                        ? themeColors.components.buttons.primary.bg.dark
                        : themeColors.components.buttons.primary.bg.light
                      : base.isFocused
                      ? currentTheme === "dark"
                        ? themeColors.background.hover.dark
                        : themeColors.components.filtros.input.focus.light
                      : currentTheme === "dark"
                      ? themeColors.background.card.dark
                      : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor:
                      currentTheme === "dark"
                        ? themeColors.background.card.dark
                        : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: getTextColor("primary", currentTheme),
                  }),
                }}
                noOptionsMessage={() => "Sem opções"}
                components={{ ClearIndicator: CustomClearIndicator }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Totalizadores */}
      <ProjetosTotalizadores
        filteredData={filteredData}
        originalData={projetosData.rawData}
      />

      {/* Gráficos do dashboard - 3 gráficos em linha */}
      <div className="mb-6 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gráfico 1: Projetos por Área */}
        <div
          className="rounded-lg shadow p-4 flex flex-col min-h-72 relative"
          style={{ backgroundColor: getBackgroundColor("card", currentTheme) }}
        >
          <div
            className={`font-semibold mb-2 text-left ${fontSizes.tituloGrafico}`}
            style={{ color: getTextColor("primary", currentTheme) }}
          >
            Projetos por Área
            {filtros.area.length > 0 && (
              <button
                onClick={() => setFiltros((f) => ({ ...f, area: [] }))}
                className="absolute top-2 right-2 flex items-center gap-1 p-1 bg-transparent rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                style={{ color: themeColors.text.error[currentTheme] }}
                title="Limpar filtro de área"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M3 5h18l-7 9v5l-4 2v-7l-7-9z"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xs font-semibold">Limpar filtros</span>
              </button>
            )}
          </div>
          <ProjetosBarPorArea
            data={filteredData}
            onAreaClick={(area) => setFiltros((f) => ({ ...f, area: [area] }))}
          />
        </div>

        {/* Gráfico 2: Prioridade dos Projetos */}
        <div
          className="rounded-lg shadow p-4 flex flex-col min-h-72 relative"
          style={{ backgroundColor: getBackgroundColor("card", currentTheme) }}
        >
          <div
            className={`font-semibold mb-2 text-left ${fontSizes.tituloGrafico}`}
            style={{ color: getTextColor("primary", currentTheme) }}
          >
            Prioridade dos Projetos
            {filtros.prioridade.length > 0 && (
              <button
                onClick={() => setFiltros((f) => ({ ...f, prioridade: [] }))}
                className="absolute top-2 right-2 flex items-center gap-1 p-1 bg-transparent rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                style={{ color: themeColors.text.error[currentTheme] }}
                title="Limpar filtro de prioridade"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M3 5h18l-7 9v5l-4 2v-7l-7-9z"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xs font-semibold">Limpar filtros</span>
              </button>
            )}
          </div>
          <ProjetosBarPorPrioridade
            data={filteredData}
            onPrioridadeClick={(prioridade) =>
              setFiltros((f) => ({ ...f, prioridade: [prioridade] }))
            }
          />
        </div>

        {/* Gráfico 3: Distribuição por Squad */}
        <div
          className="rounded-lg shadow p-4 flex flex-col min-h-72 relative"
          style={{ backgroundColor: getBackgroundColor("card", currentTheme) }}
        >
          <div
            className={`font-semibold mb-2 text-left ${fontSizes.tituloGrafico}`}
            style={{ color: getTextColor("primary", currentTheme) }}
          >
            Distribuição por Squad
            {filtros.squad.length > 0 && (
              <button
                onClick={() => setFiltros((f) => ({ ...f, squad: [] }))}
                className="absolute top-2 right-2 flex items-center gap-1 p-1 bg-transparent rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                style={{ color: themeColors.text.error[currentTheme] }}
                title="Limpar filtro de squad"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M3 5h18l-7 9v5l-4 2v-7l-7-9z"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xs font-semibold">Limpar filtros</span>
              </button>
            )}
          </div>
          <AnaliseDemandasPorSquad
            data={filteredData}
            onSquadClick={(squad) =>
              setFiltros((f) => ({ ...f, squad: [squad] }))
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
          <DotsVerticalIcon className="w-5 h-5" />
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

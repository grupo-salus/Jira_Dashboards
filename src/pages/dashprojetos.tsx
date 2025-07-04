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
import {
  DotsVerticalIcon,
  FilterIcon,
} from "../components/icons/DashboardIcons";
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
  const { projetosData, opcoesDepartamentoSolicitante } = useJira();
  const [visualizacao, setVisualizacao] = useState<"tabela" | "kanban">(
    "kanban"
  );
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Estado inicial dos filtros
  const filtrosIniciais = {
    area: [] as string[],
    prioridade: [] as string[],
    status: [] as string[],
    squad: [] as string[],
    grupoSolicitante: [] as string[],
    statusPrazo: [] as string[],
    mesEntrega: "" as string,
    dataRapida: "" as string,
    filtroData: {
      campo: "" as string,
      operador: "" as string,
      valor1: "" as string,
      valor2: "" as string,
      opcaoRapida: "" as string,
    },
  };

  // Filtros expandidos com sistema de data avançado
  const [filtros, setFiltros] = useState(filtrosIniciais);

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

  // =====================
  // FUNÇÕES DE DATA
  // =====================

  /**
   * Normaliza uma data para o horário local (zera horas, minutos, segundos)
   */
  const normalizarData = (data: Date): Date => {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
  };

  /**
   * Converte string do input (yyyy-MM-dd ou dd/MM/yyyy) para Date local
   */
  const parseInputDate = (input: string): Date => {
    if (!input) return new Date("");
    if (input.includes("-")) {
      const [year, month, day] = input.split("-").map(Number);
      return new Date(year, month - 1, day);
    } else if (input.includes("/")) {
      const [day, month, year] = input.split("/").map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(input);
  };

  /**
   * Aplica operadores de comparação de data para filtros avançados e rápidos
   */
  const aplicarOperadorData = (
    dataItem: Date,
    operador: string,
    valor1: string,
    valor2: string,
    opcaoRapida: string
  ): boolean => {
    const hoje = new Date();
    const dataItemNormalizada = normalizarData(dataItem);

    // Filtros rápidos (opções pré-definidas)
    if (opcaoRapida) {
      switch (opcaoRapida) {
        case "hoje":
          return (
            dataItemNormalizada.getTime() === normalizarData(hoje).getTime()
          );
        case "ultimos_7_dias":
          return (
            dataItemNormalizada >=
            normalizarData(new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000))
          );
        case "ultimos_30_dias":
          return (
            dataItemNormalizada >=
            normalizarData(new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000))
          );
        case "mes_atual":
          return (
            dataItemNormalizada >=
            new Date(hoje.getFullYear(), hoje.getMonth(), 1)
          );
        case "trimestre_atual":
          const trimestre = Math.floor(hoje.getMonth() / 3);
          return (
            dataItemNormalizada >=
            new Date(hoje.getFullYear(), trimestre * 3, 1)
          );
        case "ano_atual":
          return dataItemNormalizada >= new Date(hoje.getFullYear(), 0, 1);
        case "semana_atual":
          return (
            dataItemNormalizada >=
            normalizarData(
              new Date(hoje.getTime() - hoje.getDay() * 24 * 60 * 60 * 1000)
            )
          );
        case "proximos_7_dias":
          return (
            dataItemNormalizada <=
              normalizarData(
                new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000)
              ) && dataItemNormalizada >= normalizarData(hoje)
          );
        case "proximos_30_dias":
          return (
            dataItemNormalizada <=
              normalizarData(
                new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000)
              ) && dataItemNormalizada >= normalizarData(hoje)
          );
        default:
          return true;
      }
    }

    // Filtros avançados (valores personalizados)
    if (valor1) {
      const dataValor1 = normalizarData(parseInputDate(valor1));
      const dataValor2 = valor2 ? normalizarData(parseInputDate(valor2)) : null;
      switch (operador) {
        case "maior_que":
          return dataItemNormalizada > dataValor1;
        case "maior_igual":
          return dataItemNormalizada >= dataValor1;
        case "menor_que":
          return dataItemNormalizada < dataValor1;
        case "menor_igual":
          return dataItemNormalizada <= dataValor1;
        case "igual":
          return dataItemNormalizada.getTime() === dataValor1.getTime();
        case "entre":
          return dataValor2
            ? dataItemNormalizada >= dataValor1 &&
                dataItemNormalizada <= dataValor2
            : false;
        case "nao_igual":
          return dataItemNormalizada.getTime() !== dataValor1.getTime();
        default:
          return true;
      }
    }
    return true;
  };

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

      const matchesGrupoSolicitante =
        filtrosAtivos.grupoSolicitante.length === 0 ||
        filtrosAtivos.grupoSolicitante.includes(
          item["Grupo Solicitante"] || ""
        );

      const matchesStatusPrazo =
        filtrosAtivos.statusPrazo.length === 0 ||
        filtrosAtivos.statusPrazo.includes(item["Status de prazo"] || "");

      // Filtro por mês de entrega
      let matchesMesEntrega = true;
      if (filtrosAtivos.mesEntrega) {
        const dataFimConcluido = item["Data: Fim Concluído"];
        if (dataFimConcluido) {
          const data = new Date(dataFimConcluido);
          const mes = data.getMonth(); // 0-11 (janeiro = 0, dezembro = 11)
          const mesSelecionado = parseInt(filtrosAtivos.mesEntrega);
          matchesMesEntrega = mes === mesSelecionado;
        } else {
          matchesMesEntrega = false; // Se não tem data de fim concluído, não corresponde
        }
      }

      // Filtro de data rápida (por data de criação)
      let matchesDataRapida = true;
      if (
        filtrosAtivos.dataRapida &&
        filtrosAtivos.dataRapida !== "filtro_avancado"
      ) {
        const dataCriacao = normalizarData(
          new Date(item["Data de criação"] || 0)
        );
        const hoje = new Date();

        switch (filtrosAtivos.dataRapida) {
          case "hoje":
            const hojeNormalizado = normalizarData(hoje);
            matchesDataRapida =
              dataCriacao.getTime() === hojeNormalizado.getTime();
            break;
          case "ultimos_7_dias":
            const dataLimite7 = normalizarData(
              new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000)
            );
            matchesDataRapida = dataCriacao >= dataLimite7;
            break;
          case "ultimos_30_dias":
            const dataLimite30 = normalizarData(
              new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000)
            );
            matchesDataRapida = dataCriacao >= dataLimite30;
            break;
          case "mes_atual":
            const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            matchesDataRapida = dataCriacao >= inicioMes;
            break;
          case "trimestre_atual":
            const trimestre = Math.floor(hoje.getMonth() / 3);
            const inicioTrimestre = new Date(
              hoje.getFullYear(),
              trimestre * 3,
              1
            );
            matchesDataRapida = dataCriacao >= inicioTrimestre;
            break;
          case "ano_atual":
            const inicioAno = new Date(hoje.getFullYear(), 0, 1);
            matchesDataRapida = dataCriacao >= inicioAno;
            break;
          case "semana_atual":
            const inicioSemana = normalizarData(
              new Date(hoje.getTime() - hoje.getDay() * 24 * 60 * 60 * 1000)
            );
            matchesDataRapida = dataCriacao >= inicioSemana;
            break;
          case "proximos_7_dias":
            const proximos7 = normalizarData(
              new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000)
            );
            const hojeNormalizadoProximos7 = normalizarData(hoje);
            matchesDataRapida =
              dataCriacao <= proximos7 &&
              dataCriacao >= hojeNormalizadoProximos7;
            break;
          case "proximos_30_dias":
            const proximos30 = normalizarData(
              new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000)
            );
            const hojeNormalizadoProximos30 = normalizarData(hoje);
            matchesDataRapida =
              dataCriacao <= proximos30 &&
              dataCriacao >= hojeNormalizadoProximos30;
            break;
        }
      }

      // Filtro de data avançado
      let matchesData = true;
      if (filtrosAtivos.filtroData.campo && filtrosAtivos.filtroData.operador) {
        const dataItem = getDataValue(item, filtrosAtivos.filtroData.campo);
        if (dataItem) {
          matchesData = aplicarOperadorData(
            dataItem,
            filtrosAtivos.filtroData.operador,
            filtrosAtivos.filtroData.valor1,
            filtrosAtivos.filtroData.valor2,
            filtrosAtivos.filtroData.opcaoRapida
          );
        }
      }

      return (
        matchesArea &&
        matchesPrioridade &&
        matchesStatus &&
        matchesSquad &&
        matchesGrupoSolicitante &&
        matchesStatusPrazo &&
        matchesMesEntrega &&
        matchesDataRapida &&
        matchesData
      );
    });
  };

  // Função para obter o valor da data baseado no campo selecionado
  const getDataValue = (item: EspacoDeProjetos, campo: string): Date | null => {
    switch (campo) {
      case "dataCriacao":
        return new Date(item["Data de criação"] || 0);
      case "dataAtualizacao":
        return new Date(item["Data de atualização"] || 0);
      case "targetStart":
        return item["Target start"] ? new Date(item["Target start"]) : null;
      case "targetEnd":
        return item["Target end"] ? new Date(item["Target end"]) : null;
      case "dataTermino":
        return item["Data de término"]
          ? new Date(item["Data de término"])
          : null;
      default:
        return null;
    }
  };

  // Dados filtrados finais
  const filteredData = useMemo(() => {
    return aplicarFiltros(projetosData.rawData, filtros);
  }, [projetosData.rawData, filtros]);

  // Opções para dropdowns baseadas nos dados
  const areaOptions = useMemo(() => {
    // Usar as opções do campo customizado se disponíveis, senão usar os dados dos projetos
    if (opcoesDepartamentoSolicitante.options.length > 0) {
      return opcoesDepartamentoSolicitante.options;
    }

    // Fallback para os dados dos projetos (caso as opções do campo customizado não estejam disponíveis)
    return [
      ...new Set(
        projetosData.rawData.map(
          (i: EspacoDeProjetos) => i["Departamento Solicitante"]
        )
      ),
    ];
  }, [opcoesDepartamentoSolicitante.options, projetosData.rawData]);
  const areaHasEmpty = projetosData.rawData.some(
    (i: EspacoDeProjetos) => !i["Departamento Solicitante"]
  );
  const areaOptionsSelect = [
    ...(areaHasEmpty
      ? [
          {
            value: "",
            label: (
              <span style={{ color: "#dc2626", fontWeight: 600 }}>
                Não informado
              </span>
            ),
          },
        ]
      : []),
    ...areaOptions
      .filter((area): area is string => Boolean(area))
      .map((area) => ({ value: area, label: area })),
  ];

  const prioridadeOptions = useMemo(
    () => [
      ...new Set(
        projetosData.rawData.map((i: EspacoDeProjetos) => i.Prioridade)
      ),
    ],
    [projetosData.rawData]
  );
  const prioridadeHasEmpty = projetosData.rawData.some(
    (i: EspacoDeProjetos) => !i.Prioridade
  );
  const prioridadeOptionsTraduzidas = prioridadeOptions
    .filter((prioridade): prioridade is string => Boolean(prioridade))
    .map((prioridade) => ({
      valor: prioridade,
      label: getPriorityConfig(prioridade).label,
    }));
  const prioridadeOptionsSelect = [
    ...(prioridadeHasEmpty
      ? [
          {
            value: "",
            label: (
              <span style={{ color: "#dc2626", fontWeight: 600 }}>
                Não informado
              </span>
            ),
          },
        ]
      : []),
    ...prioridadeOptionsTraduzidas.map((prio) => ({
      value: prio.valor,
      label: prio.label,
    })),
  ];

  const statusOptions = useMemo(() => {
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
  const statusHasEmpty = projetosData.rawData.some(
    (i: EspacoDeProjetos) => !i.Status
  );
  const statusOptionsSelect = [
    ...(statusHasEmpty
      ? [
          {
            value: "",
            label: (
              <span style={{ color: "#dc2626", fontWeight: 600 }}>
                Não informado
              </span>
            ),
          },
        ]
      : []),
    ...statusOptions.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ];

  const squadOptions = useMemo(
    () => [
      ...new Set(projetosData.rawData.map((i: EspacoDeProjetos) => i.Squad)),
    ],
    [projetosData.rawData]
  );
  const squadHasEmpty = projetosData.rawData.some(
    (i: EspacoDeProjetos) => !i.Squad
  );
  const squadOptionsSelect = [
    ...(squadHasEmpty
      ? [
          {
            value: "",
            label: (
              <span style={{ color: "#dc2626", fontWeight: 600 }}>
                Não informado
              </span>
            ),
          },
        ]
      : []),
    ...squadOptions
      .filter((squad): squad is string => Boolean(squad))
      .map((squad) => ({ value: squad, label: squad })),
  ];

  const grupoSolicitanteOptions = useMemo(
    () => [
      ...new Set(
        projetosData.rawData.map(
          (i: EspacoDeProjetos) => i["Grupo Solicitante"]
        )
      ),
    ],
    [projetosData.rawData]
  );
  const grupoSolicitanteHasEmpty = projetosData.rawData.some(
    (i: EspacoDeProjetos) => !i["Grupo Solicitante"]
  );
  const grupoSolicitanteOptionsSelect = [
    ...(grupoSolicitanteHasEmpty
      ? [
          {
            value: "",
            label: (
              <span style={{ color: "#dc2626", fontWeight: 600 }}>
                Não informado
              </span>
            ),
          },
        ]
      : []),
    ...grupoSolicitanteOptions
      .filter((grupo): grupo is string => Boolean(grupo))
      .map((grupo) => ({ value: grupo, label: grupo })),
  ];

  // Opções para filtro de data avançado
  const camposDataOptions = [
    { value: "", label: "Selecione um campo" },
    { value: "dataCriacao", label: "Data de Criação" },
    { value: "dataAtualizacao", label: "Data de Atualização" },
    { value: "targetStart", label: "Target Start (Início Planejado)" },
    { value: "targetEnd", label: "Target End (Fim Planejado)" },
    { value: "dataTermino", label: "Data de Término" },
  ];

  const operadoresDataOptions = [
    { value: "", label: "Selecione um operador" },
    { value: "maior_que", label: "Maior que" },
    { value: "maior_igual", label: "Maior ou igual" },
    { value: "menor_que", label: "Menor que" },
    { value: "menor_igual", label: "Menor ou igual" },
    { value: "igual", label: "Igual" },
    { value: "nao_igual", label: "Diferente" },
    { value: "entre", label: "Entre" },
  ];

  const opcoesRapidasDataOptions = [
    { value: "", label: "Todos os períodos" },
    { value: "hoje", label: "Hoje" },
    { value: "ultimos_7_dias", label: "Últimos 7 dias" },
    { value: "ultimos_30_dias", label: "Últimos 30 dias" },
    { value: "semana_atual", label: "Semana atual" },
    { value: "mes_atual", label: "Mês atual" },
    { value: "trimestre_atual", label: "Trimestre atual" },
    { value: "ano_atual", label: "Ano atual" },
    { value: "filtro_avancado", label: "Filtro Avançado" },
  ];

  // Opções para filtro de mês de entrega
  const opcoesMesEntrega = [
    { value: "", label: "Todos os meses" },
    { value: "0", label: "Janeiro" },
    { value: "1", label: "Fevereiro" },
    { value: "2", label: "Março" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Maio" },
    { value: "5", label: "Junho" },
    { value: "6", label: "Julho" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Setembro" },
    { value: "9", label: "Outubro" },
    { value: "10", label: "Novembro" },
    { value: "11", label: "Dezembro" },
  ];

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
      className="p-6 pt-2 w-full max-w-none relative"
      style={{ backgroundColor: getBackgroundColor("page", currentTheme) }}
    >
      {/* Container de Filtros com botão Limpar acima, sempre reservando espaço */}
      <div className="mb-20">
        <div className="flex justify-end w-full mt-0 mb-4">
          {JSON.stringify(filtros) !== JSON.stringify(filtrosIniciais) ? (
            <button
              onClick={() => setFiltros(filtrosIniciais)}
              className="flex items-center gap-1 p-1 bg-transparent rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent font-semibold text-xs ml-4"
              style={{ color: themeColors.text.error[currentTheme] }}
              title="Limpar todos os filtros"
            >
              <FilterIcon size={16} />
              <span className="font-semibold">Limpar filtros</span>
            </button>
          ) : (
            <button
              className="flex items-center gap-1 p-1 bg-transparent rounded-full border border-transparent font-semibold text-xs ml-4 opacity-0 select-none pointer-events-none"
              tabIndex={-1}
              aria-hidden="true"
            >
              <FilterIcon size={16} />
              <span className="font-semibold">Limpar filtros</span>
            </button>
          )}
        </div>
        <div className="p-0 shadow-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-7 w-full">
            {/* Filtro de Área */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="area-filter"
                className={`block mb-3 font-semibold ${fontSizes.labelFiltro}`}
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Área
                {opcoesDepartamentoSolicitante.loading && (
                  <span
                    className="ml-2 text-sm font-normal"
                    style={{ color: getTextColor("secondary", currentTheme) }}
                  >
                    (carregando...)
                  </span>
                )}
                {opcoesDepartamentoSolicitante.error && (
                  <span
                    className="ml-2 text-sm font-normal"
                    style={{ color: themeColors.text.error[currentTheme] }}
                  >
                    (erro ao carregar)
                  </span>
                )}
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
                placeholder={
                  opcoesDepartamentoSolicitante.loading
                    ? "Carregando..."
                    : "Todas"
                }
                isDisabled={opcoesDepartamentoSolicitante.loading}
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
                    minWidth: 0,
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
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? currentTheme === "dark"
                        ? themeColors.components.buttons.primary.bg.dark
                        : themeColors.components.buttons.primary.bg.light
                      : state.isFocused
                      ? currentTheme === "dark"
                        ? themeColors.background.hover.dark
                        : themeColors.background.hover.light
                      : currentTheme === "dark"
                      ? themeColors.background.card.dark
                      : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                    cursor: "pointer",
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
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 160,
                  }),
                }}
                noOptionsMessage={() => "Sem opções"}
                components={{ ClearIndicator: CustomClearIndicator }}
                closeMenuOnScroll={true}
              />
            </div>

            {/* Filtro de Status */}
            <div className="flex flex-col min-w-0">
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
                    minWidth: 0,
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
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? currentTheme === "dark"
                        ? themeColors.components.buttons.primary.bg.dark
                        : themeColors.components.buttons.primary.bg.light
                      : state.isFocused
                      ? currentTheme === "dark"
                        ? themeColors.background.hover.dark
                        : themeColors.background.hover.light
                      : currentTheme === "dark"
                      ? themeColors.background.card.dark
                      : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                    cursor: "pointer",
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
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 160,
                  }),
                }}
                noOptionsMessage={() => "Sem opções"}
                components={{ ClearIndicator: CustomClearIndicator }}
                closeMenuOnScroll={true}
              />
            </div>

            {/* Filtro de Prioridade */}
            <div className="flex flex-col min-w-0">
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
                    minWidth: 0,
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
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? currentTheme === "dark"
                        ? themeColors.components.buttons.primary.bg.dark
                        : themeColors.components.buttons.primary.bg.light
                      : state.isFocused
                      ? currentTheme === "dark"
                        ? themeColors.background.hover.dark
                        : themeColors.background.hover.light
                      : currentTheme === "dark"
                      ? themeColors.background.card.dark
                      : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                    cursor: "pointer",
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
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 160,
                  }),
                }}
                noOptionsMessage={() => "Sem opções"}
                components={{ ClearIndicator: CustomClearIndicator }}
                closeMenuOnScroll={true}
              />
            </div>

            {/* Filtro de Squad */}
            <div className="flex flex-col min-w-0">
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
                    minWidth: 0,
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
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? currentTheme === "dark"
                        ? themeColors.components.buttons.primary.bg.dark
                        : themeColors.components.buttons.primary.bg.light
                      : state.isFocused
                      ? currentTheme === "dark"
                        ? themeColors.background.hover.dark
                        : themeColors.background.hover.light
                      : currentTheme === "dark"
                      ? themeColors.background.card.dark
                      : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                    cursor: "pointer",
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
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 160,
                  }),
                }}
                noOptionsMessage={() => "Sem opções"}
                components={{ ClearIndicator: CustomClearIndicator }}
                closeMenuOnScroll={true}
              />
            </div>

            {/* Filtro de Grupo Solicitante */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="grupo-solicitante-filter"
                className={`block mb-3 font-semibold ${fontSizes.labelFiltro}`}
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Grupo Solicitante
              </label>
              <Select
                inputId="grupo-solicitante-filter"
                isMulti
                options={grupoSolicitanteOptionsSelect}
                value={grupoSolicitanteOptionsSelect.filter((opt) =>
                  filtros.grupoSolicitante.includes(opt.value)
                )}
                onChange={(selected) =>
                  setFiltros((f) => ({
                    ...f,
                    grupoSolicitante: selected
                      ? selected.map((s: any) => s.value)
                      : [],
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
                    minWidth: 0,
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
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? currentTheme === "dark"
                        ? themeColors.components.buttons.primary.bg.dark
                        : themeColors.components.buttons.primary.bg.light
                      : state.isFocused
                      ? currentTheme === "dark"
                        ? themeColors.background.hover.dark
                        : themeColors.background.hover.light
                      : currentTheme === "dark"
                      ? themeColors.background.card.dark
                      : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                    cursor: "pointer",
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
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 160,
                  }),
                }}
                noOptionsMessage={() => "Sem opções"}
                components={{ ClearIndicator: CustomClearIndicator }}
                closeMenuOnScroll={true}
              />
            </div>

            {/* Filtro de Mês de Entrega */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="mes-entrega-filter"
                className={`block mb-3 font-semibold ${fontSizes.labelFiltro}`}
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Mês de Entrega
              </label>
              <Select
                inputId="mes-entrega-filter"
                isClearable={true}
                options={opcoesMesEntrega}
                value={
                  filtros.mesEntrega
                    ? opcoesMesEntrega.find(
                        (opt) => opt.value === filtros.mesEntrega
                      )
                    : null
                }
                onChange={(selected) =>
                  setFiltros((f) => ({
                    ...f,
                    mesEntrega: selected ? selected.value : "",
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
                    minWidth: 0,
                  }),
                  clearIndicator: (base) => ({
                    ...base,
                    color: themeColors.text.error[currentTheme],
                    ":hover": {
                      color: themeColors.text.error[currentTheme],
                    },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? currentTheme === "dark"
                        ? themeColors.components.buttons.primary.bg.dark
                        : themeColors.components.buttons.primary.bg.light
                      : state.isFocused
                      ? currentTheme === "dark"
                        ? themeColors.background.hover.dark
                        : themeColors.background.hover.light
                      : currentTheme === "dark"
                      ? themeColors.background.card.dark
                      : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                    cursor: "pointer",
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
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 160,
                  }),
                }}
                noOptionsMessage={() => "Sem opções"}
                components={{ ClearIndicator: CustomClearIndicator }}
                closeMenuOnScroll={true}
              />
            </div>

            {/* Filtro de Data Rápida */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="data-rapida-filter"
                className={`block mb-3 font-semibold ${fontSizes.labelFiltro}`}
                style={{ color: getTextColor("primary", currentTheme) }}
              >
                Período (Data de Criação)
              </label>
              <Select
                inputId="data-rapida-filter"
                isClearable={true}
                options={opcoesRapidasDataOptions}
                value={
                  filtros.dataRapida
                    ? opcoesRapidasDataOptions.find(
                        (opt) => opt.value === filtros.dataRapida
                      )
                    : null
                }
                onChange={(selected) =>
                  setFiltros((f) => ({
                    ...f,
                    dataRapida: selected ? selected.value : "",
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
                    minWidth: 0,
                  }),
                  clearIndicator: (base) => ({
                    ...base,
                    color: themeColors.text.error[currentTheme],
                    ":hover": {
                      color: themeColors.text.error[currentTheme],
                    },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? currentTheme === "dark"
                        ? themeColors.components.buttons.primary.bg.dark
                        : themeColors.components.buttons.primary.bg.light
                      : state.isFocused
                      ? currentTheme === "dark"
                        ? themeColors.background.hover.dark
                        : themeColors.background.hover.light
                      : currentTheme === "dark"
                      ? themeColors.background.card.dark
                      : themeColors.components.filtros.input.bg.light,
                    color: getTextColor("primary", currentTheme),
                    cursor: "pointer",
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
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 160,
                  }),
                }}
                noOptionsMessage={() => "Sem opções"}
                components={{ ClearIndicator: CustomClearIndicator }}
                closeMenuOnScroll={true}
              />
            </div>
          </div>
        </div>

        {/* Filtros de Data Avançada - Aparecem quando "Filtro Avançado" é selecionado */}
        {filtros.dataRapida === "filtro_avancado" && (
          <div className="mt-6">
            <div className="p-0 shadow-none">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6 w-full">
                {/* Campo de Data */}
                <div className="flex flex-col min-w-0">
                  <label
                    htmlFor="campo-data-filter"
                    className={`block mb-3 font-semibold ${fontSizes.labelFiltro}`}
                    style={{ color: getTextColor("primary", currentTheme) }}
                  >
                    Campo de Data
                  </label>
                  <Select
                    inputId="campo-data-filter"
                    options={camposDataOptions}
                    value={camposDataOptions.find(
                      (opt) => opt.value === filtros.filtroData.campo
                    )}
                    onChange={(selected) =>
                      setFiltros((f) => ({
                        ...f,
                        filtroData: {
                          ...f.filtroData,
                          campo: selected ? selected.value : "",
                        },
                      }))
                    }
                    placeholder="Selecione um campo"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor:
                          currentTheme === "dark"
                            ? themeColors.background.card.dark
                            : themeColors.components.filtros.input.bg[
                                currentTheme
                              ],
                        borderColor: base.isFocused
                          ? themeColors.components.filtros.input.focus[
                              currentTheme
                            ]
                          : themeColors.components.filtros.input.border[
                              currentTheme
                            ],
                        color: getTextColor("primary", currentTheme),
                        minHeight: 40,
                        boxShadow: base.isFocused
                          ? `0 0 0 2px ${themeColors.components.filtros.input.focus[currentTheme]}`
                          : undefined,
                        minWidth: 0,
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? currentTheme === "dark"
                            ? themeColors.components.buttons.primary.bg.dark
                            : themeColors.components.buttons.primary.bg.light
                          : state.isFocused
                          ? currentTheme === "dark"
                            ? themeColors.background.hover.dark
                            : themeColors.background.hover.light
                          : currentTheme === "dark"
                          ? themeColors.background.card.dark
                          : themeColors.components.filtros.input.bg.light,
                        color: getTextColor("primary", currentTheme),
                        cursor: "pointer",
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
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 160,
                      }),
                    }}
                    noOptionsMessage={() => "Sem opções"}
                    components={{ ClearIndicator: CustomClearIndicator }}
                    closeMenuOnScroll={true}
                  />
                </div>

                {/* Operador */}
                <div className="flex flex-col min-w-0">
                  <label
                    htmlFor="operador-data-filter"
                    className={`block mb-3 font-semibold ${fontSizes.labelFiltro}`}
                    style={{ color: getTextColor("primary", currentTheme) }}
                  >
                    Operador
                  </label>
                  <Select
                    inputId="operador-data-filter"
                    options={operadoresDataOptions}
                    value={operadoresDataOptions.find(
                      (opt) => opt.value === filtros.filtroData.operador
                    )}
                    onChange={(selected) =>
                      setFiltros((f) => ({
                        ...f,
                        filtroData: {
                          ...f.filtroData,
                          operador: selected ? selected.value : "",
                        },
                      }))
                    }
                    placeholder="Selecione um operador"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor:
                          currentTheme === "dark"
                            ? themeColors.background.card.dark
                            : themeColors.components.filtros.input.bg[
                                currentTheme
                              ],
                        borderColor: base.isFocused
                          ? themeColors.components.filtros.input.focus[
                              currentTheme
                            ]
                          : themeColors.components.filtros.input.border[
                              currentTheme
                            ],
                        color: getTextColor("primary", currentTheme),
                        minHeight: 40,
                        boxShadow: base.isFocused
                          ? `0 0 0 2px ${themeColors.components.filtros.input.focus[currentTheme]}`
                          : undefined,
                        minWidth: 0,
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? currentTheme === "dark"
                            ? themeColors.components.buttons.primary.bg.dark
                            : themeColors.components.buttons.primary.bg.light
                          : state.isFocused
                          ? currentTheme === "dark"
                            ? themeColors.background.hover.dark
                            : themeColors.background.hover.light
                          : currentTheme === "dark"
                          ? themeColors.background.card.dark
                          : themeColors.components.filtros.input.bg.light,
                        color: getTextColor("primary", currentTheme),
                        cursor: "pointer",
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
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 160,
                      }),
                    }}
                    noOptionsMessage={() => "Sem opções"}
                    components={{ ClearIndicator: CustomClearIndicator }}
                    closeMenuOnScroll={true}
                  />
                </div>

                {/* Data 1 */}
                <div className="flex flex-col min-w-0">
                  <label
                    htmlFor="data1-filter"
                    className={`block mb-3 font-semibold ${fontSizes.labelFiltro}`}
                    style={{ color: getTextColor("primary", currentTheme) }}
                  >
                    Data 1
                  </label>
                  <input
                    type="date"
                    id="data1-filter"
                    value={filtros.filtroData.valor1}
                    onChange={(e) =>
                      setFiltros((f) => ({
                        ...f,
                        filtroData: {
                          ...f.filtroData,
                          valor1: e.target.value,
                        },
                      }))
                    }
                    className="px-3 py-2 rounded border transition-colors"
                    style={{
                      backgroundColor:
                        currentTheme === "dark"
                          ? themeColors.background.card.dark
                          : themeColors.components.filtros.input.bg[
                              currentTheme
                            ],
                      borderColor:
                        themeColors.components.filtros.input.border[
                          currentTheme
                        ],
                      color: getTextColor("primary", currentTheme),
                    }}
                  />
                </div>

                {/* Data 2 (para operador "entre") */}
                <div className="flex flex-col min-w-0">
                  <label
                    htmlFor="data2-filter"
                    className={`block mb-3 font-semibold ${fontSizes.labelFiltro}`}
                    style={{ color: getTextColor("primary", currentTheme) }}
                  >
                    Data 2 (opcional)
                  </label>
                  <input
                    type="date"
                    id="data2-filter"
                    value={filtros.filtroData.valor2}
                    onChange={(e) =>
                      setFiltros((f) => ({
                        ...f,
                        filtroData: {
                          ...f.filtroData,
                          valor2: e.target.value,
                        },
                      }))
                    }
                    className="px-3 py-2 rounded border transition-colors"
                    style={{
                      backgroundColor:
                        currentTheme === "dark"
                          ? themeColors.background.card.dark
                          : themeColors.components.filtros.input.bg[
                              currentTheme
                            ],
                      borderColor:
                        themeColors.components.filtros.input.border[
                          currentTheme
                        ],
                      color: getTextColor("primary", currentTheme),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Totalizadores */}
      <ProjetosTotalizadores
        filteredData={filteredData}
        originalData={projetosData.rawData}
        onStatusPrazoClick={(status) =>
          setFiltros((f) => ({
            ...f,
            statusPrazo: [status],
          }))
        }
        filtroStatusPrazoAtivo={
          filtros.statusPrazo.length > 0 ? filtros.statusPrazo[0] : null
        }
      />

      {/* Gráficos do dashboard - 3 gráficos em linha */}
      <div className="mb-6 w-full flex flex-wrap gap-6 justify-center">
        {/* Gráfico 1: Projetos por Área */}
        <div
          className="rounded-lg shadow p-4 flex flex-col min-h-72 relative flex-1 min-w-[320px] w-full"
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
          className="rounded-lg shadow p-4 flex flex-col min-h-72 relative flex-1 min-w-[320px] w-full"
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
          className="rounded-lg shadow p-4 flex flex-col min-h-72 relative flex-1 min-w-[320px] w-full"
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
            filtroAtivo={filtros.squad.length > 0}
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

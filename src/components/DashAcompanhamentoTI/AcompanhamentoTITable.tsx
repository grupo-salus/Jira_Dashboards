import React, { useState, useEffect } from "react";
import { AcompanhamentoTI } from "../../types/Typesjira";
import {
  formatDate,
  formatSeconds,
  formatPriority,
} from "../../utils/formatters";
import {
  getTextColor,
  getBackgroundColor,
  getBorderColor,
} from "../../utils/themeColors";

interface Periodo {
  label: string;
  value: number;
}

interface AcompanhamentoTITableProps {
  data: AcompanhamentoTI[];
  filtros: {
    responsavel: string;
    prioridade: string;
    periodo_dias: number;
  };
  onFiltrosChange: (filtros: {
    responsavel: string;
    prioridade: string;
    periodo_dias: number;
  }) => void;
  periodos: Periodo[];
}

interface ColumnWidth {
  [key: string]: number;
}

type SortDirection = "asc" | "desc" | null;

const AcompanhamentoTITable: React.FC<AcompanhamentoTITableProps> = ({
  data,
  filtros,
  onFiltrosChange,
  periodos,
}) => {
  // Hook para detectar o tema atual
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">(
    "light"
  );

  React.useEffect(() => {
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

  const [columnWidths, setColumnWidths] = useState<ColumnWidth>({
    ID: 80,
    Chave: 100,
    Título: 200,
    Status: 120,
    Tipo: 100,
    Prioridade: 100,
    Responsável: 150,
    Relator: 150,
    Time: 120,
    Categoria: 120,
    "Criado em": 150,
    "Atualizado em": 150,
    "Data de Início": 150,
    "Data Prevista de Término": 150,
    "Data Limite": 150,
    "Data de Conclusão": 150,
    "Tempo Gasto (segundos)": 180,
    "Estimativa (segundos)": 180,
    "Esforço Registrado Total": 180,
    Labels: 120,
    "Dias na Ideação": 120,
    "Dias até Entrega (estimado)": 180,
  });

  const [isResizing, setIsResizing] = useState(false);
  const [currentColumn, setCurrentColumn] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [sortColumn, setSortColumn] = useState<keyof AcompanhamentoTI | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Aplicar filtros aos dados
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      // Filtro por responsável
      if (filtros.responsavel && item.Responsável !== filtros.responsavel) {
        return false;
      }

      // Filtro por prioridade
      if (filtros.prioridade && item.Prioridade !== filtros.prioridade) {
        return false;
      }

      // Filtro por período
      if (filtros.periodo_dias > 0) {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - filtros.periodo_dias);
        const dataCriacao = new Date(item["Criado em"]);
        if (dataCriacao < dataLimite) {
          return false;
        }
      }

      return true;
    });
  }, [data, filtros]);

  // Ordenar dados filtrados
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const columns: (keyof AcompanhamentoTI)[] = [
    "ID",
    "Chave",
    "Título",
    "Status",
    "Tipo",
    "Prioridade",
    "Responsável",
    "Relator",
    "Time",
    "Squad",
    "Criado em",
    "Atualizado em",
    "Data de Início",
    "Data Prevista de Término",
    "Data Limite",
    "Data de Conclusão",
    "Tempo Gasto (segundos)",
    "Estimativa (segundos)",
    "Esforço Registrado Total",
    "Labels",
    "Dias na Ideação",
    "Dias até Entrega (estimado)",
  ];

  const handleMouseDown = (e: React.MouseEvent, column: string) => {
    e.preventDefault();
    setIsResizing(true);
    setCurrentColumn(column);
    setStartX(e.clientX);
    setStartWidth(columnWidths[column]);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !currentColumn) return;

    const diff = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + diff);
    setColumnWidths((prev) => ({
      ...prev,
      [currentColumn]: newWidth,
    }));
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setCurrentColumn(null);
  };

  const handleSort = (column: keyof AcompanhamentoTI) => {
    if (sortColumn === column) {
      setSortDirection((prev) => {
        if (prev === "asc") return "desc";
        if (prev === "desc") return null;
        return "asc";
      });
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, currentColumn, startX, startWidth]);

  const getSortIcon = (column: keyof AcompanhamentoTI) => {
    if (sortColumn !== column) return "↕️";
    if (sortDirection === "asc") return "↑";
    if (sortDirection === "desc") return "↓";
    return "↕️";
  };

  const formatCellValue = (column: keyof AcompanhamentoTI, value: any) => {
    if (!value) return "-";

    switch (column) {
      case "Criado em":
      case "Atualizado em":
      case "Data de Início":
      case "Data Prevista de Término":
      case "Data Limite":
      case "Data de Conclusão":
        return formatDate(value);
      case "Tempo Gasto (segundos)":
      case "Estimativa (segundos)":
      case "Esforço Registrado Total":
        return formatSeconds(Number(value));
      case "Prioridade":
        const priorityConfig = formatPriority(value);
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color.bg} ${priorityConfig.color.text} ${priorityConfig.color.dark.bg} ${priorityConfig.color.dark.text}`}
          >
            {priorityConfig.label}
          </span>
        );
      default:
        return value;
    }
  };

  // Filtros
  const responsaveisOptions = React.useMemo(
    () => [...new Set(data.map((i) => i.Responsável).filter(Boolean))],
    [data]
  );

  const prioridadesOptions = React.useMemo(
    () => [...new Set(data.map((i) => i.Prioridade).filter(Boolean))],
    [data]
  );

  return (
    <div className="p-6">
      {/* Seção de Filtros */}
      <div
        className="rounded-lg shadow p-4 mb-6"
        style={{ backgroundColor: getBackgroundColor("card", currentTheme) }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Filtro de Responsável */}
          <div>
            <label
              htmlFor="responsavel-filter"
              className="block mb-2 text-sm font-medium"
              style={{ color: getTextColor("primary", currentTheme) }}
            >
              Responsável
            </label>
            <select
              id="responsavel-filter"
              className="text-sm rounded-lg block w-full p-2.5"
              style={{
                backgroundColor: getBackgroundColor("hover", currentTheme),
                border: `1px solid ${getBorderColor("primary", currentTheme)}`,
                color: getTextColor("primary", currentTheme),
              }}
              value={filtros.responsavel}
              onChange={(e) =>
                onFiltrosChange({ ...filtros, responsavel: e.target.value })
              }
            >
              <option value="">Todos</option>
              {responsaveisOptions.map((resp) => (
                <option key={resp} value={resp}>
                  {resp}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Prioridade */}
          <div>
            <label
              htmlFor="prioridade-filter"
              className="block mb-2 text-sm font-medium"
              style={{ color: getTextColor("primary", currentTheme) }}
            >
              Prioridade
            </label>
            <select
              id="prioridade-filter"
              className="text-sm rounded-lg block w-full p-2.5"
              style={{
                backgroundColor: getBackgroundColor("hover", currentTheme),
                border: `1px solid ${getBorderColor("primary", currentTheme)}`,
                color: getTextColor("primary", currentTheme),
              }}
              value={filtros.prioridade}
              onChange={(e) =>
                onFiltrosChange({ ...filtros, prioridade: e.target.value })
              }
            >
              <option value="">Todas</option>
              {prioridadesOptions.map((prio) => (
                <option key={prio} value={prio}>
                  {prio}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Período */}
          <div>
            <label
              htmlFor="periodo-filter"
              className="block mb-2 text-sm font-medium"
              style={{ color: getTextColor("primary", currentTheme) }}
            >
              Período
            </label>
            <select
              id="periodo-filter"
              className="text-sm rounded-lg block w-full p-2.5"
              style={{
                backgroundColor: getBackgroundColor("hover", currentTheme),
                border: `1px solid ${getBorderColor("primary", currentTheme)}`,
                color: getTextColor("primary", currentTheme),
              }}
              value={filtros.periodo_dias}
              onChange={(e) =>
                onFiltrosChange({
                  ...filtros,
                  periodo_dias: parseInt(e.target.value),
                })
              }
            >
              {periodos.map((periodo) => (
                <option key={periodo.value} value={periodo.value}>
                  {periodo.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div
        className="rounded-lg shadow p-6"
        style={{ backgroundColor: getBackgroundColor("card", currentTheme) }}
      >
        <div
          className="text-lg font-semibold mb-4"
          style={{ color: getTextColor("primary", currentTheme) }}
        >
          Resultados: {sortedData.length} itens encontrados
        </div>
        {/* Tabela */}
        <div className="relative h-[600px] flex flex-col">
          <div className="overflow-x-auto flex-1">
            <div className="inline-block min-w-full align-middle">
              <div
                className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5"
                style={{
                  border: `1px solid ${getBorderColor(
                    "primary",
                    currentTheme
                  )}`,
                }}
              >
                <div className="overflow-y-auto max-h-[calc(600px-40px)]">
                  <table className="min-w-full divide-y">
                    <thead
                      className="sticky top-0 z-10"
                      style={{
                        backgroundColor: getBackgroundColor(
                          "hover",
                          currentTheme
                        ),
                      }}
                    >
                      <tr>
                        {columns.map((column) => (
                          <th
                            key={column}
                            scope="col"
                            style={{
                              width: columnWidths[column],
                              minWidth: columnWidths[column],
                              color: getTextColor("secondary", currentTheme),
                              borderBottom: `1px solid ${getBorderColor(
                                "primary",
                                currentTheme
                              )}`,
                            }}
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap relative group cursor-pointer"
                            onClick={() => handleSort(column)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate flex items-center gap-1">
                                {column} {getSortIcon(column)}
                              </span>
                              <div
                                className="absolute right-0 top-0 h-full w-1 cursor-col-resize opacity-0 group-hover:opacity-100"
                                style={{
                                  backgroundColor: getBorderColor(
                                    "focus",
                                    currentTheme
                                  ),
                                }}
                                onMouseDown={(e) => handleMouseDown(e, column)}
                              />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        backgroundColor: getBackgroundColor(
                          "card",
                          currentTheme
                        ),
                      }}
                    >
                      {sortedData.map((item, index) => (
                        <tr
                          key={index}
                          style={{
                            borderBottom: `1px solid ${getBorderColor(
                              "secondary",
                              currentTheme
                            )}`,
                            backgroundColor:
                              index % 2 === 0
                                ? getBackgroundColor("card", currentTheme)
                                : getBackgroundColor("hover", currentTheme),
                          }}
                        >
                          {columns.map((column) => (
                            <td
                              key={`${index}-${column}`}
                              style={{
                                width: columnWidths[column],
                                minWidth: columnWidths[column],
                                color: getTextColor("primary", currentTheme),
                              }}
                              className="px-6 py-4 text-sm"
                            >
                              <div
                                className="truncate"
                                title={String(item[column] || "-")}
                              >
                                {formatCellValue(column, item[column])}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcompanhamentoTITable;

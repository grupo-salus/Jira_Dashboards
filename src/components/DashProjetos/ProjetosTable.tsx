import React, { useState, useEffect } from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
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

interface ProjetosTableProps {
  data: EspacoDeProjetos[];
}

interface ColumnWidth {
  [key: string]: number;
}

type SortDirection = "asc" | "desc" | null;

const ProjetosTable: React.FC<ProjetosTableProps> = ({ data }) => {
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
    Tipo: 100,
    Chave: 100,
    Título: 200,
    Prioridade: 100,
    PosicaoBacklog: 120,
    Descrição: 200,
    "Aprovador por (diretor)": 150,
    "Benefícios Esperados": 200,
    Status: 120,
    "Grupo Solicitante": 150,
    "Departamento Solicitante": 150,
    Solicitante: 150,
    "Telefone do Solicitante": 150,
    "Email do Solicitante": 150,
    Responsável: 150,
    Relator: 150,
    Categoria: 120,
    "Estimativa original (segundos)": 180,
    "Tempo registrado (segundos)": 180,
    "Tempo restante (segundos)": 180,
    "Investimento Esperado": 150,
    "Data de criação": 150,
    "Data de atualização": 150,
    "Data de término": 150,
    "Target start": 150,
    "Target end": 150,
    "Dias desde criação": 150,
    "Status de ideação": 150,
    "Dias planejados": 150,
    "Dias desde o início": 150,
    "Dias restantes": 150,
    "% do tempo decorrido": 150,
    "Status de prazo": 150,
    "% da estimativa usada": 150,
    "Status de esforço": 150,
  });

  const [isResizing, setIsResizing] = useState(false);
  const [currentColumn, setCurrentColumn] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [sortColumn, setSortColumn] = useState<keyof EspacoDeProjetos | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const columns: (keyof EspacoDeProjetos)[] = [
    "ID",
    "Tipo",
    "Chave",
    "Título",
    "Prioridade",
    "PosicaoBacklog",
    "Descrição",
    "Aprovador por (diretor)",
    "Benefícios Esperados",
    "Status",
    "Grupo Solicitante",
    "Departamento Solicitante",
    "Solicitante",
    "Telefone do Solicitante",
    "Email do Solicitante",
    "Responsável",
    "Relator",
    "Categoria",
    "Estimativa original (segundos)",
    "Tempo registrado (segundos)",
    "Tempo restante (segundos)",
    "Investimento Esperado",
    "Data de criação",
    "Data de atualização",
    "Data de término",
    "Target start",
    "Target end",
    "Dias desde criação",
    "Status de ideação",
    "Dias planejados",
    "Dias desde o início",
    "Dias restantes",
    "% do tempo decorrido",
    "Status de prazo",
    "% da estimativa usada",
    "Status de esforço",
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

  const handleSort = (column: keyof EspacoDeProjetos) => {
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

  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [data, sortColumn, sortDirection]);

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

  const getSortIcon = (column: keyof EspacoDeProjetos) => {
    if (sortColumn !== column) return "↕️";
    if (sortDirection === "asc") return "↑";
    if (sortDirection === "desc") return "↓";
    return "↕️";
  };

  const formatCellValue = (column: keyof EspacoDeProjetos, value: any) => {
    if (!value) return "-";

    switch (column) {
      case "Data de criação":
      case "Data de atualização":
      case "Data de término":
      case "Target start":
      case "Target end":
        return formatDate(value);
      case "Estimativa original (segundos)":
      case "Tempo registrado (segundos)":
      case "Tempo restante (segundos)":
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
      case "Descrição":
      case "Benefícios Esperados":
        return value.length > 100 ? `${value.substring(0, 100)}...` : value;
      case "Dias desde criação":
      case "Dias planejados":
      case "Dias desde o início":
      case "Dias restantes":
        return `${value} dias`;
      case "% do tempo decorrido":
      case "% da estimativa usada":
        return `${value}%`;
      case "Status de ideação":
      case "Status de prazo":
      case "Status de esforço":
        return (
          <span
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: getBackgroundColor("hover", currentTheme),
              color: getTextColor("info", currentTheme),
            }}
          >
            {value}
          </span>
        );
      default:
        return value;
    }
  };

  return (
    <div className="relative h-[600px] flex flex-col">
      <div className="overflow-x-auto flex-1">
        <div className="inline-block min-w-full align-middle">
          <div
            className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5"
            style={{
              border: `1px solid ${getBorderColor("primary", currentTheme)}`,
            }}
          >
            <div className="overflow-y-auto max-h-[calc(600px-40px)]">
              <table className="min-w-full divide-y">
                <thead
                  className="sticky top-0 z-10"
                  style={{
                    backgroundColor: getBackgroundColor("hover", currentTheme),
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
                    backgroundColor: getBackgroundColor("card", currentTheme),
                  }}
                >
                  {sortedData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
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
  );
};

export default ProjetosTable;

import React, { useState, useEffect } from "react";
import { ResultApi } from "../../types/jira";
import {
  formatDate,
  formatSeconds,
  formatPriority,
  calcularDiferencaTempo,
} from "../../utils/formatters";

interface BacklogTableProps {
  data: ResultApi[];
}

interface ColumnWidth {
  [key: string]: number;
}

type SortDirection = "asc" | "desc" | null;

const BacklogTable: React.FC<BacklogTableProps> = ({ data }) => {
  const [columnWidths, setColumnWidths] = useState<ColumnWidth>({
    ID: 80,
    Chave: 100,
    Título: 200,
    Projeto: 150,
    Tipo: 100,
    Status: 120,
    "Data de Criação": 150,
    "Última Atualização": 150,
    "Relator Técnico": 150,
    "Grupo Solicitante": 150,
    "Unidade / Departamento": 150,
    Solicitante: 150,
    Sprint: 120,
    "Responsável (Dev)": 150,
    "Estimativa Original (segundos)": 180,
    "Controle de Tempo (segundos)": 180,
    Prioridade: 100,
    Branch: 120,
    "versões afetadas": 150,
    "versões corrigidas": 150,
    "Backlog (nome)": 150,
    "Dias no Backlog": 120,
  });

  const [isResizing, setIsResizing] = useState(false);
  const [currentColumn, setCurrentColumn] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [sortColumn, setSortColumn] = useState<keyof ResultApi | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const columns: (keyof ResultApi)[] = [
    "ID",
    "Chave",
    "Título",
    "Projeto",
    "Tipo",
    "Status",
    "Data de Criação",
    "Última Atualização",
    "Relator Técnico",
    "Grupo Solicitante",
    "Unidade / Departamento",
    "Solicitante",
    "Sprint",
    "Responsável (Dev)",
    "Estimativa Original (segundos)",
    "Controle de Tempo (segundos)",
    "Prioridade",
    "Branch",
    "versões afetadas",
    "versões corrigidas",
    "Backlog (nome)",
    "Dias no Backlog",
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

  const handleSort = (column: keyof ResultApi) => {
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

  const getSortIcon = (column: keyof ResultApi) => {
    if (sortColumn !== column) return "↕️";
    if (sortDirection === "asc") return "↑";
    if (sortDirection === "desc") return "↓";
    return "↕️";
  };

  const formatCellValue = (column: keyof ResultApi, value: any) => {
    if (!value) return "-";

    switch (column) {
      case "Data de Criação":
      case "Última Atualização":
        return formatDate(value);
      case "Estimativa Original (segundos)":
      case "Controle de Tempo (segundos)":
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

  return (
    <div className="relative h-[600px] flex flex-col">
      <div className="overflow-x-auto flex-1">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
            <div className="overflow-y-auto max-h-[calc(600px-40px)]">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column}
                        scope="col"
                        style={{
                          width: columnWidths[column],
                          minWidth: columnWidths[column],
                        }}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => handleSort(column)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate flex items-center gap-1">
                            {column} {getSortIcon(column)}
                          </span>
                          <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500 opacity-0 group-hover:opacity-100"
                            onMouseDown={(e) => handleMouseDown(e, column)}
                          />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {columns.map((column) => (
                        <td
                          key={`${index}-${column}`}
                          style={{
                            width: columnWidths[column],
                            minWidth: columnWidths[column],
                          }}
                          className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
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

export default BacklogTable;

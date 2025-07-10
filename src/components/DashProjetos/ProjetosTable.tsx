import React, { useState, useEffect } from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import {
  getTextColor,
  getBackgroundColor,
  getBorderColor,
  getPriorityConfig,
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
    "#": 60,
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
    "Responsável Atual": 150,
    Solicitante: 150,
    "Telefone do Solicitante": 150,
    "Email do Solicitante": 150,
    Responsável: 150,
    Relator: 150,
    Squad: 120,
    "Estimativa original (segundos)": 180,
    "Tempo registrado (segundos)": 180,
    "Tempo restante (segundos)": 180,
    "Investimento Esperado": 150,
    "Data de criação": 150,
    "Data de atualização": 150,
    "Target start": 150,
    "Target end": 150,
    "Data de término": 150,
    "Status de ideação": 150,
    "Status de prazo": 150,
    "Data: Início Ideação": 150,
    "Data: Fim Ideação": 150,
    "Data: Início Backlog Priorizado": 180,
    "Data: Fim Backlog Priorizado": 180,
    "Data: Início Em desenvolvimento": 180,
    "Data: Fim Em desenvolvimento": 180,
    "Data: Início Em homologação": 180,
    "Data: Fim Em homologação": 180,
    "Data: Início Operação assistida": 180,
    "Data: Fim Operação assistida": 180,
    "Data: Início Entregue": 150,
    "Data: Fim Entregue": 150,
    "Data: Início Cancelado": 150,
    "Data: Fim Cancelado": 150,
    "Motivo para Cancelamento de Projeto": 200,
    "Data: Início Bloqueado": 150,
    "Data: Fim Bloqueado": 150,
    "Motivo para Bloqueio de Projeto": 200,
    "Tempo na fase Ideação (dias)": 150,
    "Tempo na fase Backlog Priorizado (dias)": 180,
    "Tempo na fase Em desenvolvimento (dias)": 180,
    "Tempo na fase Em homologação (dias)": 180,
    "Tempo na fase Operação assistida (dias)": 180,
    "Tempo na fase Entregue (dias)": 150,
    "Tempo na fase Cancelado (dias)": 150,
    "Tempo na fase Bloqueado (dias)": 150,
    "Dias na fase atual": 150,
  });

  const [isResizing, setIsResizing] = useState(false);
  const [currentColumn, setCurrentColumn] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [sortColumn, setSortColumn] = useState<keyof EspacoDeProjetos | null>(
    "PosicaoBacklog"
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Ordenar dados
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Se ambos são null/undefined, são iguais
      if (aValue === null && bValue === null) return 0;
      if (aValue === undefined && bValue === undefined) return 0;

      // Se apenas um é null/undefined, coloca no final
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Para comparação de strings (incluindo descrições), converte para string e faz case-insensitive
      const aString = String(aValue).toLowerCase().trim();
      const bString = String(bValue).toLowerCase().trim();

      if (aString === bString) return 0;

      const comparison = aString < bString ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  // Colunas exatamente como vêm da API
  const columns: (keyof EspacoDeProjetos)[] = [
    "ID",
    "Tipo",
    "Chave",
    "PosicaoBacklog",
    "Título",
    "Prioridade",
    "Status",
    "Descrição",
    "Aprovador por (diretor)",
    "Benefícios Esperados",
    "Grupo Solicitante",
    "Departamento Solicitante",
    "Responsável Atual",
    "Solicitante",
    "Telefone do Solicitante",
    "Email do Solicitante",
    "Responsável",
    "Relator",
    "Squads",
    "Estimativa original (segundos)",
    "Tempo registrado (segundos)",
    "Tempo restante (segundos)",
    "Investimento Esperado",
    "Data de criação",
    "Data de atualização",
    "Target start",
    "Target end",
    "Data de término",
    "Status de ideação",
    "Status de prazo",
    "Data: Início Backlog",
    "Data: Fim Backlog",
    "Data: Início Backlog priorizado",
    "Data: Fim Backlog priorizado",
    "Data: Início Em andamento",
    "Data: Fim Em andamento",
    "Data: Início Em homologação",
    "Data: Fim Em homologação",
    "Data: Início Operação assistida",
    "Data: Fim Operação assistida",
    "Data: Início Concluído",
    "Data: Fim Concluído",
    "Data: Início Cancelado",
    "Data: Fim Cancelado",
    "Data: Início Bloqueado",
    "Data: Fim Bloqueado",
    "Motivo para Bloqueio de Projeto",
    "Tempo na fase Ideação (dias)",
    "Tempo na fase Backlog Priorizado (dias)",
    "Tempo na fase Em andamento (dias)",
    "Tempo na fase Em homologação (dias)",
    "Tempo na fase Operação assistida (dias)",
    "Tempo na fase Entregue (dias)",
    "Tempo na fase Cancelado (dias)",
    "Tempo na fase Bloqueado (dias)",
    "Dias na fase atual",
  ];

  // Adicionar coluna de numeração
  const columnsWithNumbering = ["#", ...columns];

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

  const handleSort = (column: keyof EspacoDeProjetos | "#") => {
    if (column === "#") return; // Não ordenar pela coluna de numeração

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
  }, [isResizing]);

  const getSortIcon = (column: keyof EspacoDeProjetos | "#") => {
    if (column === "#") return ""; // Sem ícone para coluna de numeração
    if (sortColumn !== column) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const formatCellValue = (
    column: keyof EspacoDeProjetos | "#",
    value: any,
    rowIndex?: number
  ) => {
    // Para coluna de numeração
    if (column === "#") {
      return rowIndex !== undefined ? rowIndex + 1 : "-";
    }

    if (value === null || value === undefined) return "-";

    // Para PRIORIDADE: aplicar cor de fundo
    if (column === "Prioridade") {
      const { hex } = getPriorityConfig(value);
      return (
        <span
          style={{
            background: hex,
            color: "#fff",
            borderRadius: 6,
            padding: "2px 10px",
            fontWeight: 600,
            fontSize: 13,
            display: "inline-block",
            minWidth: 60,
            maxWidth: "100%",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </span>
      );
    }

    // Para campos de tempo em segundos
    if (column.includes("segundos") && typeof value === "number") {
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }

    // Para campos de porcentagem
    if (column.includes("%") && typeof value === "number") {
      return `${value.toFixed(1)}%`;
    }

    // Para campos de data
    if (
      column.includes("Data") ||
      column.includes("Target") ||
      column.includes("Criado") ||
      column.includes("Atualizado")
    ) {
      if (typeof value === "string" && value) {
        return new Date(value).toLocaleDateString("pt-BR");
      }
    }

    // Para PosicaoBacklog - mostrar apenas se há valor
    if (column === "PosicaoBacklog") {
      return value ? (
        <span
          className="flex justify-center items-center aspect-square w-7 h-7 rounded-full font-bold text-sm flex-shrink-0"
          style={{
            backgroundColor: "#10b981",
            color: "#ffffff",
          }}
        >
          #{value}
        </span>
      ) : (
        "-"
      );
    }


    return String(value);
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
                    {columnsWithNumbering.map((column) => (
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
                          transition: "background-color 0.2s ease",
                        }}
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap relative group ${
                          column === "#" ? "" : "cursor-pointer"
                        }`}
                        onClick={() =>
                          column !== "#" &&
                          handleSort(column as keyof EspacoDeProjetos)
                        }
                        onMouseEnter={(e) => {
                          if (column !== "#") {
                            e.currentTarget.style.backgroundColor =
                              getBackgroundColor("card", currentTheme);
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            getBackgroundColor("hover", currentTheme);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate flex items-center gap-1">
                            {column}{" "}
                            {getSortIcon(
                              column as keyof EspacoDeProjetos | "#"
                            )}
                          </span>
                          {column !== "#" && (
                            <div
                              className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
                              style={{
                                backgroundColor: getBorderColor(
                                  "focus",
                                  currentTheme
                                ),
                                opacity: 0,
                                transition: "opacity 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "1";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "0";
                              }}
                              onMouseDown={(e) =>
                                handleMouseDown(e, column as string)
                              }
                            />
                          )}
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
                      style={{
                        borderBottom: `1px solid ${getBorderColor(
                          "secondary",
                          currentTheme
                        )}`,
                        backgroundColor:
                          index % 2 === 0
                            ? getBackgroundColor("card", currentTheme)
                            : getBackgroundColor("hover", currentTheme),
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          getBackgroundColor("hover", currentTheme);
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          index % 2 === 0
                            ? getBackgroundColor("card", currentTheme)
                            : getBackgroundColor("hover", currentTheme);
                      }}
                    >
                      {columnsWithNumbering.map((column) => (
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
                            className="truncate whitespace-nowrap overflow-hidden"
                            title={
                              column === "#"
                                ? String(index + 1)
                                : String(
                                    item[column as keyof EspacoDeProjetos] ||
                                      "-"
                                  )
                            }
                          >
                            {formatCellValue(
                              column as keyof EspacoDeProjetos | "#",
                              column === "#"
                                ? null
                                : item[column as keyof EspacoDeProjetos],
                              index
                            )}
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

import React from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getPriorityConfig } from "../../constants/priorities";
import { themeColors } from "../../utils/themeColors";
import "./kanban-scrollbar.css";

interface ProjetosKanbanProps {
  data: EspacoDeProjetos[];
}

// Mapeamento de status para nomes das colunas
const STATUS_COLUMNS = {
  Backlog: "IDEAÇÃO",
  Bloqueado: "BLOQUEADO",
  "Backlog Priorizado": "BACKLOG PRIORIZADO",
  Cancelado: "CANCELADO",
  "Em andamento": "EM EXECUÇÃO",
  ENCERRAMENTO: "ENCERRAMENTO",
  Concluído: "CONCLUÍDO",
} as const;

// Ordem fixa das colunas do Kanban
const COLUMN_ORDER = [
  "Backlog",
  "Bloqueado",
  "Backlog Priorizado",
  "Cancelado",
  "Em andamento",
  "ENCERRAMENTO",
  "Concluído",
];

// Todas as colunas com cor cinza claro
const COLUMN_COLOR = "bg-gray-100 dark:bg-gray-800";

// Mapeamento de status para nomes das colunas (normalização)
const STATUS_MAP: Record<string, keyof typeof STATUS_COLUMNS> = {
  backlog: "Backlog",
  "backlog priorizado": "Backlog Priorizado",
  bloqueado: "Bloqueado",
  cancelado: "Cancelado",
  "em andamento": "Em andamento",
  encerramento: "ENCERRAMENTO",
  concluído: "Concluído",
  concluido: "Concluído",
};

function KanbanCard({ projeto }: { projeto: EspacoDeProjetos }) {
  const prioridadeConfig = getPriorityConfig(projeto.Prioridade || "");
  // Mapeamento de prioridade para cor do tema
  const corBarraTema: Record<string, string> = {
    "Muito Alta": themeColors.error, // vermelho
    Alta: themeColors.warning, // laranja
    Média: themeColors.primary[400], // azul claro
    Baixa: themeColors.success, // verde
    Mínima: themeColors.primary[100], // azul bem claro
    "Não definida": themeColors.gray, // cinza
  };
  const corBarra = corBarraTema[prioridadeConfig.label] || themeColors.gray;
  return (
    <div
      className={`group relative flex w-full bg-gray-50 dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-shadow cursor-pointer items-center`}
      tabIndex={0}
    >
      {/* Barra de prioridade com cor do tema */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
        style={{ background: corBarra }}
      />
      {/* Conteúdo do card */}
      <div className="pl-3 w-full">
        <div className="font-medium text-gray-900 dark:text-white text-xs line-clamp-2 mb-1">
          {projeto.Título}
        </div>
        {projeto["Departamento Solicitante"] &&
          projeto["Departamento Solicitante"].trim() !== "" &&
          projeto["Departamento Solicitante"] !== "-" && (
            <div className="inline-block text-xs mb-1 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium">
              {projeto["Departamento Solicitante"]}
            </div>
          )}
      </div>
    </div>
  );
}

// Função para normalizar status (remove acentos, deixa capitalizado igual ao nome da coluna)
function normalizarStatus(status: string): string {
  if (!status) return "Backlog";
  // Remove acentos e deixa só a primeira letra maiúscula
  const s = status.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  // Procura na lista de colunas por similaridade
  const match = COLUMN_ORDER.find(
    (col) => col.toLowerCase() === s.toLowerCase()
  );
  return match || status;
}

const ProjetosKanban: React.FC<ProjetosKanbanProps> = ({ data }) => {
  // Para cada coluna, filtrar os cards mantendo a ordem original da API
  const projetosPorStatus = React.useMemo(() => {
    const grupos: Record<string, EspacoDeProjetos[]> = {};
    COLUMN_ORDER.forEach((status) => {
      grupos[status] = [];
    });
    data.forEach((projeto) => {
      const statusNormalizado = normalizarStatus(projeto.Status || "Backlog");
      if (grupos[statusNormalizado]) {
        grupos[statusNormalizado].push(projeto);
      }
    });
    return grupos;
  }, [data]);

  const formatarData = (dataString: string | null) => {
    if (!dataString) return "Não definida";
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR");
    } catch {
      return "Data inválida";
    }
  };

  const formatarTempo = (segundos: number | null) => {
    if (!segundos) return "0h";
    const horas = Math.floor(segundos / 3600);
    return `${horas}h`;
  };

  function capitalizeFirst(str: string) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className="w-full">
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4`}
      >
        {COLUMN_ORDER.map((status) => {
          const projetos = projetosPorStatus[status] || [];
          // Nome da coluna: label traduzido se existir, senão o status, sempre com primeira maiúscula
          const nomeColuna = STATUS_COLUMNS[
            status as keyof typeof STATUS_COLUMNS
          ]
            ? capitalizeFirst(
                STATUS_COLUMNS[status as keyof typeof STATUS_COLUMNS]
              )
            : capitalizeFirst(status);
          return (
            <div
              key={status}
              className={`${COLUMN_COLOR} border border-gray-200 dark:border-gray-700 rounded-lg min-h-96 p-1`}
            >
              {/* Cabeçalho da coluna */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {nomeColuna}
                </h3>
                <span className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                  {projetos.length}
                </span>
              </div>
              {/* Cards dos projetos */}
              <div className="space-y-2 max-h-80 overflow-y-auto hide-scrollbar">
                {projetos.map((projeto) => (
                  <KanbanCard key={projeto.ID} projeto={projeto} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { STATUS_MAP, COLUMN_ORDER, STATUS_COLUMNS };

export default ProjetosKanban;

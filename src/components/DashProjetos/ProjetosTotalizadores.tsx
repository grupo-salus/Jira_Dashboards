import React, { useEffect } from "react";
import { CardsIcon, LightbulbIcon } from "../icons/DashboardIcons";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getTotalizadoresConfig } from "../../constants/styleConfig";

interface ProjetosTotalizadoresProps {
  filteredData: EspacoDeProjetos[];
}

const TotalizadorCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  barColor: string;
}> = ({ icon, label, value, barColor }) => {
  const config = getTotalizadoresConfig();

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${config.padding} flex-grow ${config.largura} ${config.altura} relative overflow-hidden`}
    >
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <p className={`font-semibold text-gray-900 dark:text-white mb-2 break-words ${config.label}`}>
            {label}
          </p>
          <p
            className={`font-bold text-gray-900 dark:text-white ${config.valor}`}
          >
            {value}
          </p>
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full ${barColor}`}></div>
    </div>
  );
};

const ProjetosTotalizadores: React.FC<ProjetosTotalizadoresProps> = ({
  filteredData,
}) => {
  const config = getTotalizadoresConfig();

  useEffect(() => {
    const handleTamanhoChange = () => {
      // Força re-render quando o tamanho global muda
    };
    window.addEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    return () => {
      window.removeEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    };
  }, []);

  // Métricas Chave
  const total = filteredData.length;
  const totalIdeacao = filteredData.filter(
    (p) => p.Status === "Backlog"
  ).length;
  const totalProjetos = total - totalIdeacao;

  // Métricas do Backlog Priorizado
  const backlogPriorizado = filteredData.filter(
    (p) => p.Status === "Backlog Priorizado"
  );
  const totalBacklogPriorizado = backlogPriorizado.length;

  // Encontrar o próximo a ser executado (primeiro da fila original)
  const proximoExecucao =
    backlogPriorizado.length > 0
      ? backlogPriorizado
          .filter((p) => p.PosicaoBacklog !== null)
          .sort((a, b) => (a.PosicaoBacklog || 0) - (b.PosicaoBacklog || 0))[0]
      : null;

  return (
    <div>
      <div className="flex flex-wrap gap-6 mb-6">
        <TotalizadorCard
          icon={
            <CardsIcon
              size={config.icone}
              className="text-blue-500 dark:text-blue-400"
            />
          }
          label="Total no Board"
          value={total}
          barColor="bg-blue-500"
        />
        <TotalizadorCard
          icon={
            <LightbulbIcon
              size={config.icone}
              className="text-purple-500 dark:text-purple-400"
            />
          }
          label="Total de Ideação"
          value={totalIdeacao}
          barColor="bg-purple-500"
        />
        <TotalizadorCard
          icon={
            <LightbulbIcon
              size={config.icone}
              className="text-orange-500 dark:text-orange-400"
            />
          }
          label="Total de Projetos"
          value={totalProjetos}
          barColor="bg-orange-500"
        />
        <TotalizadorCard
          icon={
            <LightbulbIcon
              size={config.icone}
              className="text-green-500 dark:text-green-400"
            />
          }
          label="Total na Fila Backlog Priorizado"
          value={totalBacklogPriorizado}
          barColor="bg-green-500"
        />
      </div>
      {proximoExecucao && (
        <div
          className={`bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 border border-green-200 dark:border-green-700 rounded-lg w-full ${config.altura} ${config.padding} relative overflow-hidden flex items-center mb-6`}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
              <span className={config.label}>
                #{proximoExecucao.PosicaoBacklog}
              </span>
            </div>
            <div className="flex-1">
              <h4
                className={`font-semibold text-gray-900 dark:text-white ${config.titulo}`}
              >
                Próximo: {proximoExecucao.Título}
              </h4>
              {proximoExecucao["Departamento Solicitante"] && (
                <p
                  className={`text-gray-600 dark:text-gray-400 mt-1 ${config.label}`}
                >
                  {proximoExecucao["Departamento Solicitante"]}
                </p>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-green-400 to-blue-400"></div>
        </div>
      )}
    </div>
  );
};

export default ProjetosTotalizadores;

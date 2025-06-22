import React, { useState, useEffect } from "react";
import { CardsIcon, CompassIcon, LightbulbIcon } from "../icons/DashboardIcons";
import { EspacoDeProjetos, JiraStatus } from "../../types/Typesjira";
import {
  getFontSizes,
  getIconSizes,
  getCardDimensions,
} from "../../constants/styleConfig";

interface ProjetosTotalizadoresProps {
  filteredData: EspacoDeProjetos[];
}

const TotalizadorCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  barColor: string;
}> = ({ icon, label, value, barColor }) => {
  const fontSizes = getFontSizes();
  const cardDimensions = getCardDimensions();

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex-grow ${cardDimensions.totalizador.width} relative overflow-hidden`}
    >
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <p
            className={`text-gray-500 dark:text-gray-400 ${fontSizes.labelTotalizador}`}
          >
            {label}
          </p>
          <p
            className={`font-bold text-gray-900 dark:text-white ${fontSizes.valorTotalizador}`}
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
  const [forceUpdate, setForceUpdate] = useState(0);

  const iconSizes = getIconSizes();

  useEffect(() => {
    const handleTamanhoChange = () => {
      setForceUpdate((prev) => prev + 1); // Força re-render
    };

    window.addEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    return () => {
      window.removeEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    };
  }, []);

  // Métricas Chave
  const total = filteredData.length;
  const totalIdeacao = filteredData.filter(
    (p) => p.Status === "Backlog" || p.Status === "Backlog Priorizado"
  ).length;
  const totalProjetos = total - totalIdeacao;

  // Métricas do Backlog Priorizado
  const backlogPriorizado = filteredData.filter(
    (p) => p.Status === "Backlog Priorizado"
  );
  const totalBacklogPriorizado = backlogPriorizado.length;

  // Encontrar o próximo a ser executado (primeiro da fila original)
  // Usar a posição original, não baseada nos dados filtrados
  const proximoExecucao =
    backlogPriorizado.length > 0
      ? backlogPriorizado
          .filter((p) => p.PosicaoBacklog !== null)
          .sort((a, b) => (a.PosicaoBacklog || 0) - (b.PosicaoBacklog || 0))[0]
      : null;

  // Saúde Geral dos Projetos e KPIs
  const projetosAtivos = filteredData.filter(
    (p) => p.Status !== "Concluído" && p.Status !== "Cancelado"
  );

  const projetosAtrasados = projetosAtivos.filter(
    (p) => p["Status de prazo"] === "Fora do prazo"
  ).length;

  const estimativasEstouradas = projetosAtivos.filter(
    (p) => p["Status de esforço"] === "Estourou a estimativa"
  ).length;

  const projetosEmRisco = projetosAtivos.filter(
    (p) =>
      p["Status de prazo"] === "Fora do prazo" ||
      p["Status de esforço"] === "Estourou a estimativa"
  ).length;

  const projetosConcluidos = filteredData.filter(
    (p) =>
      p.Status === "Concluído" && p["Data de término"] && p["Data de criação"]
  );

  const tempoMedioEntrega =
    projetosConcluidos.length > 0
      ? Math.round(
          projetosConcluidos.reduce((acc, p) => {
            const dataInicio = new Date(p["Data de criação"]);
            const dataFim = new Date(p["Data de término"]!);
            const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return acc + diffDays;
          }, 0) / projetosConcluidos.length
        )
      : 0;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Métricas Chave
        </h2>
        <div className="w-full h-px mt-2 bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="flex flex-wrap gap-6 mb-6">
        <TotalizadorCard
          icon={
            <CardsIcon
              size={iconSizes.totalizador}
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
              size={iconSizes.totalizador}
              className="text-purple-500 dark:text-purple-400"
            />
          }
          label="Total de Ideação"
          value={totalIdeacao}
          barColor="bg-purple-500"
        />
        <TotalizadorCard
          icon={
            <CompassIcon
              size={iconSizes.totalizador}
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
              size={iconSizes.totalizador}
              className="text-green-500 dark:text-green-400"
            />
          }
          label="Total na Fila Backlog Priorizado"
          value={totalBacklogPriorizado}
          barColor="bg-green-500"
        />
        {proximoExecucao && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 border border-green-200 dark:border-green-700 rounded-lg p-4 flex-grow min-w-[300px]">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                #{proximoExecucao.PosicaoBacklog}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Próximo: {proximoExecucao.Título}
                </h4>
                {proximoExecucao["Departamento Solicitante"] && (
                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                    {proximoExecucao["Departamento Solicitante"]}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 mb-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Saúde Geral dos Projetos e KPIs
        </h2>
        <div className="w-full h-px mt-2 bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="flex flex-wrap gap-6 mb-6">
        <TotalizadorCard
          icon={
            <CardsIcon
              size={iconSizes.totalizador}
              className="text-red-500 dark:text-red-400"
            />
          }
          label="Projetos Atrasados"
          value={projetosAtrasados}
          barColor="bg-red-500"
        />
        <TotalizadorCard
          icon={
            <LightbulbIcon
              size={iconSizes.totalizador}
              className="text-yellow-500 dark:text-yellow-400"
            />
          }
          label="Estimativas Estouradas"
          value={estimativasEstouradas}
          barColor="bg-yellow-500"
        />
        <TotalizadorCard
          icon={
            <CardsIcon
              size={iconSizes.totalizador}
              className="text-pink-700 dark:text-pink-600"
            />
          }
          label="Projetos em Risco"
          value={projetosEmRisco}
          barColor="bg-pink-700"
        />
        <TotalizadorCard
          icon={
            <LightbulbIcon
              size={iconSizes.totalizador}
              className="text-green-500 dark:text-green-400"
            />
          }
          label="Tempo Médio de Entrega (dias)"
          value={tempoMedioEntrega}
          barColor="bg-green-500"
        />
      </div>
    </div>
  );
};

export default ProjetosTotalizadores;

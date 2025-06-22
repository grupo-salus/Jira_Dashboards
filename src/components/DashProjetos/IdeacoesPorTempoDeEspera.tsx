import React, { useState, useEffect } from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { themeColors } from "../../utils/themeColors";
import { getFontSizes } from "../../constants/styleConfig";

interface IdeacoesPorTempoDeEsperaProps {
  data: EspacoDeProjetos[];
}

const IdeacoesPorTempoDeEspera: React.FC<IdeacoesPorTempoDeEsperaProps> = ({
  data,
}) => {
  const [forceUpdate, setForceUpdate] = useState(0);
  const fontSizes = getFontSizes();

  useEffect(() => {
    const handleTamanhoChange = () => {
      setForceUpdate((prev) => prev + 1);
    };

    window.addEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    return () => {
      window.removeEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    };
  }, []);

  const timePhases = React.useMemo(() => {
    const phases = [
      {
        name: "Recente",
        range: "0-90 dias",
        min: 0,
        max: 90,
        color: "#10B981",
        icon: "🌱",
        description: "Ideias novas",
      },
      {
        name: "Em Análise",
        range: "91-180 dias",
        min: 91,
        max: 180,
        color: "#F59E0B",
        icon: "🔍",
        description: "Precisa revisão",
      },
      {
        name: "Quase Obsoleto",
        range: "181-365 dias",
        min: 181,
        max: 365,
        color: "#EF4444",
        icon: "⚠️",
        description: "Ação necessária",
      },
      {
        name: "Obsoleto",
        range: "365+ dias",
        min: 366,
        max: Infinity,
        color: "#6B7280",
        icon: "💀",
        description: "Arquivar",
      },
    ];

    return phases.map((phase) => {
      const count = data.filter((item) => {
        if (item.Status === "Backlog" || item.Status === "Backlog Priorizado") {
          const dias = item["Dias desde criação"];
          if (dias !== null && dias !== undefined) {
            if (phase.max === Infinity) {
              return dias > phase.min;
            }
            return dias >= phase.min && dias <= phase.max;
          }
        }
        return false;
      }).length;

      return { ...phase, count };
    });
  }, [data]);

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center min-h-[250px] p-6">
      <div className="w-full">
        {/* Linha do tempo principal */}
        <div className="relative">
          {/* Linha horizontal base */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600 transform -translate-y-1/2 rounded-full"></div>

          {/* Fases da linha do tempo */}
          <div className="relative flex justify-between items-center">
            {timePhases.map((phase, index) => (
              <div
                key={phase.name}
                className="flex flex-col items-center relative z-10 flex-1"
              >
                {/* Quadrado da fase */}
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center text-xl mb-3 shadow-md border-2 border-white dark:border-gray-800 mx-auto relative z-20"
                  style={{ backgroundColor: phase.color }}
                >
                  {phase.icon}
                </div>

                {/* Conector para próxima fase */}
                {index < timePhases.length - 1 && (
                  <div
                    className="absolute top-7 left-1/2 w-full h-1 transform -translate-y-1/2 rounded-full z-0"
                    style={{ backgroundColor: phase.color }}
                  ></div>
                )}

                {/* Informações da fase */}
                <div className="text-center w-full px-2 relative z-10">
                  <div className={`font-bold mb-1 ${fontSizes.legendaGrafico}`}>
                    {phase.name}
                  </div>
                  <div
                    className={`text-gray-600 dark:text-gray-400 mb-1 ${fontSizes.legendaGrafico}`}
                  >
                    {phase.range}
                  </div>
                  <div
                    className={`font-bold rounded-full px-2 py-1 text-white ${fontSizes.valorTotalizador} inline-block text-sm mb-2`}
                    style={{ backgroundColor: phase.color }}
                  >
                    {phase.count}
                  </div>
                  <div
                    className={`text-gray-500 dark:text-gray-500 ${fontSizes.legendaGrafico} leading-tight`}
                  >
                    {phase.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeacoesPorTempoDeEspera;

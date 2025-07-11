import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import {
  getTextColor,
  getSquadConfig,
  getAreaConfig,
} from "../../utils/themeColors";
import TooltipProjetos from "./TooltipProjetos";
import { getFontSizes, TOOLTIP_CONFIG } from "../../constants/styleConfig";

interface AnaliseDemandasPorSquadProps {
  data: EspacoDeProjetos[];
  onSquadClick?: (squad: string) => void;
  filtroAtivo?: boolean;
  squadFiltrado?: string;
  onProjetoClick?: (projeto: EspacoDeProjetos) => void;
}

const AnaliseDemandasPorSquad: React.FC<AnaliseDemandasPorSquadProps> = ({
  data,
  onSquadClick,
  filtroAtivo = false,
  squadFiltrado,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    squad: string;
    projetos: EspacoDeProjetos[];
  } | null>(null);
  const [tooltipTimeout, setTooltipTimeout] = useState<number | null>(null);

  // Hook para detectar o tema atual
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  // Hook para detectar largura da tela
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Listener para fechar o tooltip
  useEffect(() => {
    const handleCloseTooltip = () => {
      setShowTooltip(false);
      setTooltipData(null);
    };

    document.addEventListener("closeTooltip", handleCloseTooltip);
    return () => {
      document.removeEventListener("closeTooltip", handleCloseTooltip);
    };
  }, []);

  // Cleanup do timeout quando componente for desmontado
  useEffect(() => {
    return () => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    };
  }, [tooltipTimeout]);

  const handlePieClick = (data: any) => {
    if (onSquadClick && data && data.name) {
      onSquadClick(data.name);
    }
  };

  const handlePieMouseEnter = (entry: any) => {
    if (entry && entry.name) {
      // Limpar timeout anterior se existir
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }

      // Criar novo timeout de 1.5 segundos
      const timeout = window.setTimeout(() => {
        const squadOriginal = entry.payload?.originalValue;
        let projetos = data.filter((item: EspacoDeProjetos) => {
          // Verificar se o squad está no array Squads
          const itemSquads = item["Squads"] || [];

          return itemSquads.includes(squadOriginal);
        });

        // Se não encontrou projetos com o valor original, tentar com o nome capitalizado
        if (projetos.length === 0 && squadOriginal) {
          const squadLower = squadOriginal.toLowerCase();
          const squadCapitalized =
            squadLower.charAt(0).toUpperCase() + squadLower.slice(1);

          projetos = data.filter((item: EspacoDeProjetos) => {
            const itemSquads = item["Squads"] || [];

            return itemSquads.includes(squadCapitalized);
          });
        }

        setTooltipData({
          squad: entry.name,
          projetos: projetos,
        });
        setShowTooltip(true);
      }, TOOLTIP_CONFIG.DELAY_MS);

      setTooltipTimeout(timeout);
    }
  };

  const handlePieMouseLeave = () => {
    // Limpar timeout quando sair do mouse
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
  };

  // Obter configurações de fonte atuais
  const fontSizes = getFontSizes();
  const labelFontSize =
    windowWidth <= 1500 ? "0.600rem" : fontSizes.eixoGrafico;

  // Função para obter a cor baseada no valor (squad ou área)
  const getColorForValue = (value: string) => {
    // Primeiro tenta como squad
    const squadConfig = getSquadConfig(value);
    if (squadConfig.label !== "Não informada") {
      return squadConfig.hex;
    }

    // Se não for squad, tenta como área
    const areaConfig = getAreaConfig(value);
    return areaConfig.hex;
  };

  // Agrupa projetos por squad
  const squadCount = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      // Usar o campo Squads (array)
      const squads =
        item["Squads"] && item["Squads"].length > 0
          ? item["Squads"]
          : ["Não informado"];

      squads.forEach((squad) => {
        if (squad) {
          counts[squad] = (counts[squad] || 0) + 1;
        }
      });
    });
    return Object.entries(counts).map(([squad, count]) => ({ squad, count }));
  }, [data]);

  // Filtrar "Não informado" das fatias
  let squadCountFiltered = squadCount.filter(
    (s) => s.squad !== "Não informado"
  );

  // Se há filtro ativo, mostrar apenas a fatia selecionada
  if (filtroAtivo && squadFiltrado) {
    const squadFiltradoEncontrado = squadCountFiltered.find(
      (squad) => squad.squad === squadFiltrado
    );

    if (squadFiltradoEncontrado) {
      squadCountFiltered = [squadFiltradoEncontrado];
    }
  }

  // Preparar dados para o gráfico de pizza
  const pieData = squadCountFiltered.map((item) => ({
    name: item.squad,
    value: item.count,
    originalValue: item.squad, // Manter o valor original para comparação
    label: item.squad,
  }));

  return (
    <div className="w-full h-full flex-1 flex flex-col xl:flex-row items-center xl:items-center justify-between w-full gap-4 xl:gap-0">
      <div className="flex-shrink-0">
        <PieChart width={280} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={"70%"}
            startAngle={0}
            endAngle={360}
            stroke="none"
            label={({ value }) => `${value}`}
            labelLine={true}
            isAnimationActive={false}
            onClick={handlePieClick}
            onMouseEnter={handlePieMouseEnter}
            onMouseLeave={handlePieMouseLeave}
            style={{ cursor: "pointer" }}
            activeShape={{ r: 75 }}
            activeIndex={[]}
          >
            {pieData.map((entry) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={getColorForValue(entry.originalValue)}
              />
            ))}
          </Pie>
          {/* Removido o Tooltip padrão do Recharts */}
        </PieChart>
      </div>
      <div className="flex-shrink-0 w-full xl:w-48 xl:max-w-[160px]">
        {pieData.length > 0 && (
          <ul className="grid grid-cols-3 gap-4 w-full xl:flex xl:flex-col xl:w-48 xl:max-w-[160px] xl:h-full xl:overflow-y-auto">
            {pieData
              .slice()
              .sort((a, b) => b.value - a.value)
              .map((item) => (
                <li
                  key={item.label}
                  // Alterado para 'items-center' para centralizar verticalmente
                  className={`flex items-center gap-2 font-medium`}
                  style={{ fontSize: labelFontSize }}
                >
                  <span
                    // Removido 'mt-1'
                    className="inline-block rounded-full flex-shrink-0"
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: getColorForValue(item.originalValue),
                    }}
                  ></span>
                  <span
                    // Mantido sem 'truncate' para o texto quebrar a linha se necessário
                    style={{ color: getTextColor("primary", currentTheme) }}
                  >
                    {item.label}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
      {/* Tooltip Modal */}
      {showTooltip && tooltipData && (
        <TooltipProjetos
          areaLabel={tooltipData.squad}
          projetos={tooltipData.projetos}
          onProjetoClick={(projeto) => {
            if (typeof window.setProjetoFiltradoUnico === "function") {
              window.setProjetoFiltradoUnico(projeto);
            }
            setShowTooltip(false);
          }}
        />
      )}
    </div>
  );
};

export default AnaliseDemandasPorSquad;

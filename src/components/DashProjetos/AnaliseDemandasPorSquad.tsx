import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getTextColor, getSquadConfig } from "../../utils/themeColors";
import TooltipProjetos from "./TooltipProjetos";
import { getFontSizes, TOOLTIP_CONFIG } from "../../constants/styleConfig";

interface AnaliseDemandasPorSquadProps {
  data: EspacoDeProjetos[];
  onSquadClick?: (squad: string) => void;
  filtroAtivo?: boolean;
}

const AnaliseDemandasPorSquad: React.FC<AnaliseDemandasPorSquadProps> = ({
  data,
  onSquadClick,
  filtroAtivo = false,
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
          const itemSquad = item["Squad"] || "";
          return itemSquad === squadOriginal;
        });

        // Se não encontrou projetos com o valor original, tentar com o nome capitalizado
        if (projetos.length === 0 && squadOriginal) {
          const squadLower = squadOriginal.toLowerCase();
          const squadCapitalized =
            squadLower.charAt(0).toUpperCase() + squadLower.slice(1);

          projetos = data.filter((item: EspacoDeProjetos) => {
            const itemSquad = item["Squad"] || "";
            const itemSquadLower = itemSquad.toLowerCase();
            const itemSquadCapitalized =
              itemSquadLower.charAt(0).toUpperCase() + itemSquadLower.slice(1);
            return itemSquadCapitalized === squadCapitalized;
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

  // Agrupa projetos por squad
  const squadCount = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const squad = item["Squad"] || "Não informado";
      counts[squad] = (counts[squad] || 0) + 1;
    });
    return Object.entries(counts).map(([squad, count]) => ({ squad, count }));
  }, [data]);

  // Filtrar "Não informado" das fatias
  const squadCountFiltered = squadCount.filter(
    (s) => s.squad !== "Não informado"
  );

  // Preparar dados para o gráfico de pizza
  const pieData = squadCountFiltered.map((item) => ({
    name: item.squad,
    value: item.count,
    originalValue: item.squad, // Manter o valor original para comparação
    label: item.squad,
  }));

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center">
      <div className="flex flex-col 2xl:flex-row items-center 2xl:items-center justify-between w-full gap-4 2xl:gap-0">
        <div className="flex-shrink-0">
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={"60%"}
              startAngle={0}
              endAngle={360}
              stroke="none"
              label={
                filtroAtivo
                  ? undefined
                  : ({ name, x, y, cx, cy }) => {
                      // Afastar a label 20% a mais do centro
                      const dx = x - cx;
                      const dy = y - cy;
                      const newX = cx + dx * 1.2;
                      const newY = cy + dy * 1.2;
                      return (
                        <text
                          x={newX}
                          y={newY}
                          textAnchor="middle"
                          fill={getTextColor("primary", currentTheme)}
                          fontSize={labelFontSize}
                          style={{ fontSize: labelFontSize }}
                        >
                          {name}
                        </text>
                      );
                    }
              }
              labelLine={!filtroAtivo}
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
                  fill={getSquadConfig(entry.originalValue).hex}
                />
              ))}
            </Pie>
            {/* Removido o Tooltip padrão do Recharts */}
          </PieChart>
        </div>

        <div className="flex-shrink-0">
          {pieData.length > 0 && (
            <ul className="flex flex-row 2xl:flex-col flex-wrap 2xl:flex-nowrap gap-x-2 gap-y-2 max-h-60 overflow-y-auto w-full 2xl:w-auto justify-center 2xl:justify-start">
              {pieData
                .slice()
                .sort((a, b) => b.value - a.value)
                .map((item) => (
                  <li
                    key={item.label}
                    className={`flex items-center gap-2 font-medium`}
                    style={{ fontSize: labelFontSize }}
                  >
                    <span
                      className="inline-block rounded-full"
                      style={{
                        width: 14,
                        height: 14,
                        backgroundColor: getSquadConfig(item.originalValue).hex,
                      }}
                    ></span>
                    <span
                      className="whitespace-nowrap"
                      style={{ color: getTextColor("primary", currentTheme) }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        color: getTextColor("secondary", currentTheme),
                      }}
                    >
                      ({item.value})
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Tooltip Modal */}
      {showTooltip && tooltipData && (
        <TooltipProjetos
          areaLabel={tooltipData.squad}
          projetos={tooltipData.projetos}
        />
      )}
    </div>
  );
};

export default AnaliseDemandasPorSquad;

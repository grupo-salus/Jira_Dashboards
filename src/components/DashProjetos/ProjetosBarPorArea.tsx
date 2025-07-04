import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import {
  themeColors,
  getTextColor,
  getAreaConfig,
} from "../../utils/themeColors";
import { getFontSizes, TOOLTIP_CONFIG } from "../../constants/styleConfig";
import TooltipProjetos from "./TooltipProjetos";

export interface ProjetosBarPorAreaProps {
  data: EspacoDeProjetos[];
  onAreaClick?: (area: string) => void;
}

const ProjetosBarPorArea: React.FC<ProjetosBarPorAreaProps> = ({
  data,
  onAreaClick,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    area: string;
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

  const isMobile = windowWidth <= 600;

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

  // Obter configurações de fonte atuais
  const fontSizes = getFontSizes();
  const eixoFontSize = windowWidth <= 1500 ? "0.600rem" : fontSizes.eixoGrafico;

  // Componente customizado para o tick do eixo X
  const CustomXAxisTick = ({ x, y, payload }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill={getTextColor("primary", currentTheme)}
          fontSize={eixoFontSize}
          style={{ fontSize: eixoFontSize }}
        >
          {payload.value.length > 12
            ? payload.value.substring(0, 12) + "..."
            : payload.value}
        </text>
      </g>
    );
  };

  const handleBarMouseEnter = (entry: any) => {
    if (entry && entry.area) {
      // Limpar timeout anterior se existir
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }

      // Criar novo timeout de 1.5 segundos
      const timeout = window.setTimeout(() => {
        const area = entry.area;
        const projetos = data.filter(
          (item: EspacoDeProjetos) =>
            (item["Departamento Solicitante"] || "Não informado") === area
        );

        setTooltipData({
          area: area,
          projetos: projetos,
        });
        setShowTooltip(true);
      }, TOOLTIP_CONFIG.DELAY_MS);

      setTooltipTimeout(timeout);
    }
  };

  const handleBarMouseLeave = () => {
    // Limpar timeout quando sair do mouse
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
  };

  // Agrupa projetos por área
  const areaCount = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const area = item["Departamento Solicitante"] || "Não informado";
      counts[area] = (counts[area] || 0) + 1;
    });
    return Object.entries(counts).map(([area, count]) => ({ area, count }));
  }, [data]);

  // Filtrar "Não informado" das barras
  const areaCountFiltered = areaCount.filter((a) => a.area !== "Não informado");

  return (
    <div className="w-full h-full flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={areaCountFiltered}
          margin={{ left: 0, right: 0, top: 25, bottom: 20 }}
          layout={isMobile ? "vertical" : "horizontal"}
        >
          <XAxis
            dataKey={isMobile ? "count" : "area"}
            type={isMobile ? "number" : "category"}
            tick={<CustomXAxisTick />}
            interval={0}
          />
          <YAxis
            dataKey={isMobile ? "area" : undefined}
            type={isMobile ? "category" : "number"}
            fontSize={eixoFontSize}
            tick={{ fill: themeColors.secondary[500], fontSize: eixoFontSize }}
            axisLine={{ stroke: themeColors.secondary[400] }}
            tickLine={{ stroke: themeColors.secondary[400] }}
          />
          <Bar
            dataKey="count"
            onClick={(data) => {
              if (onAreaClick && data && data.area) {
                onAreaClick(data.area);
              }
            }}
            onMouseEnter={handleBarMouseEnter}
            onMouseLeave={handleBarMouseLeave}
            cursor="pointer"
            radius={[8, 8, 0, 0]}
          >
            {areaCountFiltered.map((item) => (
              <Cell
                key={`cell-${item.area}`}
                fill={getAreaConfig(item.area).hex}
                cursor="pointer"
              />
            ))}
            <LabelList
              dataKey="count"
              position={isMobile ? "right" : "top"}
              style={{
                fill: getTextColor("primary", currentTheme),
                fontSize: eixoFontSize,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Tooltip Modal */}
      {showTooltip && tooltipData && (
        <TooltipProjetos
          areaLabel={tooltipData.area}
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

export default ProjetosBarPorArea;

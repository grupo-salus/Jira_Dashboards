import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getPriorityConfig, getTextColor } from "../../utils/themeColors";
import { themeColors } from "../../utils/themeColors";
import { getFontSizes, TOOLTIP_CONFIG } from "../../constants/styleConfig";
import TooltipProjetos from "./TooltipProjetos";

export interface ProjetosBarPorPrioridadeProps {
  data: EspacoDeProjetos[];
  onPrioridadeClick?: (prioridade: string) => void;
}

const prioridadeOrdem = [
  { value: "Estratégica", label: "Estratégica" },
  { value: "Alta", label: "Alta" },
  { value: "Média", label: "Média" },
  { value: "Baixa", label: "Baixa" },
  { value: "Baixíssima", label: "Baixíssima" },
];

// Cores específicas para cada prioridade usando o sistema centralizado
const prioridadeCores = {
  Estratégica: themeColors.components.prioridades.estrategica.hex,
  Alta: themeColors.components.prioridades.alta.hex,
  Média: themeColors.components.prioridades.media.hex,
  Baixa: themeColors.components.prioridades.baixa.hex,
  Baixíssima: themeColors.components.prioridades.muitoBaixa.hex,
};

const ProjetosBarPorPrioridade: React.FC<ProjetosBarPorPrioridadeProps> = ({
  data,
  onPrioridadeClick,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    prioridade: string;
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
    // Obter a cor específica da prioridade
    const prioridadeColor =
      prioridadeCores[payload.value as keyof typeof prioridadeCores] ||
      themeColors.primary[600];

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill={prioridadeColor}
          fontSize={eixoFontSize}
          style={{ fontSize: eixoFontSize }}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const handleBarMouseEnter = (entry: any) => {
    if (entry && entry.label) {
      // Limpar timeout anterior se existir
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }

      // Criar novo timeout de 1.5 segundos
      const timeout = window.setTimeout(() => {
        const prioridade = entry.label;
        const projetos = data.filter((item: EspacoDeProjetos) => {
          const prioridadeLabel = getPriorityConfig(
            item.Prioridade || ""
          ).label;
          return prioridadeLabel === prioridade;
        });

        setTooltipData({
          prioridade: prioridade,
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

  // Agrupa projetos por prioridade
  const prioridadeCount = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const prioridade = getPriorityConfig(item.Prioridade || "").label;
      counts[prioridade] = (counts[prioridade] || 0) + 1;
    });

    // Ordenar conforme a ordem definida
    return prioridadeOrdem
      .map((p) => ({
        label: p.label,
        value: p.value,
        count: counts[p.label] || 0,
      }))
      .filter((p) => p.count > 0);
  }, [data]);

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={prioridadeCount}
          margin={{ left: 20, right: 20, top: 25, bottom: 20 }}
          layout={isMobile ? "vertical" : "horizontal"}
          onClick={(e) => {
            if (e && e.activePayload && e.activePayload[0]) {
              const prioridadeValue = e.activePayload[0].payload.value;
              if (onPrioridadeClick) onPrioridadeClick(prioridadeValue);
            }
          }}
        >
          <XAxis
            dataKey={isMobile ? "count" : "label"}
            type={isMobile ? "number" : "category"}
            tick={<CustomXAxisTick />}
            interval={0}
            axisLine={{ stroke: themeColors.secondary[400] }}
            tickLine={{ stroke: themeColors.secondary[400] }}
          />
          <YAxis
            dataKey={isMobile ? "label" : undefined}
            type={isMobile ? "category" : "number"}
            fontSize={eixoFontSize}
            tick={{ fill: themeColors.secondary[500], fontSize: eixoFontSize }}
            axisLine={{ stroke: themeColors.secondary[400] }}
            tickLine={{ stroke: themeColors.secondary[400] }}
          />
          <Bar
            dataKey="count"
            radius={[8, 8, 0, 0]}
            cursor="pointer"
            onMouseEnter={handleBarMouseEnter}
            onMouseLeave={handleBarMouseLeave}
          >
            {prioridadeCount.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  prioridadeCores[
                    entry.label as keyof typeof prioridadeCores
                  ] || themeColors.primary[600]
                }
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
          areaLabel={tooltipData.prioridade}
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

export default ProjetosBarPorPrioridade;

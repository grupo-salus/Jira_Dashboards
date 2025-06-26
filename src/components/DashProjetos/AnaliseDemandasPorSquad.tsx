import React, { useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { themeColors } from "../../utils/themeColors";
import TooltipProjetos from "./TooltipProjetos";
import { getFontSizes } from "../../constants/styleConfig";

interface AnaliseDemandasPorSquadProps {
  data: EspacoDeProjetos[];
  onSquadClick?: (squad: string) => void;
}

// Função auxiliar para normalizar strings (igual ao dashboard)

const CustomTooltip = ({ active, payload, projetosData }: any) => {
  if (active && payload && payload.length && projetosData) {
    const squad = payload[0].name;
    const squadOriginal = payload[0].payload?.originalValue;

    // Filtrar projetos que correspondem à squad
    const projetos = projetosData.filter((item: EspacoDeProjetos) => {
      const itemSquad = item["Squad"] || "";
      // Comparar com o valor original da squad
      return itemSquad === squadOriginal;
    });

    // Se não encontrou projetos com o valor original, tentar com o nome capitalizado
    if (projetos.length === 0 && squadOriginal) {
      const squadLower = squadOriginal.toLowerCase();
      const squadCapitalized =
        squadLower.charAt(0).toUpperCase() + squadLower.slice(1);

      const projetosAlt = projetosData.filter((item: EspacoDeProjetos) => {
        const itemSquad = item["Squad"] || "";
        const itemSquadLower = itemSquad.toLowerCase();
        const itemSquadCapitalized =
          itemSquadLower.charAt(0).toUpperCase() + itemSquadLower.slice(1);
        return itemSquadCapitalized === squadCapitalized;
      });

      if (projetosAlt.length > 0) {
        return <TooltipProjetos areaLabel={squad} projetos={projetosAlt} />;
      }
    }

    return <TooltipProjetos areaLabel={squad} projetos={projetos} />;
  }
  return null;
};

const AnaliseDemandasPorSquad: React.FC<AnaliseDemandasPorSquadProps> = ({
  data,
  onSquadClick,
}) => {
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

  useEffect(() => {
    const handleTamanhoChange = () => {
      // Nenhuma ação necessária, pois forceUpdate foi removido
    };

    window.addEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    return () => {
      window.removeEventListener("tamanhoGlobalChanged", handleTamanhoChange);
    };
  }, []);

  const countBySquad = React.useMemo(() => {
    const counts: Record<string, { label: string; count: number }> = {};
    data.forEach((item) => {
      const squad = item["Squad"];
      if (squad && squad !== "Não informada") {
        if (!counts[squad]) counts[squad] = { label: squad, count: 0 };
        counts[squad].count += 1;
      }
    });
    return Object.entries(counts)
      .map(([value, { label, count }]) => ({ value, label, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const pieData = React.useMemo(() => {
    return countBySquad.map((cat) => ({
      name: cat.label,
      label: cat.label,
      value: cat.count,
      originalValue: cat.value,
    }));
  }, [countBySquad]);

  // Função para filtrar ao clicar na fatia
  const handlePieClick = (data: any) => {
    if (data && data.payload && onSquadClick) {
      onSquadClick(data.payload.originalValue);
    }
  };

  const fontSizes = getFontSizes();

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center">
      <div className="flex flex-col 2xl:flex-row items-center 2xl:items-center justify-between w-full gap-4 2xl:gap-0">
        <div className="flex-shrink-0">
          <ResponsiveContainer
            width={300}
            height={300}
            style={{ pointerEvents: "auto" }}
          >
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={"60%"}
                label
                labelLine
                isAnimationActive={false}
                onClick={handlePieClick}
                style={{ cursor: "pointer" }}
                activeShape={{ r: 75 }}
                activeIndex={[]}
              >
                {pieData.map((entry, idx) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={
                      themeColors.components.graficos.pizza.palette[
                        idx %
                          themeColors.components.graficos.pizza.palette.length
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip projetosData={data} />}
                cursor={false}
                isAnimationActive={false}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col items-start w-full 2xl:w-auto">
          {pieData.length > 0 && (
            <ul className="flex flex-row 2xl:flex-col flex-wrap 2xl:flex-nowrap gap-x-2 gap-y-2 max-h-60 overflow-y-auto w-full 2xl:w-auto justify-center 2xl:justify-start">
              {pieData
                .slice()
                .sort((a, b) => b.value - a.value)
                .map((item, idx) => (
                  <li
                    key={item.label}
                    className={`flex items-center gap-2 ${fontSizes.legendaGrafico} font-medium`}
                  >
                    <span
                      className="inline-block rounded-full"
                      style={{
                        width: 14,
                        height: 14,
                        backgroundColor:
                          themeColors.components.graficos.pizza.palette[
                            idx %
                              themeColors.components.graficos.pizza.palette
                                .length
                          ],
                      }}
                    ></span>
                    <span
                      className="whitespace-nowrap"
                      style={{ color: themeColors.text.primary[currentTheme] }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        color: themeColors.text.secondary[currentTheme],
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
    </div>
  );
};

export default AnaliseDemandasPorSquad;

import React, { useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { themeColors } from "../../utils/themeColors";
import TooltipProjetos from "./TooltipProjetos";

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
        const squadLower = squad.toLowerCase();
        const squadCapitalized =
          squadLower.charAt(0).toUpperCase() + squadLower.slice(1);
        if (!counts[squad])
          counts[squad] = { label: squadCapitalized, count: 0 };
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

  return (
    <div className="w-full h-full flex-1 flex items-center justify-center min-h-[250px] min-w-[250px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minHeight={250}
        minWidth={250}
        style={{ pointerEvents: "auto" }}
      >
        <PieChart width={400} height={400}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={"70%"}
            label={({ name, value }) => `${name}: ${value}`}
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
                  themeColors.components.graficos.palette[
                    idx % themeColors.components.graficos.palette.length
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
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ marginBottom: 15 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnaliseDemandasPorSquad;

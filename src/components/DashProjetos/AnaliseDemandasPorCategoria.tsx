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

interface AnaliseDemandasPorCategoriaProps {
  data: EspacoDeProjetos[];
  onCategoriaClick?: (categoria: string) => void;
}

// Função auxiliar para normalizar strings (igual ao dashboard)

const CustomTooltip = ({ active, payload, projetosData }: any) => {
  if (active && payload && payload.length && projetosData) {
    const categoria = payload[0].name;
    const categoriaOriginal = payload[0].payload?.originalValue;

    // Filtrar projetos que correspondem à categoria
    const projetos = projetosData.filter((item: EspacoDeProjetos) => {
      const itemCategoria = item["Categoria"] || "";
      // Comparar com o valor original da categoria
      return itemCategoria === categoriaOriginal;
    });

    // Se não encontrou projetos com o valor original, tentar com o nome capitalizado
    if (projetos.length === 0 && categoriaOriginal) {
      const categoriaLower = categoriaOriginal.toLowerCase();
      const categoriaCapitalized =
        categoriaLower.charAt(0).toUpperCase() + categoriaLower.slice(1);

      const projetosAlt = projetosData.filter((item: EspacoDeProjetos) => {
        const itemCategoria = item["Categoria"] || "";
        const itemCategoriaLower = itemCategoria.toLowerCase();
        const itemCategoriaCapitalized =
          itemCategoriaLower.charAt(0).toUpperCase() +
          itemCategoriaLower.slice(1);
        return itemCategoriaCapitalized === categoriaCapitalized;
      });

      if (projetosAlt.length > 0) {
        return <TooltipProjetos areaLabel={categoria} projetos={projetosAlt} />;
      }
    }

    return <TooltipProjetos areaLabel={categoria} projetos={projetos} />;
  }
  return null;
};

const AnaliseDemandasPorCategoria: React.FC<
  AnaliseDemandasPorCategoriaProps
> = ({ data, onCategoriaClick }) => {
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

  const countByCategoria = React.useMemo(() => {
    const counts: Record<string, { label: string; count: number }> = {};
    data.forEach((item) => {
      const categoria = item["Categoria"];
      if (categoria && categoria !== "Não informada") {
        const categoriaLower = categoria.toLowerCase();
        const categoriaCapitalized =
          categoriaLower.charAt(0).toUpperCase() + categoriaLower.slice(1);
        if (!counts[categoria])
          counts[categoria] = { label: categoriaCapitalized, count: 0 };
        counts[categoria].count += 1;
      }
    });
    return Object.entries(counts)
      .map(([value, { label, count }]) => ({ value, label, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const pieData = React.useMemo(() => {
    return countByCategoria.map((cat) => ({
      name: cat.label,
      label: cat.label,
      value: cat.count,
      originalValue: cat.value,
    }));
  }, [countByCategoria]);

  // Função para filtrar ao clicar na fatia
  const handlePieClick = (data: any) => {
    if (data && data.payload && onCategoriaClick) {
      onCategoriaClick(data.payload.originalValue);
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

export default AnaliseDemandasPorCategoria;

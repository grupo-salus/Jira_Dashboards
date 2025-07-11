import { useState } from "react";
import { useTheme } from "@/shared/context/ThemeContext";
import { FilterBase } from "./FilterBase";
import { AreaFilter } from "./AreaFilter";
import { StatusFilter } from "./StatusFilter";
import { PrioridadeFilter } from "./PrioridadeFilter";
import { SquadFilter } from "./SquadFilter";
import { GrupoSolicitanteFilter } from "./GrupoSolicitanteFilter";
import { PeriodoFilter } from "./PeriodoFilter";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { CampoDataFilter } from "./CampoDataFilter";
import { OperadorFilter } from "./OperadorFilter";
import { Data1Filter } from "./Data1Filter";
import { Data2Filter } from "./Data2Filter";
import { coreColors } from "@/shared/constants/coreColors";

interface FilterPanelProps {
  projetos: any[];
}

export const FilterPanel = ({ projetos }: FilterPanelProps) => {
  const { theme } = useTheme();
  const [filters, setFilters] = useState({
    area: [] as string[],
    status: [] as string[],
    prioridade: [] as string[],
    squad: [] as string[],
    grupoSolicitante: [] as string[],
    periodo: "" as string,
    campoData: "",
    operador: "",
    data1: "",
    data2: "",
  });
  const [showFilters, setShowFilters] = useState(true);

  const showAdvanced = filters.periodo && filters.periodo === "Filtro Avançado";
  const hasActiveFilters = Object.values(filters).some(
    (v) => v && (Array.isArray(v) ? v.length > 0 : true)
  );

  const clearAll = () =>
    setFilters({
      area: [],
      status: [],
      prioridade: [],
      squad: [],
      grupoSolicitante: [],
      periodo: "",
      campoData: "",
      operador: "",
      data1: "",
      data2: "",
    });

  return (
    <div className="mb-8">
      {/* Botão para mostrar/ocultar filtros no mobile */}
      <div className="flex justify-end w-full sm:hidden mb-2">
        <button
          className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold"
          style={{
            backgroundColor: theme.bg.surface,
            color: theme.brand.primary,
          }}
          onClick={() => setShowFilters((v) => !v)}
        >
          <Filter size={16} />
          {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      <div className="flex justify-end w-full mt-0 mb-4">
        <button
          className={`flex items-center gap-1 p-2 px-2 bg-transparent rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent font-semibold text-xs ml-4 ${
            !hasActiveFilters ? "invisible" : ""
          }`}
          title="Limpar todos os filtros"
          style={{ color: coreColors.acaoLimpar }}
          onClick={clearAll}
        >
          <Filter size={16} />
          <span className="font-semibold">Limpar filtros</span>
        </button>
      </div>
      {/* Filtros principais e avançados, controlados por showFilters no mobile */}
      <div
        className={`${showFilters ? "" : "hidden"} sm:block p-0 shadow-none`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-7 w-full">
          <AreaFilter
            value={filters.area}
            onChange={(v: any) => setFilters((f) => ({ ...f, area: v }))}
            projetos={projetos}
          />
          <StatusFilter
            value={filters.status}
            onChange={(v: any) => setFilters((f) => ({ ...f, status: v }))}
            projetos={projetos}
          />
          <PrioridadeFilter
            value={filters.prioridade}
            onChange={(v: any) => setFilters((f) => ({ ...f, prioridade: v }))}
            projetos={projetos}
          />
          <SquadFilter
            value={filters.squad}
            onChange={(v: any) => setFilters((f) => ({ ...f, squad: v }))}
            projetos={projetos}
          />
          <GrupoSolicitanteFilter
            value={filters.grupoSolicitante}
            onChange={(v: any) =>
              setFilters((f) => ({ ...f, grupoSolicitante: v }))
            }
            projetos={projetos}
          />
          <PeriodoFilter
            value={filters.periodo}
            onChange={(v: any) => setFilters((f) => ({ ...f, periodo: v }))}
          />
        </div>
        {showAdvanced && (
          <div className="mt-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7 w-full">
              <CampoDataFilter
                value={filters.campoData}
                onChange={(v: string) =>
                  setFilters((f) => ({ ...f, campoData: v }))
                }
              />
              <OperadorFilter
                value={filters.operador}
                onChange={(v: string) =>
                  setFilters((f) => ({ ...f, operador: v }))
                }
              />
              <Data1Filter
                value={filters.data1}
                onChange={(v: string) =>
                  setFilters((f) => ({ ...f, data1: v }))
                }
              />
              <Data2Filter
                value={filters.data2}
                onChange={(v: string) =>
                  setFilters((f) => ({ ...f, data2: v }))
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

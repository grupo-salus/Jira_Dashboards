import Select from "react-select";
import { Calendar, Filter } from "lucide-react";
import { useSelectTheme } from "@/shared/hooks/useSelectTheme";
import { useTheme } from "@/shared/context/ThemeContext";
import { FilterBase } from "./FilterBase";

const campoDataOptions = [
  { value: "criado", label: "Criação" },
  { value: "atualizado", label: "Atualização" },
  { value: "encerrado", label: "Encerramento" },
];
const operadorOptions = [
  { value: "maior", label: "Maior que" },
  { value: "menor", label: "Menor que" },
  { value: "igual", label: "Igual a" },
  { value: "entre", label: "Entre" },
];

interface FiltroAvancadoDataProps {
  campoData: string | null;
  operador: string | null;
  data1: string | null;
  data2: string | null;
  onChange: (obj: Record<string, string | null>) => void;
}

export const FiltroAvancadoData = ({
  campoData,
  operador,
  data1,
  data2,
  onChange,
}: FiltroAvancadoDataProps) => {
  const selectTheme = useSelectTheme();
  const { theme } = useTheme();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6 w-full">
      <FilterBase
        label="Campo de Data"
        icon={<Calendar size={16} />}
        htmlFor="campo-data-filter"
      >
        <Select
          inputId="campo-data-filter"
          classNamePrefix="react-select"
          options={campoDataOptions}
          value={
            campoData
              ? campoDataOptions.find((opt) => opt.value === campoData)
              : null
          }
          onChange={(opt) => onChange({ campoData: opt?.value || null })}
          theme={selectTheme}
          isClearable
          placeholder="Selecione um campo"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: theme.bg.base,
              borderColor: theme.border.base,
              color: theme.text.subtitle,
              minHeight: 40,
              boxShadow: "none",
            }),
            singleValue: (base) => ({ ...base, color: theme.text.subtitle }),
            placeholder: (base) => ({ ...base, color: theme.text.subtitle }),
            menu: (base) => ({ ...base, backgroundColor: theme.bg.base }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? theme.brand.primary
                : state.isFocused
                ? theme.bg.muted
                : theme.bg.base,
              color: state.isSelected
                ? theme.text.inverse
                : theme.text.subtitle,
            }),
          }}
        />
      </FilterBase>
      <FilterBase
        label="Operador"
        icon={<Filter size={16} />}
        htmlFor="operador-data-filter"
      >
        <Select
          inputId="operador-data-filter"
          classNamePrefix="react-select"
          options={operadorOptions}
          value={
            operador
              ? operadorOptions.find((opt) => opt.value === operador)
              : null
          }
          onChange={(opt) => onChange({ operador: opt?.value || null })}
          theme={selectTheme}
          isClearable
          placeholder="Selecione um operador"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: theme.bg.base,
              borderColor: theme.border.base,
              color: theme.text.subtitle,
              minHeight: 40,
              boxShadow: "none",
            }),
            singleValue: (base) => ({ ...base, color: theme.text.subtitle }),
            placeholder: (base) => ({ ...base, color: theme.text.subtitle }),
            menu: (base) => ({ ...base, backgroundColor: theme.bg.base }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? theme.brand.primary
                : state.isFocused
                ? theme.bg.muted
                : theme.bg.base,
              color: state.isSelected
                ? theme.text.inverse
                : theme.text.subtitle,
            }),
          }}
        />
      </FilterBase>
      <FilterBase
        label="Data 1"
        icon={<Calendar size={16} />}
        htmlFor="data1-filter"
      >
        <input
          type="date"
          id="data1-filter"
          className="px-3 py-2 rounded border transition-colors w-full"
          value={data1 || ""}
          onChange={(e) => onChange({ data1: e.target.value })}
          style={{
            backgroundColor: theme.bg.base,
            borderColor: theme.border.base,
            color: theme.text.title,
          }}
        />
      </FilterBase>
      {operador === "entre" && (
        <FilterBase
          label="Data 2 (opcional)"
          icon={<Calendar size={16} />}
          htmlFor="data2-filter"
        >
          <input
            type="date"
            id="data2-filter"
            className="px-3 py-2 rounded border transition-colors w-full"
            value={data2 || ""}
            onChange={(e) => onChange({ data2: e.target.value })}
            style={{
              backgroundColor: theme.bg.base,
              borderColor: theme.border.base,
              color: theme.text.title,
            }}
          />
        </FilterBase>
      )}
    </div>
  );
};

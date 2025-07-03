import Select from "react-select";
import { Calendar } from "lucide-react";
import { useSelectTheme } from "@/shared/hooks/useSelectTheme";
import { useTheme } from "@/shared/context/ThemeContext";
import { FilterBase } from "./FilterBase";

const periodoOptions = [
  { value: "", label: "Todos" },
  { value: "Hoje", label: "Hoje" },
  { value: "Esta Semana", label: "Esta Semana" },
  { value: "Este Mês", label: "Este Mês" },
  { value: "Filtro Avançado", label: "Filtro Avançado" },
];

interface PeriodoFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const PeriodoFilter = ({ value, onChange }: PeriodoFilterProps) => {
  const selectTheme = useSelectTheme();
  const { theme } = useTheme();

  return (
    <FilterBase
      label="Período (Data de Criação)"
      icon={<Calendar size={16} />}
      htmlFor="periodo-filter"
    >
      <Select
        inputId="periodo-filter"
        classNamePrefix="react-select"
        options={periodoOptions}
        value={
          periodoOptions.find((opt) => opt.value === value) || periodoOptions[0]
        }
        onChange={(opt) => onChange(opt?.value || "")}
        theme={selectTheme}
        isClearable
        placeholder="Todos"
        styles={{
          control: (base) => ({
            ...base,
            paddingLeft: 0,
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
            color: state.isSelected ? theme.text.inverse : theme.text.subtitle,
          }),
        }}
      />
    </FilterBase>
  );
};

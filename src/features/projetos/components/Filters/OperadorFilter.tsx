import Select from "react-select";
import { useTheme } from "@/shared/context/ThemeContext";
import { useSelectTheme } from "@/shared/hooks/useSelectTheme";
import { FilterBase } from "./FilterBase";
import { Filter } from "lucide-react";

const options = [
  { value: "eq", label: "Igual" },
  { value: "neq", label: "Diferente" },
  { value: "between", label: "Entre" },
];

interface OperadorFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const OperadorFilter = ({ value, onChange }: OperadorFilterProps) => {
  const selectTheme = useSelectTheme();
  const { theme } = useTheme();
  return (
    <FilterBase
      label="Operador"
      icon={<Filter size={16} />}
      htmlFor="operador-filter"
    >
      <Select
        inputId="operador-filter"
        classNamePrefix="react-select"
        options={options}
        value={options.find((opt) => opt.value === value) || null}
        onChange={(opt) => onChange(opt?.value || "")}
        placeholder="Selecione um operador"
        isClearable
        theme={selectTheme}
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

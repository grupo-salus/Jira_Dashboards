import Select from "react-select";
import { Users } from "lucide-react";
import { useSelectTheme } from "@/shared/hooks/useSelectTheme";
import { useTheme } from "@/shared/context/ThemeContext";
import { FilterBase } from "./FilterBase";

const grupoOptions = [
  { value: "TI", label: "TI" },
  { value: "Financeiro", label: "Financeiro" },
  { value: "Comercial", label: "Comercial" },
  { value: "Vendas", label: "Vendas" },
  { value: "RH", label: "RH" },
  { value: "Operações", label: "Operações" },
];

interface GrupoSolicitanteFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const GrupoSolicitanteFilter = ({
  value,
  onChange,
}: GrupoSolicitanteFilterProps) => {
  const selectTheme = useSelectTheme();
  const { theme } = useTheme();
  return (
    <FilterBase
      label="Grupo Solicitante"
      icon={<Users size={16} />}
      htmlFor="grupo-solicitante-filter"
    >
      <Select
        inputId="grupo-solicitante-filter"
        classNamePrefix="react-select"
        options={grupoOptions}
        value={grupoOptions.filter((opt) => value?.includes(opt.value))}
        onChange={(opts) => onChange(opts ? opts.map((o) => o.value) : [])}
        theme={selectTheme}
        isMulti
        isClearable
        placeholder="Todos"
        closeMenuOnSelect={false}
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
          multiValue: (base) => ({ ...base, backgroundColor: theme.bg.muted }),
          multiValueLabel: (base) => ({ ...base, color: theme.text.subtitle }),
          multiValueRemove: (base) => ({
            ...base,
            color: "#ef4444",
            ":hover": { backgroundColor: "#fee2e2", color: "#ef4444" },
          }),
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

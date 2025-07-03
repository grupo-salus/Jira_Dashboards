import Select from "react-select";
import { ListChecks } from "lucide-react";
import { useSelectTheme } from "@/shared/hooks/useSelectTheme";
import { useTheme } from "@/shared/context/ThemeContext";
import { FilterBase } from "./FilterBase";

const statusOptions = [
  { value: "Em andamento", label: "Em andamento" },
  { value: "Concluído", label: "Concluído" },
  { value: "Aguardando", label: "Aguardando" },
  { value: "Cancelado", label: "Cancelado" },
  { value: "Backlog", label: "Backlog" },
  { value: "Backlog Priorizado", label: "Backlog Priorizado" },
  { value: "Bloqueado", label: "Bloqueado" },
  { value: "Em Homologação", label: "Em Homologação" },
  { value: "Operação Assistida", label: "Operação Assistida" },
];

interface StatusFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  const selectTheme = useSelectTheme();
  const { theme } = useTheme();
  return (
    <FilterBase
      label="Status"
      icon={<ListChecks size={16} />}
      htmlFor="status-filter"
    >
      <Select
        inputId="status-filter"
        classNamePrefix="react-select"
        options={statusOptions}
        value={statusOptions.filter((opt) => value?.includes(opt.value))}
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

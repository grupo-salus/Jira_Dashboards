import Select from "react-select";
import { Flag } from "lucide-react";
import { useSelectTheme } from "@/shared/hooks/useSelectTheme";
import { useTheme } from "@/shared/context/ThemeContext";
import { FilterBase, getUniqueOptions } from "./FilterBase";

interface PrioridadeFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  projetos: any[];
}

export const PrioridadeFilter = ({
  value,
  onChange,
  projetos,
}: PrioridadeFilterProps) => {
  const selectTheme = useSelectTheme();
  const { theme } = useTheme();

  // Extrai prioridades únicas do campo 'Prioridade' dos projetos
  const prioridadeOptions = getUniqueOptions(projetos, "Prioridade").map(
    (prioridade) => ({ value: prioridade, label: prioridade })
  );

  return (
    <FilterBase
      label="Prioridade"
      icon={<Flag size={16} />}
      htmlFor="prioridade-filter"
    >
      <Select
        inputId="prioridade-filter"
        classNamePrefix="react-select"
        options={prioridadeOptions}
        value={prioridadeOptions.filter((opt) => value?.includes(opt.value))}
        onChange={(opts) => onChange(opts ? opts.map((o) => o.value) : [])}
        theme={selectTheme}
        isMulti
        isClearable
        placeholder="Todas"
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
            color: theme.text.subtitle,
            ":hover": {
              backgroundColor: theme.bg.muted,
              color: theme.text.title,
            },
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

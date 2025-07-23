import Select from "react-select";
import { Users } from "lucide-react";
import { useSelectTheme } from "@/shared/hooks/useSelectTheme";
import { useTheme } from "@/shared/context/ThemeContext";
import { FilterBase, getUniqueOptions } from "./FilterBase";

interface SquadFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  projetos: Record<string, unknown>[];
}

export const SquadFilter = ({
  value,
  onChange,
  projetos,
}: SquadFilterProps) => {
  const selectTheme = useSelectTheme();
  const { theme } = useTheme();

  // Extrai squads únicos do campo 'Squad' dos projetos
  const squadOptions = getUniqueOptions(projetos, "Squad").map((squad) => ({
    value: squad,
    label: squad,
  }));

  return (
    <FilterBase label="Squad" icon={<Users size={16} />} htmlFor="squad-filter">
      <Select
        inputId="squad-filter"
        classNamePrefix="react-select"
        options={squadOptions}
        value={squadOptions.filter((opt) =>
          value?.includes(opt.value as string)
        )}
        onChange={(opts) =>
          onChange(opts ? opts.map((o) => o.value as string) : [])
        }
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

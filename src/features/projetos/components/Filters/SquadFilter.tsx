import Select from "react-select";
import { Users } from "lucide-react";
import { useSelectTheme } from "@/shared/hooks/useSelectTheme";
import { useTheme } from "@/shared/context/ThemeContext";
import { FilterBase } from "./FilterBase";

const squadOptions = [
  { value: "Squad Alpha", label: "Squad Alpha" },
  { value: "Squad Beta", label: "Squad Beta" },
  { value: "Squad Gamma", label: "Squad Gamma" },
  { value: "Squad Delta", label: "Squad Delta" },
  { value: "Squad Echo", label: "Squad Echo" },
  { value: "Squad Foxtrot", label: "Squad Foxtrot" },
  { value: "Squad Golf", label: "Squad Golf" },
  { value: "Squad Hotel", label: "Squad Hotel" },
];

interface SquadFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const SquadFilter = ({ value, onChange }: SquadFilterProps) => {
  const selectTheme = useSelectTheme();
  const { theme } = useTheme();
  return (
    <FilterBase label="Squad" icon={<Users size={16} />} htmlFor="squad-filter">
      <Select
        inputId="squad-filter"
        classNamePrefix="react-select"
        options={squadOptions}
        value={squadOptions.filter((opt) => value?.includes(opt.value))}
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

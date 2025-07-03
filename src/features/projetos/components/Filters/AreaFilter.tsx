import Select from "react-select";
import { Building2 } from "lucide-react";
import { useSelectTheme } from "@/shared/hooks/useSelectTheme";
import { useTheme } from "@/shared/context/ThemeContext";
import { FilterBase } from "./FilterBase";

const areaOptions = [
  { value: "Desenvolvimento", label: "Desenvolvimento" },
  { value: "Infraestrutura", label: "Infraestrutura" },
  { value: "Segurança", label: "Segurança" },
  { value: "Dados", label: "Dados" },
  { value: "UX/UI", label: "UX/UI" },
  { value: "DevOps", label: "DevOps" },
  { value: "QA", label: "QA" },
  { value: "Produto", label: "Produto" },
];

interface AreaFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const AreaFilter = ({ value, onChange }: AreaFilterProps) => {
  const selectTheme = useSelectTheme();
  const { theme } = useTheme();
  return (
    <FilterBase
      label="Área"
      icon={<Building2 size={16} />}
      htmlFor="area-filter"
    >
      <Select
        inputId="area-filter"
        classNamePrefix="react-select"
        options={areaOptions}
        value={areaOptions.filter((opt) => value?.includes(opt.value))}
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

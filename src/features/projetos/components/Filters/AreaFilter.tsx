import Select from "react-select";
import { Building2 } from "lucide-react";
import { useSelectTheme } from "@/shared/hooks/useSelectTheme";
import { useTheme } from "@/shared/context/ThemeContext";
import { FilterBase, getUniqueOptions } from "./FilterBase";

interface AreaFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  projetos: Record<string, unknown>[];
}

export const AreaFilter = ({ value, onChange, projetos }: AreaFilterProps) => {
  const selectTheme = useSelectTheme();
  const { theme } = useTheme();

  // Extrai áreas únicas do campo 'Area' dos projetos
  const areaOptions = getUniqueOptions(projetos, "Area").map((area) => ({
    value: area,
    label: area,
  }));

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
        value={areaOptions.filter((opt) =>
          value?.includes(opt.value as string)
        )}
        onChange={(opts) =>
          onChange(opts ? opts.map((o) => o.value as string) : [])
        }
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

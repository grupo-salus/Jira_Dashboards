import Select from "react-select";
import { Users2 } from "lucide-react";
import { useSelectTheme } from "@/shared/hooks/useSelectTheme";
import { useTheme } from "@/shared/context/ThemeContext";
import { FilterBase, getUniqueOptions } from "./FilterBase";

interface GrupoSolicitanteFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  projetos: Record<string, unknown>[];
}

export const GrupoSolicitanteFilter = ({
  value,
  onChange,
  projetos,
}: GrupoSolicitanteFilterProps) => {
  const selectTheme = useSelectTheme();
  const { theme } = useTheme();

  // Extrai grupos solicitantes únicos do campo 'Grupo Solicitante' dos projetos
  const grupoOptions = getUniqueOptions(projetos, "Grupo Solicitante").map(
    (grupo) => ({ value: grupo, label: grupo })
  );

  return (
    <FilterBase
      label="Grupo Solicitante"
      icon={<Users2 size={16} />}
      htmlFor="grupo-solicitante-filter"
    >
      <Select
        inputId="grupo-solicitante-filter"
        classNamePrefix="react-select"
        options={grupoOptions}
        value={grupoOptions.filter((opt) => value?.includes(opt.value as string))}
        onChange={(opts) => onChange(opts ? opts.map((o) => o.value as string) : [])}
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

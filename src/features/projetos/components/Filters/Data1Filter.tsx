import { useTheme } from "@/shared/context/ThemeContext";
import { FilterBase } from "./FilterBase";
import { Calendar } from "lucide-react";

interface Data1FilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const Data1Filter = ({ value, onChange }: Data1FilterProps) => {
  const { theme } = useTheme();
  return (
    <FilterBase
      label="Data 1"
      icon={<Calendar size={16} />}
      htmlFor="data1-filter"
    >
      <input
        type="date"
        id="data1-filter"
        className="w-full border focus:outline-none transition-colors duration-200 rounded-md"
        style={{
          backgroundColor: theme.bg.base,
          borderColor: theme.border.base,
          color: theme.text.subtitle,
          height: 40,
          paddingLeft: 12,
          paddingRight: 12,
          borderWidth: 1,
          boxShadow: "none",
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="dd/mm/aaaa"
      />
    </FilterBase>
  );
};

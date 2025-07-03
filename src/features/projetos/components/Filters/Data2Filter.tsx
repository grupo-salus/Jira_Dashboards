import { useTheme } from "@/shared/context/ThemeContext";
import { FilterBase } from "./FilterBase";
import { Calendar } from "lucide-react";
import { useState } from "react";

interface Data2FilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const Data2Filter = ({ value, onChange }: Data2FilterProps) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const borderColor =
    isFocused || isHovered ? theme.brand.primary : theme.border.base;
  return (
    <FilterBase
      label="Data 2 (opcional)"
      icon={<Calendar size={16} />}
      htmlFor="data2-filter"
    >
      <input
        type="date"
        id="data2-filter"
        className="w-full border focus:outline-none transition-colors duration-200 rounded-md"
        style={{
          backgroundColor: theme.bg.base,
          borderColor,
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </FilterBase>
  );
};

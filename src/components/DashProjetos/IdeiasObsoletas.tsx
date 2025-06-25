import React from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";
import {
  themeColors,
  getTextColor,
  getBackgroundColor,
  getBorderColor,
} from "../../utils/themeColors";

interface IdeiasObsoletasProps {
  data: EspacoDeProjetos[];
}

const IdeiasObsoletas: React.FC<IdeiasObsoletasProps> = ({ data }) => {
  // Hook para detectar o tema atual
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">(
    "light"
  );

  React.useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setCurrentTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const obsoletas = data.filter(
    (item) =>
      item["Status de ideação"] === "Obsoleto" &&
      item["Dias desde criação"] != null &&
      item["Dias desde criação"] > 30
  );

  if (obsoletas.length === 0) {
    return null;
  }

  return (
    <div
      className="border-l-4 p-6 rounded-r-lg my-6"
      style={{
        backgroundColor: getBackgroundColor("hover", currentTheme),
        borderLeftColor: themeColors.warning[400],
      }}
    >
      <div className="flex items-center">
        <svg
          className="w-6 h-6 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: themeColors.warning[600] }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3
          className="font-bold text-lg"
          style={{ color: getTextColor("warning", currentTheme) }}
        >
          Ideias Obsoletas ({obsoletas.length})
        </h3>
      </div>
      <p
        className="text-sm mt-2 ml-9"
        style={{ color: getTextColor("warning", currentTheme) }}
      >
        As seguintes ideias não são atualizadas há mais de 30 dias e podem
        precisar de revisão ou arquivamento.
      </p>
      <ul className="mt-4 ml-9 list-disc list-inside space-y-1">
        {obsoletas.map((item) => (
          <li
            key={item.ID}
            className="text-sm"
            style={{ color: getTextColor("primary", currentTheme) }}
          >
            <span className="font-semibold">{item.Chave}:</span> {item.Título}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IdeiasObsoletas;

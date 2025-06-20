import React from "react";
import { EspacoDeProjetos } from "../../types/Typesjira";

interface IdeiasObsoletasProps {
  data: EspacoDeProjetos[];
}

const IdeiasObsoletas: React.FC<IdeiasObsoletasProps> = ({ data }) => {
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
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r-lg my-6">
      <div className="flex items-center">
        <svg
          className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="font-bold text-lg text-yellow-800 dark:text-yellow-200">
          Ideias Obsoletas ({obsoletas.length})
        </h3>
      </div>
      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 ml-9">
        As seguintes ideias não são atualizadas há mais de 30 dias e podem
        precisar de revisão ou arquivamento.
      </p>
      <ul className="mt-4 ml-9 list-disc list-inside space-y-1">
        {obsoletas.map((item) => (
          <li
            key={item.ID}
            className="text-sm text-gray-800 dark:text-gray-200"
          >
            <span className="font-semibold">{item.Chave}:</span> {item.Título}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IdeiasObsoletas;

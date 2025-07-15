import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { getCamposObrigatoriosSecao, temCamposObrigatorios } from "./constants";

interface Section {
  id: number;
  title: string;
  icon: React.ElementType;
}

interface FormSidebarProps {
  sections: Section[];
  currentSection: number;
  setCurrentSection: (id: number) => void;
  formData: Record<string, any>;
  campos: any[];
  getFieldInfo: (key: string, originalLabel: string) => any;
}

const FormSidebar: React.FC<FormSidebarProps> = ({
  sections,
  currentSection,
  setCurrentSection,
  formData,
  campos,
  getFieldInfo,
}) => {
  // Função para verificar se uma seção está completa (apenas campos obrigatórios)
  const isSecaoCompleta = (sectionId: number): boolean => {
    const camposObrigatorios = getCamposObrigatoriosSecao(sectionId);

    // Se não há campos obrigatórios na seção, considera completa
    if (camposObrigatorios.length === 0) {
      return true;
    }

    // Verifica se todos os campos obrigatórios estão preenchidos
    return camposObrigatorios.every((campoKey) => {
      const valor = formData[campoKey];
      return (
        valor &&
        (typeof valor === "string" ? valor.trim() !== "" : true) &&
        (Array.isArray(valor) ? valor.length > 0 : true)
      );
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Seções
      </h3>
      <nav className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const temObrigatorios = temCamposObrigatorios(section.id);
          const estaCompleta = temObrigatorios
            ? isSecaoCompleta(section.id)
            : true;

          return (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                currentSection === section.id
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{section.title}</span>
              </div>

              {/* Ícone de status */}
              {temObrigatorios && (
                <div className="flex-shrink-0">
                  {estaCompleta ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default FormSidebar;

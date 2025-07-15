import React from "react";

interface Section {
  id: number;
  title: string;
  icon: React.ElementType;
}

interface FormSidebarProps {
  sections: Section[];
  currentSection: number;
  setCurrentSection: (id: number) => void;
}

const FormSidebar: React.FC<FormSidebarProps> = ({ sections, currentSection, setCurrentSection }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seções</h3>
      <nav className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentSection === section.id
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">{section.title}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default FormSidebar; 
import React from "react";
import { DepartmentInfo } from "../../types/backlog";
import { chartColors } from "../../utils/colors";

interface DepartmentProjectsProps {
  departments: Record<string, DepartmentInfo>;
}

const DepartmentProjects: React.FC<DepartmentProjectsProps> = ({
  departments,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-primary-700 dark:text-primary-300">
        Projetos por Departamento
      </h2>
      <div className="space-y-6">
        {Object.entries(departments).map(([department, info], idx) => (
          <div
            key={department}
            className="border rounded-lg p-4 bg-primary-50 dark:bg-gray-900"
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-lg font-medium"
                style={{ color: chartColors[idx % chartColors.length] }}
              >
                {department}
              </h3>
              <span className="text-sm text-gray-500">
                {info.total_projetos} projetos
              </span>
            </div>

            <div className="space-y-4">
              {info.projetos.map((project, i) => (
                <div
                  key={project.epico}
                  className="pl-4 border-l-2 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <h4
                      className="font-medium"
                      style={{ color: chartColors[i % chartColors.length] }}
                    >
                      {project.epico}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {project.total_cards} cards
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    {project.cards.slice(0, 3).map((card) => (
                      <div
                        key={card.Chave}
                        className="text-sm text-gray-600 dark:text-gray-300"
                      >
                        <span className="font-medium text-primary-700 dark:text-primary-300">
                          {card.Chave}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{card.Título}</span>
                        <span className="ml-2 text-gray-500">
                          ({card["Dias no Backlog"]} dias)
                        </span>
                      </div>
                    ))}
                    {project.cards.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{project.cards.length - 3} cards...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentProjects;

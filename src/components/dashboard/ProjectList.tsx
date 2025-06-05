import React from "react";
import { Project } from "../../types/backlog";
import { chartColors } from "../../utils/colors";

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-primary-700 dark:text-primary-300">
        Projetos/Épicos
      </h2>
      <div className="space-y-4">
        {projects.map((project, idx) => (
          <div
            key={project.epico}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-primary-50 dark:bg-gray-900"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3
                  className="text-lg font-medium"
                  style={{ color: chartColors[idx % chartColors.length] }}
                >
                  {project.epico}
                </h3>
                <p className="text-sm text-gray-500">
                  {project.total_cards} cards • {project.estimativa_total_horas}
                  h estimadas
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {project.media_dias_backlog} dias médios
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">
                Distribuição por Prioridade
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(project.prioridade_distribuicao).map(
                  ([prioridade, quantidade], i) => (
                    <span
                      key={prioridade}
                      className="inline-block px-2 py-1 text-xs rounded-full"
                      style={{
                        background: chartColors[i % chartColors.length],
                        color: "#fff",
                      }}
                    >
                      {prioridade}: {quantidade}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Cards Recentes</h4>
              <div className="space-y-2">
                {project.cards.slice(0, 3).map((card) => (
                  <div key={card.Chave} className="text-sm">
                    <span className="font-medium text-primary-700 dark:text-primary-300">
                      {card.Chave}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {card.Título}
                    </span>
                    <span className="ml-2 text-gray-500">
                      ({card["Dias no Backlog"]} dias)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;

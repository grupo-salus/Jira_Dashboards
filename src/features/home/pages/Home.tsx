// src/features/home/pages/Home.tsx
import { useTheme } from "@/shared/context/ThemeContext";
import { Link } from "react-router-dom";
import { BarChart3, Users, GitBranch } from "lucide-react";

export const Home = () => {
  const { theme } = useTheme();

  const dashboards = [
    {
      title: "Dashboard de Projetos",
      description:
        "Visualize o progresso de todos os projetos com gráficos, tabelas e Kanban boards",
      icon: <BarChart3 size={24} />,
      path: "/projetos",
    },
    {
      title: "Sprint Ativa",
      description:
        "Acompanhe a sprint atual do desenvolvimento com burndown charts e velocity",
      icon: <GitBranch size={24} />,
      path: "/sprints",
    },
    {
      title: "Tasks TI",
      description: "Monitore atividades e demandas da equipe de tecnologia",
      icon: <Users size={24} />,
      path: "/ti",
    },
  ];

  return (
    <div
      className="min-h-screen px-6 py-12"
      style={{ backgroundColor: theme.bg.base }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Version Badge */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: theme.bg.muted,
              color: theme.text.subtitle,
              border: `1px solid ${theme.border.base}`,
            }}
          >
            v0.1.0
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-16">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: theme.text.title }}
          >
            Dashboards Jira
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: theme.text.subtitle }}
          >
            Visualize projetos, acompanhe sprints e monitore atividades da
            equipe de TI
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {dashboards.map((dashboard, index) => (
            <Link key={index} to={dashboard.path} className="group block">
              <div
                className="p-6 rounded-xl transition-all duration-200 hover:shadow-lg h-full"
                style={{
                  backgroundColor: theme.bg.surface,
                  border: `1px solid ${theme.border.base}`,
                }}
              >
                <div
                  className="p-3 rounded-lg mb-4 w-fit"
                  style={{ backgroundColor: theme.bg.muted }}
                >
                  <div style={{ color: theme.brand.primary }}>
                    {dashboard.icon}
                  </div>
                </div>

                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: theme.text.title }}
                >
                  {dashboard.title}
                </h3>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: theme.text.subtitle }}
                >
                  {dashboard.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

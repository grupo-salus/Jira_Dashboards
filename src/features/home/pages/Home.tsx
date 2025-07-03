// src/features/home/pages/Home.tsx
import { useTheme } from "@/shared/context/ThemeContext";
import { Link } from "react-router-dom";
import { BarChart3, Users, ArrowRight, Zap, GitBranch } from "lucide-react";

export const Home = () => {
  const { theme } = useTheme();

  const dashboards = [
    {
      title: "Status Report de Projetos",
      description:
        "Visualize o progresso de todos os projetos com gráficos, tabelas e Kanban boards",
      icon: <BarChart3 size={32} />,
      path: "/projetos",
    },
    {
      title: "Sprint Ativa",
      description:
        "Acompanhe a sprint atual do desenvolvimento com burndown charts e velocity",
      icon: <GitBranch size={32} />,
      path: "/sprints",
    },
    {
      title: "Tasks TI",
      description: "Monitore atividades e demandas da equipe de tecnologia",
      icon: <Users size={32} />,
      path: "/ti",
    },
  ];

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ backgroundColor: theme.bg.base }}
    >
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-16">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: theme.bg.muted,
              color: theme.text.subtitle,
              border: `1px solid ${theme.border.base}`,
            }}
          >
            <Zap size={16} style={{ color: theme.brand.primary }} />
            <span className="text-sm font-medium">Dashboard Salus v2.0</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ color: theme.text.title }}
          >
            Aqui você verá{" "}
            <span
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme.brand.primary}, ${theme.brand.accent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Dashboards
            </span>
            <br />
            conectados ao Jira
          </h1>

          <p
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed"
            style={{ color: theme.text.subtitle }}
          >
            Visualize projetos, acompanhe sprints ativas e monitore atividades
            da equipe de TI com dados em tempo real do Jira.
          </p>
        </div>
      </section>

      {/* Dashboards Section */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: theme.text.title }}
        >
          Dashboards Disponíveis
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {dashboards.map((dashboard, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl flex flex-col h-full"
              style={{
                backgroundColor: theme.bg.surface,
                border: `1px solid ${theme.border.base}`,
              }}
            >
              {/* Card Content */}
              <div className="p-8 flex flex-col h-full">
                <div
                  className="p-4 rounded-xl mb-6 w-fit group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: theme.bg.muted }}
                >
                  <div style={{ color: theme.brand.primary }}>
                    {dashboard.icon}
                  </div>
                </div>

                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: theme.text.title }}
                >
                  {dashboard.title}
                </h3>

                <p
                  className="text-lg leading-relaxed mb-6 flex-grow"
                  style={{ color: theme.text.subtitle }}
                >
                  {dashboard.description}
                </p>

                {/* CTA Button */}
                <Link
                  to={dashboard.path}
                  className="block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:scale-105 mt-auto"
                  style={{
                    backgroundColor: theme.border.strong,
                    color: theme.text.inverse,
                  }}
                >
                  Acessar Dashboard
                  <ArrowRight size={18} className="inline ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

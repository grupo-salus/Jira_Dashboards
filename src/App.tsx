import React from "react";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import DashBacklog from "./pages/dashbacklog";
import SprintDashboard from "./pages/SprintDashboard.tsx";
import { ThemeProvider } from "./context/ThemeContext";
import { BacklogProvider } from "./context/BacklogContext";
import { useBacklog } from "./context/BacklogContext";

// Configuração do intervalo de atualização automática dos dados
// Valor em milissegundos (1 hora = 3600000ms)
const UPDATE_INTERVAL_MS = 3600000;

// Componente interno que usa o contexto
const AppContent: React.FC = () => {
  // Estado para controlar a visualização atual (home, backlog ou sprint)
  const [currentView, setCurrentView] = React.useState<
    "home" | "backlog" | "sprint"
  >("home");

  // Estado para forçar atualização dos componentes quando necessário
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Estado para armazenar o timestamp da última atualização
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());

  // Hook para acessar o contexto do backlog
  const { refreshData } = useBacklog();

  // Função para atualizar os dados e o timestamp
  const handleRefresh = async () => {
    await refreshData(); // Atualiza os dados do backlog
    setRefreshKey((k) => k + 1);
    setLastUpdate(new Date());
  };

  // Efeito para configurar a atualização automática periódica
  React.useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, UPDATE_INTERVAL_MS);
    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Barra de navegação com controles de visualização e atualização */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        showHomeLink
      />
      {/* Área principal que renderiza o componente apropriado baseado na visualização atual */}
      <main className="dashboard-container">
        {currentView === "home" ? (
          <Home />
        ) : currentView === "backlog" ? (
          <DashBacklog key={refreshKey} />
        ) : (
          <SprintDashboard key={refreshKey} />
        )}
      </main>
    </div>
  );
};

// Componente principal que fornece o contexto
function App() {
  return (
    <ThemeProvider>
      <BacklogProvider>
        <AppContent />
      </BacklogProvider>
    </ThemeProvider>
  );
}

export default App;

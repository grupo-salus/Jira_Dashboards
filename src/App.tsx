import React from 'react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import DashBacklog from './pages/dashbacklog';
import SprintDashboard from './pages/SprintDashboard.tsx';
import { ThemeProvider } from './context/ThemeContext';

// Configuração do intervalo de atualização automática dos dados
// Valor em milissegundos (1 hora = 3600000ms)
const UPDATE_INTERVAL_MS = 3600000;

function App() {
  // Estado para controlar a visualização atual (home, backlog ou sprint)
  const [currentView, setCurrentView] = React.useState<'home' | 'backlog' | 'sprint'>('home');
  
  // Estado para forçar atualização dos componentes quando necessário
  const [refreshKey, setRefreshKey] = React.useState(0);
  
  // Estado para armazenar o timestamp da última atualização
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());

  // Função para atualizar os dados e o timestamp
  const handleRefresh = () => {
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
    // Provider do tema para toda a aplicação
    <ThemeProvider>
      {/* Container principal com classes para tema claro/escuro */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Barra de navegação com controles de visualização e atualização */}
        <Navbar 
          currentView={currentView}
          onViewChange={setCurrentView}
          onRefresh={handleRefresh}
          showHomeLink
        />
        {/* Área principal que renderiza o componente apropriado baseado na visualização atual */}
        <main className="dashboard-container">
          {currentView === 'home' ? (
            <Home />
          ) : currentView === 'backlog' ? (
            <DashBacklog key={refreshKey} lastUpdate={lastUpdate} />
          ) : (
            <SprintDashboard key={refreshKey} lastUpdate={lastUpdate} />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App
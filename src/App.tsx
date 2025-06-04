import React from 'react';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/ThemeContext';

// Altere este valor para definir o intervalo de atualização automática (em milissegundos)
const UPDATE_INTERVAL_MS = 3600000; // 1 hora

function App() {
  const [currentView, setCurrentView] = React.useState<'backlog' | 'sprint'>('backlog');
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    setLastUpdate(new Date());
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, UPDATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar 
          currentView={currentView}
          onViewChange={setCurrentView}
          onRefresh={handleRefresh}
        />
        <main className="dashboard-container">
          <Dashboard view={currentView} key={refreshKey} lastUpdate={lastUpdate} />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App
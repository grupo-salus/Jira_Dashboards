import React from 'react';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [currentView, setCurrentView] = React.useState<'backlog' | 'sprint'>('backlog');

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar 
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <main className="dashboard-container">
          <Dashboard view={currentView} />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App
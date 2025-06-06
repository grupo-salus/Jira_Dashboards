import React from 'react';
import { Kanban, RefreshCw, Moon, Sun, Footprints as Sprint, Home as HomeIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  currentView: 'home' | 'backlog' | 'sprint';
  onViewChange: (view: 'home' | 'backlog' | 'sprint') => void;
  onRefresh?: () => void;
  showHomeLink?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange, onRefresh, showHomeLink }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img src="https://cdn.worldvectorlogo.com/logos/jira-1.svg" alt="Jira Logo" className="h-8 w-8 mr-2" />
              <span className="ml-2 text-xl font-semibold">JIRA Dashboard</span>
            </div>
            
            <div className="flex space-x-2">
              {showHomeLink && (
                <button
                  onClick={() => onViewChange('home')}
                  className={`px-4 py-2 rounded-md transition-colors font-semibold ${
                    currentView === 'home'
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <HomeIcon className="h-4 w-4" />
                    Home
                  </span>
                </button>
              )}
              <button
                onClick={() => onViewChange('backlog')}
                className={`px-4 py-2 rounded-md transition-colors font-semibold ${
                  currentView === 'backlog'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Kanban className="h-4 w-4" />
                  Backlog
                </span>
              </button>
              
              <button
                onClick={() => onViewChange('sprint')}
                className={`px-4 py-2 rounded-md transition-colors font-semibold ${
                  currentView === 'sprint'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sprint className="h-4 w-4" />
                  Sprint Ativa
                </span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="btn btn-secondary flex items-center gap-1" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 
                <Sun className="h-5 w-5" /> : 
                <Moon className="h-5 w-5" />
              }
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
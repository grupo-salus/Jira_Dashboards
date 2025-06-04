import React from 'react';
import { Kanban, RefreshCw, Search, Moon, Sun, Footprints as Sprint } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  currentView: 'backlog' | 'sprint';
  onViewChange: (view: 'backlog' | 'sprint') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Kanban className="h-7 w-7 text-primary-600 dark:text-primary-500" />
              <span className="ml-2 text-xl font-semibold">JIRA Dashboard</span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onViewChange('backlog')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentView === 'backlog'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
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
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentView === 'sprint'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
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
            <button className="btn btn-secondary flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
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
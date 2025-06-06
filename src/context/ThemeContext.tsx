import React, { createContext, useContext, useState, useEffect } from 'react';
import { themeColors } from '../utils/themeColors';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof themeColors;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: themeColors,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    
    const root = document.documentElement;
    Object.entries(themeColors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value);
    });
    
    root.style.setProperty('--color-success-500', themeColors.success);
    root.style.setProperty('--color-warning-500', themeColors.warning);
    root.style.setProperty('--color-error-500', themeColors.error);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
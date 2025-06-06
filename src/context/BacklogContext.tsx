import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchBacklogSummary } from '../api/api_jira';
import { BacklogSummary } from '../types/backlog';

interface BacklogContextType {
  data: BacklogSummary | null;
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  refreshData: () => Promise<void>;
}

const BacklogContext = createContext<BacklogContextType | undefined>(undefined);

export const BacklogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<BacklogSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await fetchBacklogSummary();
      setData(response);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados apenas na primeira vez
  useEffect(() => {
    if (!data) {
      refreshData();
    }
  }, []);

  return (
    <BacklogContext.Provider value={{ data, loading, error, lastUpdate, refreshData }}>
      {children}
    </BacklogContext.Provider>
  );
};

export const useBacklog = () => {
  const context = useContext(BacklogContext);
  if (context === undefined) {
    throw new Error('useBacklog deve ser usado dentro de um BacklogProvider');
  }
  return context;
}; 
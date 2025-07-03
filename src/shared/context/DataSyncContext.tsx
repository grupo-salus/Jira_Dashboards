import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface DataSyncContextType {
  refreshAllData: () => void;
  isRefreshing: boolean;
  lastRefresh: Date | null;
  enableAutoRefresh: (enabled: boolean) => void;
  isAutoRefreshEnabled: boolean;
}

const DataSyncContext = createContext<DataSyncContextType | undefined>(
  undefined
);

export const DataSyncProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false);
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshAllData = useCallback(() => {
    setIsRefreshing(true);
    setLastRefresh(new Date());

    // Simular um pequeno delay para mostrar o estado de loading
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const enableAutoRefresh = useCallback((enabled: boolean) => {
    setIsAutoRefreshEnabled(enabled);
    
    if (enabled) {
      // Limpar intervalo anterior se existir
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
      
      // Configurar novo intervalo (1 hora = 3600000 ms)
      autoRefreshIntervalRef.current = setInterval(() => {
        refreshAllData();
      }, 3600000);
      
      // Fazer refresh imediato
      refreshAllData();
    } else {
      // Limpar intervalo se desabilitado
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
        autoRefreshIntervalRef.current = null;
      }
    }
  }, [refreshAllData]);

  // Limpar intervalo quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, []);

  return (
    <DataSyncContext.Provider
      value={{
        refreshAllData,
        isRefreshing,
        lastRefresh,
        enableAutoRefresh,
        isAutoRefreshEnabled,
      }}
    >
      {children}
    </DataSyncContext.Provider>
  );
};

export const useDataSync = () => {
  const context = useContext(DataSyncContext);
  if (context === undefined) {
    throw new Error("useDataSync must be used within a DataSyncProvider");
  }
  return context;
};

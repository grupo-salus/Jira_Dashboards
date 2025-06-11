/**
 * JiraContext.tsx
 *
 * Este arquivo implementa o contexto global para dados do Jira que:
 * 1. Gerencia o estado dos dados do backlog e sprint
 * 2. Fornece funções para atualizar os dados
 * 3. Implementa cache local para melhor performance
 * 4. Controla o refresh automático dos dados
 *
 * Funcionalidades principais:
 * - Cache local com expiração de 1 hora
 * - Refresh automático periódico
 * - Gerenciamento de estado de loading e erros
 * - Métricas calculadas em tempo real
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchBacklogTable } from "../api/api_jira";
import { ResultApi } from "../types/jira";


interface JiraContextType {
  // Dados do Backlog
  backlogData: {
    rawData: ResultApi[];
    loading: boolean;
    error: string | null;
    lastUpdate: Date | null;
  };
  // Dados da Sprint (será implementado depois)
  sprintData: {
    rawData: any[];
    metrics: any;
    loading: boolean;
    error: string | null;
    lastUpdate: Date | null;
  };
  // Funções de atualização
  refreshBacklogData: () => Promise<void>;
  refreshSprintData: () => Promise<void>;
}

const CACHE_KEY = "jira_data_cache";
const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hora em milissegundos

interface CacheData {
  backlog: {
    rawData: ResultApi[];
    timestamp: number;
  };
  sprint: {
    rawData: any[];
    metrics: any;
    timestamp: number;
  };
}

export const JiraContext = createContext<JiraContextType>({
  backlogData: {
    rawData: [],
    loading: false,
    error: null,
    lastUpdate: null,
  },
  sprintData: {
    rawData: [],
    metrics: {},
    loading: false,
    error: null,
    lastUpdate: null,
  },
  refreshBacklogData: async () => {},
  refreshSprintData: async () => {},
});

export const useJira = () => useContext(JiraContext);

interface JiraProviderProps {
  children: ReactNode;
}

export const JiraProvider: React.FC<JiraProviderProps> = ({ children }) => {
  // Estado do Backlog
  const [backlogRawData, setBacklogRawData] = useState<ResultApi[]>([]);
  const [backlogLoading, setBacklogLoading] = useState(false);
  const [backlogError, setBacklogError] = useState<string | null>(null);
  const [backlogLastUpdate, setBacklogLastUpdate] = useState<Date | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Estado da Sprint (será implementado depois)
  const [sprintRawData, setSprintRawData] = useState<any[]>([]);
  const [sprintMetrics, setSprintMetrics] = useState<any>({});
  const [sprintLastUpdate, setSprintLastUpdate] = useState<Date | null>(null);

  const loadFromCache = (): boolean => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (!cachedData) return false;

      const { backlog, sprint } = JSON.parse(cachedData) as CacheData;

      // Verifica se o cache expirou
      const now = Date.now();
      const backlogExpired = now - backlog.timestamp > CACHE_EXPIRATION;
      const sprintExpired = now - sprint.timestamp > CACHE_EXPIRATION;

      if (!backlogExpired) {
        setBacklogRawData(backlog.rawData);
        setBacklogLastUpdate(new Date(backlog.timestamp));
      }

      if (!sprintExpired) {
        setSprintRawData(sprint.rawData);
        setSprintMetrics(sprint.metrics);
        setSprintLastUpdate(new Date(sprint.timestamp));
      }

      return !backlogExpired || !sprintExpired;
    } catch (error) {
      console.error("Erro ao carregar cache:", error);
      return false;
    }
  };

  const saveToCache = () => {
    try {
      const cacheData: CacheData = {
        backlog: {
          rawData: backlogRawData,
          timestamp: Date.now(),
        },
        sprint: {
          rawData: sprintRawData,
          metrics: sprintMetrics,
          timestamp: Date.now(),
        },
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Erro ao salvar cache:", error);
    }
  };

  const fetchBacklogData = async () => {
    try {
      setBacklogLoading(true);
      setBacklogError(null);

      const data = await fetchBacklogTable();

      setBacklogRawData(data);
      setBacklogLastUpdate(new Date());
      saveToCache();
    } catch (error) {
      setBacklogError(
        error instanceof Error
          ? error.message
          : "Erro ao carregar dados do backlog"
      );
      console.error("Erro ao buscar dados do backlog:", error);
    } finally {
      setBacklogLoading(false);
    }
  };

  const refreshBacklogData = async () => {
    await fetchBacklogData();
  };

  const refreshSprintData = async () => {
    // Será implementado depois
    console.log("Refresh sprint data - a ser implementado");
  };

  // Carrega dados iniciais apenas uma vez
  useEffect(() => {
    if (isInitialLoad) {
      if (!loadFromCache()) {
        fetchBacklogData();
      }
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  // Configura refresh automático a cada hora
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchBacklogData();
    }, CACHE_EXPIRATION);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <JiraContext.Provider
      value={{
        backlogData: {
          rawData: backlogRawData,
          loading: backlogLoading,
          error: backlogError,
          lastUpdate: backlogLastUpdate,
        },
        sprintData: {
          rawData: sprintRawData,
          metrics: sprintMetrics,
          loading: false,
          error: null,
          lastUpdate: sprintLastUpdate,
        },
        refreshBacklogData,
        refreshSprintData,
      }}
    >
      {children}
    </JiraContext.Provider>
  );
};

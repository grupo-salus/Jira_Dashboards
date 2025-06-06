import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchBacklogTable } from "../api/api_jira";
import { BacklogItem, BacklogBasicMetrics } from "../types/backlog";
import { calculateBacklogMetrics } from "../utils/backlogMetrics";

interface JiraContextType {
  // Dados do Backlog
  backlogData: {
    rawData: BacklogItem[];
    metrics: {
      basic: BacklogBasicMetrics;
    };
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
    rawData: BacklogItem[];
    metrics: {
      basic: BacklogBasicMetrics;
    };
    timestamp: number;
  };
  sprint: {
    rawData: any[];
    metrics: any;
    timestamp: number;
  };
}

const defaultBacklogMetrics = {
  basic: {
    total_cards: 0,
    total_epicos: 0,
    idade_media_dias: 0,
    card_mais_antigo: {
      chave: "",
      titulo: "",
      dias: 0,
      epico: null,
    },
    primeiro_projeto: null,
  },
};

export const JiraContext = createContext<JiraContextType>({
  backlogData: {
    rawData: [],
    metrics: defaultBacklogMetrics,
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
  const [backlogRawData, setBacklogRawData] = useState<BacklogItem[]>([]);
  const [backlogMetrics, setBacklogMetrics] = useState<{
    basic: BacklogBasicMetrics;
  }>(defaultBacklogMetrics);
  const [backlogLoading, setBacklogLoading] = useState(false);
  const [backlogError, setBacklogError] = useState<string | null>(null);
  const [backlogLastUpdate, setBacklogLastUpdate] = useState<Date | null>(null);

  // Estado da Sprint (será implementado depois)
  const [sprintRawData, setSprintRawData] = useState<any[]>([]);
  const [sprintMetrics, setSprintMetrics] = useState<any>({});
  const [sprintLoading, setSprintLoading] = useState(false);
  const [sprintError, setSprintError] = useState<string | null>(null);
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
        setBacklogMetrics(backlog.metrics);
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
          metrics: backlogMetrics,
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
      const calculatedMetrics = calculateBacklogMetrics(data);

      setBacklogRawData(data);
      setBacklogMetrics(calculatedMetrics);
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

  // Carrega dados iniciais
  useEffect(() => {
    if (!loadFromCache()) {
      fetchBacklogData();
    }
  }, []);

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
          metrics: backlogMetrics,
          loading: backlogLoading,
          error: backlogError,
          lastUpdate: backlogLastUpdate,
        },
        sprintData: {
          rawData: sprintRawData,
          metrics: sprintMetrics,
          loading: sprintLoading,
          error: sprintError,
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

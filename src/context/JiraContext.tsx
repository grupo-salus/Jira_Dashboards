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
import {
  fetchAcompanhamentoTI,
  fetchEspacoDeProjetos,
  fetchOpcoesCampoCustomizado,
} from "../api/api_jira";
import { AcompanhamentoTI, EspacoDeProjetos } from "../types/Typesjira";

interface JiraContextType {
  // Dados do Espaço de Projetos
  projetosData: {
    rawData: EspacoDeProjetos[];
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
  // Dados do acompanhamento TI
  acompanhamentoTIData: {
    rawData: AcompanhamentoTI[];
    loading: boolean;
    error: string | null;
    lastUpdate: Date | null;
  };
  // Opções do campo customizado Departamento Solicitante
  opcoesDepartamentoSolicitante: {
    options: string[];
    loading: boolean;
    error: string | null;
    lastUpdate: Date | null;
  };
  // Funções de atualização
  refreshProjetosData: () => Promise<void>;
  refreshSprintData: () => Promise<void>;
  refreshAcompanhamentoTIData: () => Promise<void>;
  refreshOpcoesDepartamentoSolicitante: () => Promise<void>;
}

const CACHE_KEY = "jira_data_cache";
const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hora em milissegundos

interface CacheData {
  projetos: {
    rawData: EspacoDeProjetos[];
    timestamp: number;
  };
  sprint: {
    rawData: any[];
    metrics: any;
    timestamp: number;
  };
}

export const JiraContext = createContext<JiraContextType>({
  projetosData: {
    rawData: [],
    loading: true,
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
  acompanhamentoTIData: {
    rawData: [],
    loading: true,
    error: null,
    lastUpdate: null,
  },
  opcoesDepartamentoSolicitante: {
    options: [],
    loading: true,
    error: null,
    lastUpdate: null,
  },
  refreshProjetosData: async () => {},
  refreshSprintData: async () => {},
  refreshAcompanhamentoTIData: async () => {},
  refreshOpcoesDepartamentoSolicitante: async () => {},
});

export const useJira = () => useContext(JiraContext);

interface JiraProviderProps {
  children: ReactNode;
}

export const JiraProvider: React.FC<JiraProviderProps> = ({ children }) => {
  // Estado do Espaço de Projetos
  const [projetosRawData, setProjetosRawData] = useState<EspacoDeProjetos[]>(
    []
  );
  const [projetosLoading, setProjetosLoading] = useState(true);
  const [projetosError, setProjetosError] = useState<string | null>(null);
  const [projetosLastUpdate, setProjetosLastUpdate] = useState<Date | null>(
    null
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Estado da Sprint (será implementado depois)
  const [sprintRawData, setSprintRawData] = useState<any[]>([]);
  const [sprintMetrics, setSprintMetrics] = useState<any>({});
  const [sprintLastUpdate, setSprintLastUpdate] = useState<Date | null>(null);

  // Estado do acompanhamento TI
  const [acompanhamentoTIData, setAcompanhamentoTIData] = useState<
    AcompanhamentoTI[]
  >([]);
  const [acompanhamentoTILoading, setAcompanhamentoTILoading] = useState(true);
  const [acompanhamentoTIError, setAcompanhamentoTIError] = useState<
    string | null
  >(null);
  const [acompanhamentoTILastUpdate, setAcompanhamentoTILastUpdate] =
    useState<Date | null>(null);

  // Estado das opções do campo customizado Departamento Solicitante
  const [opcoesDepartamentoSolicitante, setOpcoesDepartamentoSolicitante] =
    useState<string[]>([]);
  const [
    opcoesDepartamentoSolicitanteLoading,
    setOpcoesDepartamentoSolicitanteLoading,
  ] = useState(true);
  const [
    opcoesDepartamentoSolicitanteError,
    setOpcoesDepartamentoSolicitanteError,
  ] = useState<string | null>(null);
  const [
    opcoesDepartamentoSolicitanteLastUpdate,
    setOpcoesDepartamentoSolicitanteLastUpdate,
  ] = useState<Date | null>(null);

  const loadFromCache = (): boolean => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (!cachedData) return false;

      const { projetos, sprint } = JSON.parse(cachedData) as CacheData;

      // Verifica se o cache expirou
      const now = Date.now();
      const projetosExpired = now - projetos.timestamp > CACHE_EXPIRATION;
      const sprintExpired = now - sprint.timestamp > CACHE_EXPIRATION;

      if (!projetosExpired) {
        setProjetosRawData(projetos.rawData);
        setProjetosLastUpdate(new Date(projetos.timestamp));
      }

      if (!sprintExpired) {
        setSprintRawData(sprint.rawData);
        setSprintMetrics(sprint.metrics);
        setSprintLastUpdate(new Date(sprint.timestamp));
      }

      return !projetosExpired || !sprintExpired;
    } catch (error) {
      console.error("Erro ao carregar cache:", error);
      return false;
    }
  };

  const saveToCache = () => {
    try {
      const cacheData: CacheData = {
        projetos: {
          rawData: projetosRawData,
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

  const fetchProjetosData = async () => {
    try {
      setProjetosLoading(true);
      setProjetosError(null);

      const data = await fetchEspacoDeProjetos();

      setProjetosRawData(data);
      setProjetosLastUpdate(new Date());
      saveToCache();
    } catch (error) {
      setProjetosError(
        error instanceof Error
          ? error.message
          : "Erro ao carregar dados dos projetos"
      );
      console.error("Erro ao buscar dados dos projetos:", error);
    } finally {
      setProjetosLoading(false);
    }
  };

  const refreshProjetosData = async () => {
    await fetchProjetosData();
  };

  const refreshSprintData = async () => {
    // Será implementado depois
    console.log("Refresh sprint data - a ser implementado");
  };

  const refreshAcompanhamentoTIData = async () => {
    try {
      setAcompanhamentoTILoading(true);
      setAcompanhamentoTIError(null);
      const response = await fetchAcompanhamentoTI();
      setAcompanhamentoTIData(response);
      setAcompanhamentoTILastUpdate(new Date());
    } catch (err) {
      setAcompanhamentoTIError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar dados do acompanhamento TI"
      );
    } finally {
      setAcompanhamentoTILoading(false);
    }
  };

  const refreshOpcoesDepartamentoSolicitante = async () => {
    try {
      setOpcoesDepartamentoSolicitanteLoading(true);
      setOpcoesDepartamentoSolicitanteError(null);

      const options = await fetchOpcoesCampoCustomizado("customfield_10245");
      setOpcoesDepartamentoSolicitante(options);
      setOpcoesDepartamentoSolicitanteLastUpdate(new Date());
    } catch (error) {
      setOpcoesDepartamentoSolicitanteError(
        error instanceof Error
          ? error.message
          : "Erro ao carregar opções do campo customizado"
      );
      console.error("Erro ao buscar opções do campo customizado:", error);
    } finally {
      setOpcoesDepartamentoSolicitanteLoading(false);
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setProjetosLoading(true);
        setProjetosError(null);
        const projetosResponse = await fetchEspacoDeProjetos();
        setProjetosRawData(projetosResponse);
      } catch (err) {
        setProjetosError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar dados dos projetos"
        );
      } finally {
        setProjetosLoading(false);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    const carregarDadosTI = async () => {
      try {
        setAcompanhamentoTILoading(true);
        setAcompanhamentoTIError(null);
        const tiResponse = await fetchAcompanhamentoTI();
        setAcompanhamentoTIData(tiResponse);
      } catch (err) {
        setAcompanhamentoTIError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar dados do acompanhamento TI"
        );
      } finally {
        setAcompanhamentoTILoading(false);
      }
    };

    carregarDadosTI();
  }, []);

  // Carregar opções do campo customizado Departamento Solicitante
  useEffect(() => {
    const carregarOpcoesCampoCustomizado = async () => {
      try {
        setOpcoesDepartamentoSolicitanteLoading(true);
        setOpcoesDepartamentoSolicitanteError(null);
        const options = await fetchOpcoesCampoCustomizado("customfield_10245");
        setOpcoesDepartamentoSolicitante(options);
        setOpcoesDepartamentoSolicitanteLastUpdate(new Date());
      } catch (err) {
        setOpcoesDepartamentoSolicitanteError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar opções do campo customizado"
        );
      } finally {
        setOpcoesDepartamentoSolicitanteLoading(false);
      }
    };

    carregarOpcoesCampoCustomizado();
  }, []);

  // Carrega dados iniciais apenas uma vez
  useEffect(() => {
    if (isInitialLoad) {
      if (!loadFromCache()) {
        fetchProjetosData();
      }
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  // Configura refresh automático a cada hora
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchProjetosData();
    }, CACHE_EXPIRATION);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <JiraContext.Provider
      value={{
        projetosData: {
          rawData: projetosRawData,
          loading: projetosLoading,
          error: projetosError,
          lastUpdate: projetosLastUpdate,
        },
        sprintData: {
          rawData: sprintRawData,
          metrics: sprintMetrics,
          loading: false,
          error: null,
          lastUpdate: sprintLastUpdate,
        },
        acompanhamentoTIData: {
          rawData: acompanhamentoTIData,
          loading: acompanhamentoTILoading,
          error: acompanhamentoTIError,
          lastUpdate: acompanhamentoTILastUpdate,
        },
        opcoesDepartamentoSolicitante: {
          options: opcoesDepartamentoSolicitante,
          loading: opcoesDepartamentoSolicitanteLoading,
          error: opcoesDepartamentoSolicitanteError,
          lastUpdate: opcoesDepartamentoSolicitanteLastUpdate,
        },
        refreshProjetosData,
        refreshSprintData,
        refreshAcompanhamentoTIData,
        refreshOpcoesDepartamentoSolicitante,
      }}
    >
      {children}
    </JiraContext.Provider>
  );
};

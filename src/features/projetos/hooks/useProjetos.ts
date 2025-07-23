import { useState, useEffect } from "react";
import { projetosApi } from "../api/jira";
import { ProjetosTableData } from "../types/index";
import { useDataSync } from "../../../shared/context/DataSyncContext";
import { mapErrorWithCode } from "../../../shared/utils/errorMapper";
import { useApiCache } from "../../../shared/hooks/useApiCache";
// import { useNavigationCache } from "../../../shared/hooks/useNavigationCache";

interface UseProjetosReturn {
  data: ProjetosTableData | null;
  loading: boolean;
  error: string | null;
  errorCode: string | null;
  refetch: () => void;
}

export const useProjetos = (): UseProjetosReturn => {
  const { lastRefresh } = useDataSync();
  // const { isQuickNavigation } = useNavigationCache();

  // Hook de cache para projetos
  const {
    data,
    setData,
    isLoading: loading,
    setIsLoading: setLoading,
    error,
    setError,
    loadFromCache,
    saveToCache,
    // lastUpdated,
    // clearCache,
  } = useApiCache<ProjetosTableData>({
    key: "projetos_data",
    ttl: 5 * 60 * 1000, // 5 minutos
    enabled: true,
  });

  const [errorCode, setErrorCode] = useState<string | null>(null);

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      setErrorCode(null);

      // Tenta carregar do cache primeiro (se não for refresh forçado)
      if (!forceRefresh) {
        const cachedData = loadFromCache();
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      const response = await projetosApi.getTabelaProjetos();
      const projetosData = response.tabela_dashboard_ep;

      // Salva no cache
      saveToCache(projetosData);
      setData(projetosData);
    } catch (err) {
      const { message, code } = mapErrorWithCode(err);
      setError(message);
      setErrorCode(code);
      console.error("Erro no hook useProjetos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Tenta carregar do cache primeiro
    const cachedData = loadFromCache();
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      console.log("Dados carregados do cache");
    } else {
      // Só faz requisição se não há cache
      console.log("Nenhum cache encontrado, fazendo requisição à API");
      fetchData();
    }
  }, []);

  // Reagir à sincronização global (sempre força refresh)
  useEffect(() => {
    if (lastRefresh) {
      fetchData(true); // Força refresh ignorando cache
    }
  }, [lastRefresh]);

  return {
    data,
    loading,
    error,
    errorCode,
    refetch: fetchData,
  };
};

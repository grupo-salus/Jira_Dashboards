import { useState, useEffect } from "react";
import { projetosApi } from "../../../api/jira";
import { ProjetosTableData, ProjetosApiError } from "../types";
import { useDataSync } from "../../../shared/context/DataSyncContext";
import { mapErrorWithCode } from "../../../shared/utils/errorMapper";

interface UseProjetosReturn {
  data: ProjetosTableData | null;
  loading: boolean;
  error: string | null;
  errorCode: string | null;
  refetch: () => void;
}

export const useProjetos = (): UseProjetosReturn => {
  const [data, setData] = useState<ProjetosTableData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const { lastRefresh } = useDataSync();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorCode(null);

      const response = await projetosApi.getTabelaProjetos();
      setData(response.tabela_dashboard_ep);
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
    fetchData();
  }, []);

  // Reagir à sincronização global
  useEffect(() => {
    if (lastRefresh) {
      fetchData();
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

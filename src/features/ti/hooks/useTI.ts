import { useState, useEffect } from "react";
import { tiApi } from "../api/jira";
import { TITableData, TIApiError } from "../types";
import { useDataSync } from "../../../shared/context/DataSyncContext";
import { mapErrorWithCode } from "../../../shared/utils/errorMapper";

interface UseTIReturn {
  data: TITableData | null;
  loading: boolean;
  error: string | null;
  errorCode: string | null;
  refetch: () => void;
}

export const useTI = (): UseTIReturn => {
  const [data, setData] = useState<TITableData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const { lastRefresh } = useDataSync();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorCode(null);

      const response = await tiApi.getTabelaTI();
      setData(response.tabela_dashboard_ti);
    } catch (err) {
      const { message, code } = mapErrorWithCode(err);
      setError(message);
      setErrorCode(code);
      console.error("Erro no hook useTI:", err);
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

import { useState, useCallback } from "react";
import { SUPPORT_CONFIG } from "@/shared/constants/support";
import { mapErrorWithCode } from "@/shared/utils/errorMapper";

interface ErrorState {
  hasError: boolean;
  error: string | null;
  errorCode: string | null;
  isLoading: boolean;
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorCode: null,
    isLoading: false,
  });

  const handleError = useCallback((error: unknown) => {
    const { message, code } = mapErrorWithCode(error);
    setErrorState({
      hasError: true,
      error: message,
      errorCode: code,
      isLoading: false,
    });
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorCode: null,
      isLoading: false,
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setErrorState((prev) => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  const retry = useCallback(
    (retryFunction: () => Promise<void>) => {
      setErrorState((prev) => ({
        ...prev,
        hasError: false,
        error: null,
        errorCode: null,
        isLoading: true,
      }));

      retryFunction().catch((error) => {
        handleError(error);
      });
    },
    [handleError]
  );

  const contactSupport = useCallback(() => {
    // Abre o site de suporte em uma nova aba
    window.open(SUPPORT_CONFIG.website, "_blank");
  }, []);

  return {
    ...errorState,
    handleError,
    clearError,
    setLoading,
    retry,
    contactSupport,
  };
};

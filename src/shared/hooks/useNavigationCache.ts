import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook para gerenciar cache de navegação
 * Evita requisições desnecessárias quando o usuário navega entre abas
 */
export const useNavigationCache = () => {
  const location = useLocation();
  const lastLocationRef = useRef<string>("");
  const navigationTimeRef = useRef<number>(0);

  useEffect(() => {
    const currentTime = Date.now();
    const timeSinceLastNavigation = currentTime - navigationTimeRef.current;

    // Se passou menos de 30 segundos desde a última navegação,
    // provavelmente é uma navegação rápida entre abas
    const isQuickNavigation = timeSinceLastNavigation < 30000; // 30 segundos

    if (isQuickNavigation && lastLocationRef.current !== "") {
      console.log(
        `Navegação rápida detectada: ${lastLocationRef.current} -> ${location.pathname}`
      );
    }

    lastLocationRef.current = location.pathname;
    navigationTimeRef.current = currentTime;
  }, [location.pathname]);

  /**
   * Verifica se é uma navegação rápida (menos de 30 segundos)
   */
  const isQuickNavigation = (): boolean => {
    const currentTime = Date.now();
    return currentTime - navigationTimeRef.current < 30000;
  };

  /**
   * Obtém o tempo desde a última navegação
   */
  const getTimeSinceLastNavigation = (): number => {
    return Date.now() - navigationTimeRef.current;
  };

  return {
    isQuickNavigation,
    getTimeSinceLastNavigation,
    currentPath: location.pathname,
  };
};

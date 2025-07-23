import { useState, useEffect, useCallback } from "react";
import { cacheService } from "../services/cacheService";
import { CACHE_CONFIG } from "../../config/config";

/**
 * Interface para configurações do cache da API
 */
interface ApiCacheConfig {
  key: string;
  ttl?: number;
  enabled?: boolean;
}

/**
 * Hook para gerenciar cache de dados da API
 */
export const useApiCache = <T>(config: ApiCacheConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { key, ttl = CACHE_CONFIG.CACHE_TTL, enabled = true } = config;

  /**
   * Carrega dados do cache
   */
  const loadFromCache = useCallback((): T | null => {
    if (!enabled || !cacheService.isAvailable()) {
      return null;
    }

    try {
      const cachedData = cacheService.get<T>(key);
      if (cachedData) {
        setLastUpdated(new Date());
        return cachedData;
      }
    } catch (error) {
      console.error("Error loading from cache:", error);
    }

    return null;
  }, [key, enabled]);

  /**
   * Salva dados no cache
   */
  const saveToCache = useCallback(
    (data: T): boolean => {
      if (!enabled || !cacheService.isAvailable()) {
        return false;
      }

      try {
        const success = cacheService.set(key, data, ttl);
        if (success) {
          setLastUpdated(new Date());
        }
        return success;
      } catch (error) {
        console.error("Error saving to cache:", error);
        return false;
      }
    },
    [key, ttl, enabled]
  );

  /**
   * Remove dados do cache
   */
  const clearCache = useCallback((): boolean => {
    try {
      const success = cacheService.delete(key);
      if (success) {
        setData(null);
        setLastUpdated(null);
      }
      return success;
    } catch (error) {
      console.error("Error clearing cache:", error);
      return false;
    }
  }, [key]);

  /**
   * Verifica se os dados estão em cache
   */
  const isCached = useCallback((): boolean => {
    if (!enabled || !cacheService.isAvailable()) {
      return false;
    }

    try {
      return cacheService.get<T>(key) !== null;
    } catch {
      return false;
    }
  }, [key, enabled]);

  /**
   * Obtém estatísticas do cache
   */
  const getCacheStats = useCallback(() => {
    return cacheService.getStats();
  }, []);

  /**
   * Carrega dados iniciais do cache
   */
  useEffect(() => {
    if (enabled) {
      const cachedData = loadFromCache();
      if (cachedData) {
        setData(cachedData);
      }
    }
  }, [loadFromCache, enabled]);

  return {
    data,
    setData,
    isLoading,
    setIsLoading,
    error,
    setError,
    lastUpdated,
    loadFromCache,
    saveToCache,
    clearCache,
    isCached,
    getCacheStats,
  };
};

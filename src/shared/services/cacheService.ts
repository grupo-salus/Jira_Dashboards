import { CACHE_CONFIG } from "../../config/config";

/**
 * Interface para itens do cache
 */
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Interface para metadados do cache
 */
interface CacheMetadata {
  version: string;
  lastCleanup: number;
  totalItems: number;
}

/**
 * Serviço de cache com boas práticas de segurança e modularização
 */
class CacheService {
  private readonly prefix: string;
  private readonly defaultTTL: number;
  private readonly version: string = "1.0.0";

  constructor() {
    this.prefix = CACHE_CONFIG.CACHE_KEY_PREFIX;
    this.defaultTTL = CACHE_CONFIG.CACHE_TTL;
    this.initializeCache();
  }

  /**
   * Inicializa o cache e faz limpeza automática
   */
  private initializeCache(): void {
    this.cleanupExpiredItems();
    this.ensureMetadata();
  }

  /**
   * Garante que os metadados do cache existem
   */
  private ensureMetadata(): void {
    const metadataKey = `${this.prefix}metadata`;
    const metadata = this.get<CacheMetadata>(metadataKey);

    if (!metadata) {
      // Escreve diretamente no localStorage para evitar loop infinito
      const metadataItem: CacheItem<CacheMetadata> = {
        data: {
          version: this.version,
          lastCleanup: Date.now(),
          totalItems: 0,
        },
        timestamp: Date.now(),
        ttl: 0, // Metadata não expira
      };

      localStorage.setItem(metadataKey, JSON.stringify(metadataItem));
    }
  }

  /**
   * Gera uma chave segura para o cache
   */
  private generateKey(key: string): string {
    // Sanitiza a chave para evitar injeção
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_-]/g, "_");
    return `${this.prefix}${sanitizedKey}`;
  }

  /**
   * Valida se os dados são seguros para armazenar
   */
  private validateData<T>(data: T): boolean {
    try {
      // Verifica se os dados são serializáveis
      JSON.stringify(data);

      // Verifica tamanho máximo (1MB)
      const size = new Blob([JSON.stringify(data)]).size;
      if (size > 1024 * 1024) {
        console.warn("Cache item too large, skipping:", size);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Invalid data for cache:", error);
      return false;
    }
  }

  /**
   * Armazena dados no cache
   */
  set<T>(key: string, data: T, ttl?: number): boolean {
    try {
      if (!this.validateData(data)) {
        return false;
      }

      const cacheKey = this.generateKey(key);
      const ttlToUse = ttl ?? this.defaultTTL;

      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttlToUse,
      };

      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));

      // Só atualiza metadata se não for o próprio metadata
      if (!key.includes("metadata")) {
        this.updateMetadata();
      }

      return true;
    } catch (error) {
      console.error("Error setting cache item:", error);
      return false;
    }
  }

  /**
   * Recupera dados do cache
   */
  get<T>(key: string): T | null {
    try {
      const cacheKey = this.generateKey(key);
      const item = localStorage.getItem(cacheKey);

      if (!item) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(item);

      // Verifica se o item expirou
      if (this.isExpired(cacheItem)) {
        this.delete(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error("Error getting cache item:", error);
      this.delete(key); // Remove item corrompido
      return null;
    }
  }

  /**
   * Verifica se um item expirou
   */
  private isExpired<T>(item: CacheItem<T>): boolean {
    if (item.ttl === 0) return false; // Item que não expira
    return Date.now() - item.timestamp > item.ttl;
  }

  /**
   * Remove um item do cache
   */
  delete(key: string): boolean {
    try {
      const cacheKey = this.generateKey(key);
      localStorage.removeItem(cacheKey);

      // Só atualiza metadata se não for o próprio metadata
      if (!key.includes("metadata")) {
        this.updateMetadata();
      }

      return true;
    } catch (error) {
      console.error("Error deleting cache item:", error);
      return false;
    }
  }

  /**
   * Limpa todo o cache
   */
  clear(): boolean {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter((key) => key.startsWith(this.prefix));

      cacheKeys.forEach((key) => {
        localStorage.removeItem(key);
      });

      this.ensureMetadata();
      return true;
    } catch (error) {
      console.error("Error clearing cache:", error);
      return false;
    }
  }

  /**
   * Limpa itens expirados
   */
  cleanupExpiredItems(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter((key) => key.startsWith(this.prefix));

      let cleanedCount = 0;

      cacheKeys.forEach((key) => {
        if (key.endsWith("metadata")) return; // Pula metadados

        try {
          const item = localStorage.getItem(key);
          if (item) {
            const cacheItem: CacheItem<any> = JSON.parse(item);
            if (this.isExpired(cacheItem)) {
              localStorage.removeItem(key);
              cleanedCount++;
            }
          }
        } catch (error) {
          // Remove item corrompido
          localStorage.removeItem(key);
          cleanedCount++;
        }
      });

      if (cleanedCount > 0) {
        console.log(`Cleaned ${cleanedCount} expired cache items`);
        this.updateMetadata();
      }
    } catch (error) {
      console.error("Error cleaning up cache:", error);
    }
  }

  /**
   * Atualiza metadados do cache
   */
  private updateMetadata(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter((key) => key.startsWith(this.prefix));

      const metadata: CacheMetadata = {
        version: this.version,
        lastCleanup: Date.now(),
        totalItems: cacheKeys.length - 1, // -1 para excluir o próprio metadata
      };

      // Escreve diretamente no localStorage para evitar loop infinito
      const metadataKey = `${this.prefix}metadata`;
      const metadataItem: CacheItem<CacheMetadata> = {
        data: metadata,
        timestamp: Date.now(),
        ttl: 0, // Metadata não expira
      };

      localStorage.setItem(metadataKey, JSON.stringify(metadataItem));
    } catch (error) {
      console.error("Error updating cache metadata:", error);
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getStats(): {
    totalItems: number;
    lastCleanup: number;
    version: string;
  } | null {
    const metadata = this.get<CacheMetadata>(`${this.prefix}metadata`);
    return metadata;
  }

  /**
   * Verifica se o cache está disponível
   */
  isAvailable(): boolean {
    try {
      const testKey = `${this.prefix}test`;
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

// Instância singleton do serviço de cache
export const cacheService = new CacheService();

// Hooks para facilitar o uso do cache
export const useCache = () => {
  return {
    set: cacheService.set.bind(cacheService),
    get: cacheService.get.bind(cacheService),
    delete: cacheService.delete.bind(cacheService),
    clear: cacheService.clear.bind(cacheService),
    cleanup: cacheService.cleanupExpiredItems.bind(cacheService),
    stats: cacheService.getStats.bind(cacheService),
    isAvailable: cacheService.isAvailable.bind(cacheService),
  };
};

import React, { createContext, useContext, ReactNode } from "react";
import { BacklogItem, BacklogBasicMetrics } from "../types/backlog";
import { useJira } from "./JiraContext";

interface BacklogContextType {
  rawData: BacklogItem[];
  metrics: {
    basic: BacklogBasicMetrics;
  };
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  lastUpdate: Date | null;
}

export const BacklogContext = createContext<BacklogContextType>({
  rawData: [],
  metrics: {
    basic: {
      total_cards: 0,
      total_projetos: 0,
      primeiro_projeto: null,
    },
  },
  loading: false,
  error: null,
  refreshData: async () => {},
  lastUpdate: null,
});

export const useBacklog = () => {
  const context = useContext(BacklogContext);
  if (!context) {
    throw new Error("useBacklog must be used within a BacklogProvider");
  }
  return context;
};

interface BacklogProviderProps {
  children: ReactNode;
}

export const BacklogProvider: React.FC<BacklogProviderProps> = ({
  children,
}) => {
  const { backlogData, refreshBacklogData } = useJira();

  return (
    <BacklogContext.Provider
      value={{
        rawData: backlogData.rawData,
        metrics: backlogData.metrics,
        loading: backlogData.loading,
        error: backlogData.error,
        refreshData: refreshBacklogData,
        lastUpdate: backlogData.lastUpdate,
      }}
    >
      {children}
    </BacklogContext.Provider>
  );
};

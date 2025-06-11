/**
 * Configurações centralizadas para prioridades do Jira
 * Este arquivo é a única fonte de verdade para configurações de prioridade
 * Inclui labels em português, cores para modo claro e escuro, e classes Tailwind
 */
export interface PriorityConfig {
  label: string;
  color: {
    bg: string;
    text: string;
    dark: {
      bg: string;
      text: string;
    };
  };
}

export const PRIORITIES: Record<string, PriorityConfig> = {
  Highest: {
    label: "Muito Alta",
    color: {
      bg: "bg-red-100",
      text: "text-red-800",
      dark: {
        bg: "dark:bg-red-900",
        text: "dark:text-red-300",
      },
    },
  },
  High: {
    label: "Alta",
    color: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      dark: {
        bg: "dark:bg-orange-900",
        text: "dark:text-orange-300",
      },
    },
  },
  Medium: {
    label: "Média",
    color: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      dark: {
        bg: "dark:bg-yellow-900",
        text: "dark:text-yellow-300",
      },
    },
  },
  Low: {
    label: "Baixa",
    color: {
      bg: "bg-green-100",
      text: "text-green-800",
      dark: {
        bg: "dark:bg-green-900",
        text: "dark:text-green-300",
      },
    },
  },
  Lowest: {
    label: "Mínima",
    color: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      dark: {
        bg: "dark:bg-blue-900",
        text: "dark:text-blue-300",
      },
    },
  },
};

/**
 * Retorna a configuração de prioridade para uma determinada prioridade
 * Se a prioridade não for encontrada, retorna uma configuração padrão
 */
export const getPriorityConfig = (priority: string): PriorityConfig => {
  return (
    PRIORITIES[priority] || {
      label: "Não definida",
      color: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        dark: {
          bg: "dark:bg-gray-900",
          text: "dark:text-gray-300",
        },
      },
    }
  );
};

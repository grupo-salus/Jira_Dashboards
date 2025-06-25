// ============================================================================
// SISTEMA DE CORES CENTRALIZADO - JIRA DASHBOARDS
// ============================================================================
//
// Este arquivo centraliza todas as cores do projeto, organizadas por:
// - Cores semânticas (primary, success, warning, error)
// - Cores por componente (kanban, gráficos, totalizadores)
// - Cores por status (ideação, execução, homologação)
// - Cores de texto (títulos, subtítulos, corpo)
// - Cores de fundo (cards, containers, páginas)
// - Cores de bordas e divisores
//
// Uso: Importe e use as cores através do objeto themeColors
// Exemplo: themeColors.text.primary.light
// ============================================================================

export const themeColors = {
  // ============================================================================
  // CORES SEMÂNTICAS PRINCIPAIS
  // ============================================================================
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb", // principal
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
  success: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // ============================================================================
  // CORES DE TEXTO
  // ============================================================================
  text: {
    // Títulos principais
    primary: {
      light: "#111827", // gray-900
      dark: "#ffffff", // white
    },
    // Subtítulos e textos secundários
    secondary: {
      light: "#4b5563", // gray-600
      dark: "#d1d5db", // gray-300
    },
    // Textos de menor destaque
    tertiary: {
      light: "#6b7280", // gray-500
      dark: "#9ca3af", // gray-400
    },
    // Textos de status
    success: {
      light: "#059669", // green-600
      dark: "#34d399", // green-400
    },
    warning: {
      light: "#d97706", // amber-600
      dark: "#fbbf24", // amber-400
    },
    error: {
      light: "#dc2626", // red-600
      dark: "#f87171", // red-400
    },
    info: {
      light: "#2563eb", // blue-600
      dark: "#60a5fa", // blue-400
    },
  },

  // ============================================================================
  // CORES DE FUNDO
  // ============================================================================
  background: {
    // Fundo da página
    page: {
      light: "#f9fafb", // gray-50
      dark: "#111827", // gray-900
    },
    // Fundo de cards e containers
    card: {
      light: "#ffffff", // white
      dark: "#1f2937", // gray-800
    },
    // Fundo de hover
    hover: {
      light: "#f3f4f6", // gray-100
      dark: "#374151", // gray-700
    },
    // Fundo de elementos ativos
    active: {
      light: "#e5e7eb", // gray-200
      dark: "#4b5563", // gray-600
    },
  },

  // ============================================================================
  // CORES DE BORDAS E DIVISORES
  // ============================================================================
  border: {
    // Bordas principais
    primary: {
      light: "#e5e7eb", // gray-200
      dark: "#374151", // gray-700
    },
    // Bordas secundárias
    secondary: {
      light: "#d1d5db", // gray-300
      dark: "#4b5563", // gray-600
    },
    // Bordas de foco
    focus: {
      light: "#3b82f6", // blue-500
      dark: "#60a5fa", // blue-400
    },
  },

  // ============================================================================
  // CORES POR STATUS (KANBAN E PROJETOS)
  // ============================================================================
  status: {
    // Status de Prazo
    prazo: {
      noPrazo: {
        bg: {
          light: "#d1fae5", // green-100
          dark: "#064e3b", // green-900
        },
        text: {
          light: "#065f46", // green-800
          dark: "#34d399", // green-300
        },
      },
      foraPrazo: {
        bg: {
          light: "#fee2e2", // red-100
          dark: "#7f1d1d", // red-900
        },
        text: {
          light: "#991b1b", // red-800
          dark: "#fca5a5", // red-300
        },
      },
    },
    // Status de Esforço
    esforco: {
      dentroEstimado: {
        bg: {
          light: "#d1fae5", // green-100
          dark: "#064e3b", // green-900
        },
        text: {
          light: "#065f46", // green-800
          dark: "#34d399", // green-300
        },
      },
      proximoLimite: {
        bg: {
          light: "#fef3c7", // yellow-100
          dark: "#78350f", // yellow-900
        },
        text: {
          light: "#92400e", // yellow-800
          dark: "#fde68a", // yellow-300
        },
      },
      estourouEstimativa: {
        bg: {
          light: "#fee2e2", // red-100
          dark: "#7f1d1d", // red-900
        },
        text: {
          light: "#991b1b", // red-800
          dark: "#fca5a5", // red-300
        },
      },
    },
    // Status de Ideação
    ideacao: {
      recente: {
        bg: {
          light: "#d1fae5", // green-100
          dark: "#064e3b", // green-900
        },
        text: {
          light: "#065f46", // green-800
          dark: "#34d399", // green-300
        },
      },
      rever: {
        bg: {
          light: "#dbeafe", // blue-100
          dark: "#1e3a8a", // blue-900
        },
        text: {
          light: "#1e40af", // blue-800
          dark: "#93c5fd", // blue-300
        },
      },
      quaseObsoleto: {
        bg: {
          light: "#fef3c7", // yellow-100
          dark: "#78350f", // yellow-900
        },
        text: {
          light: "#92400e", // yellow-800
          dark: "#fde68a", // yellow-300
        },
      },
      obsoleto: {
        bg: {
          light: "#fee2e2", // red-100
          dark: "#7f1d1d", // red-900
        },
        text: {
          light: "#991b1b", // red-800
          dark: "#fca5a5", // red-300
        },
      },
    },
  },

  // ============================================================================
  // CORES POR COMPONENTE
  // ============================================================================
  components: {
    // Totalizadores
    totalizadores: {
      total: {
        icon: "#3b82f6", // blue-500
        bar: "#3b82f6", // blue-500
      },
      ideacao: {
        icon: "#8b5cf6", // purple-500
        bar: "#8b5cf6", // purple-500
      },
      projetos: {
        icon: "#f97316", // orange-500
        bar: "#f97316", // orange-500
      },
      backlogPriorizado: {
        icon: "#10b981", // green-500
        bar: "#10b981", // green-500
      },
      proximoExecucao: {
        bg: {
          light: "linear-gradient(to right, #ecfdf5, #eff6ff)", // green-50 to blue-50
          dark: "linear-gradient(to right, #064e3b, #1e3a8a)", // green-900 to blue-900
        },
        border: {
          light: "#bbf7d0", // green-200
          dark: "#065f46", // green-700
        },
        bar: "linear-gradient(to right, #34d399, #60a5fa)", // green-400 to blue-400
      },
    },

    // Kanban
    kanban: {
      colunas: {
        ideacao: "#8b5cf6", // purple-500
        backlogPriorizado: "#f97316", // orange-500
        emExecucao: "#3b82f6", // blue-500
        emHomologacao: "#06b6d4", // cyan-500
        operacaoAssistida: "#10b981", // green-500
        entregue: "#059669", // green-600
        cancelado: "#ef4444", // red-500
        bloqueado: "#6b7280", // gray-500
      },
      cards: {
        bg: {
          light: "#ffffff", // white
          dark: "#1f2937", // gray-800
        },
        border: {
          light: "#e5e7eb", // gray-200
          dark: "#374151", // gray-700
        },
        hover: {
          light: "#f9fafb", // gray-50
          dark: "#111827", // gray-900
        },
      },
    },

    // Gráficos
    graficos: {
      // Paleta principal para gráficos
      palette: [
        "#2563eb", // blue-600
        "#7c3aed", // purple-600
        "#ec4899", // pink-500
        "#ef4444", // red-500
        "#f59e0b", // amber-500
        "#10b981", // emerald-500
        "#06b6d4", // cyan-500
        "#8b5cf6", // violet-500
        "#f97316", // orange-500
        "#14b8a6", // teal-500
        "#94a3b8", // gray-400
      ],
      // Cores específicas por tipo de gráfico
      bar: {
        primary: "#2563eb",
        secondary: "#7c3aed",
        accent: "#ec4899",
      },
      pie: {
        primary: "#2563eb",
        secondary: "#7c3aed",
        accent: "#ec4899",
      },
      line: {
        primary: "#2563eb",
        secondary: "#10b981",
        accent: "#f59e0b",
      },
    },

    // Botões
    buttons: {
      primary: {
        bg: {
          light: "linear-gradient(to right, #3b82f6, #8b5cf6)", // blue-500 to purple-500
          dark: "linear-gradient(to right, #1d4ed8, #7c3aed)", // blue-700 to purple-700
        },
        hover: {
          light: "linear-gradient(to right, #2563eb, #7c3aed)", // blue-600 to purple-600
          dark: "linear-gradient(to right, #1e40af, #6d28d9)", // blue-800 to purple-800
        },
        text: "#ffffff",
      },
      secondary: {
        bg: {
          light: "#f3f4f6", // gray-100
          dark: "#374151", // gray-700
        },
        hover: {
          light: "#e5e7eb", // gray-200
          dark: "#4b5563", // gray-600
        },
        text: {
          light: "#374151", // gray-700
          dark: "#d1d5db", // gray-300
        },
      },
      danger: {
        bg: {
          light: "#fee2e2", // red-100
          dark: "#7f1d1d", // red-900
        },
        hover: {
          light: "#fecaca", // red-200
          dark: "#991b1b", // red-800
        },
        text: {
          light: "#991b1b", // red-800
          dark: "#fca5a5", // red-300
        },
      },
    },

    // Filtros
    filtros: {
      bg: {
        light: "#ffffff", // white
        dark: "#1f2937", // gray-800
      },
      border: {
        light: "#e5e7eb", // gray-200
        dark: "#374151", // gray-700
      },
      input: {
        bg: {
          light: "#f9fafb", // gray-50
          dark: "#374151", // gray-700
        },
        border: {
          light: "#e5e7eb", // gray-200
          dark: "#4b5563", // gray-600
        },
        focus: {
          light: "#3b82f6", // blue-500
          dark: "#60a5fa", // blue-400
        },
      },
    },

    // Tabelas
    tabelas: {
      header: {
        bg: {
          light: "#f9fafb", // gray-50
          dark: "#111827", // gray-900
        },
        text: {
          light: "#374151", // gray-700
          dark: "#d1d5db", // gray-300
        },
      },
      row: {
        bg: {
          light: "#ffffff", // white
          dark: "#1f2937", // gray-800
        },
        hover: {
          light: "#f9fafb", // gray-50
          dark: "#111827", // gray-900
        },
        border: {
          light: "#e5e7eb", // gray-200
          dark: "#374151", // gray-700
        },
      },
    },
  },

  // ============================================================================
  // CORES DE UTILIDADE
  // ============================================================================
  utility: {
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
    current: "currentColor",
  },

  // ============================================================================
  // COMPATIBILIDADE COM CÓDIGO EXISTENTE
  // ============================================================================
  // Aliases para manter compatibilidade com código existente
  get cardBg() {
    return this.background.card;
  },
  get pageBg() {
    return this.background.page;
  },
  get chart() {
    return this.components.graficos.palette;
  },
};

// ============================================================================
// FUNÇÕES UTILITÁRIAS PARA CORES
// ============================================================================

/**
 * Obtém a cor de texto apropriada baseada no tema
 */
export const getTextColor = (
  variant:
    | "primary"
    | "secondary"
    | "tertiary"
    | "success"
    | "warning"
    | "error"
    | "info",
  theme: "light" | "dark"
) => {
  return themeColors.text[variant][theme];
};

/**
 * Obtém a cor de fundo apropriada baseada no tema
 */
export const getBackgroundColor = (
  variant: "page" | "card" | "hover" | "active",
  theme: "light" | "dark"
) => {
  return themeColors.background[variant][theme];
};

/**
 * Obtém a cor de borda apropriada baseada no tema
 */
export const getBorderColor = (
  variant: "primary" | "secondary" | "focus",
  theme: "light" | "dark"
) => {
  return themeColors.border[variant][theme];
};

/**
 * Obtém a cor de status apropriada baseada no tema
 */
export const getStatusColor = (
  category: "prazo" | "esforco" | "ideacao",
  status: string,
  theme: "light" | "dark",
  type: "bg" | "text"
) => {
  const statusMap: Record<string, any> = {
    prazo: {
      "No prazo": themeColors.status.prazo.noPrazo,
      "Fora do prazo": themeColors.status.prazo.foraPrazo,
    },
    esforco: {
      "Dentro do estimado": themeColors.status.esforco.dentroEstimado,
      "Próximo do limite": themeColors.status.esforco.proximoLimite,
      "Estourou a estimativa": themeColors.status.esforco.estourouEstimativa,
    },
    ideacao: {
      Recente: themeColors.status.ideacao.recente,
      Rever: themeColors.status.ideacao.rever,
      "Quase obsoleto": themeColors.status.ideacao.quaseObsoleto,
      Obsoleto: themeColors.status.ideacao.obsoleto,
    },
  };

  const statusConfig = statusMap[category]?.[status];
  return statusConfig?.[type]?.[theme] || themeColors.text.tertiary[theme];
};

/**
 * Obtém a cor de componente apropriada baseada no tema
 */
export const getComponentColor = (
  component: string,
  variant: string,
  theme: "light" | "dark",
  type?: string
) => {
  const componentConfig = (themeColors.components as any)[component];
  if (!componentConfig) return themeColors.text.primary[theme];

  const variantConfig = componentConfig[variant];
  if (!variantConfig) return themeColors.text.primary[theme];

  if (type) {
    return (
      variantConfig[type]?.[theme] ||
      variantConfig[type] ||
      themeColors.text.primary[theme]
    );
  }

  return (
    variantConfig[theme] || variantConfig || themeColors.text.primary[theme]
  );
};

// ============================================================================
// CONFIGURAÇÕES DE FONTES (mantém compatibilidade)
// ============================================================================
export const themeFonts = {
  main: "Inter, sans-serif",
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

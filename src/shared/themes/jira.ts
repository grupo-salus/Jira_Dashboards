export const jiraTheme = {
  name: "jira",
  light: {
    bg: {
      base: "#ffffff", // Fundo principal
      surface: "#F4F5F7", // Cards, modais
      muted: "#EBECF0", // Divisores, hover
    },
    text: {
      base: "#172B4D",
      title: "#0052CC", // Azul Atlassian
      subtitle: "#6B778C",
      inverse: "#ffffff",
    },
    border: {
      base: "#DFE1E6",
      strong: "#0052CC",
    },
    shadow: {
      base: "0 2px 6px rgba(0, 0, 0, 0.08)",
    },
    brand: {
      primary: "#0052CC", // Atlassian Blue
      accent: "#2684FF",
      highlight: "#4C9AFF",
      neutral: "#B3D4FF",
    },
    state: {
      success: "#36B37E",
      warning: "#FFAB00",
      error: "#FF5630",
      disabled: "#A5ADBA",
    },
    graphics: {
      palette: [
        "#0052CC",
        "#2684FF",
        "#36B37E",
        "#FFAB00",
        "#FF5630",
        "#6554C0",
      ],
      axis: "#42526E",
      grid: "#DFE1E6",
      label: "#172B4D",
      tooltip: {
        background: "#172B4D",
        text: "#ffffff",
      },
    },
    font: {
      primary: "Atlassian Sans",
      secondary: "Roboto",
      text: "Roboto",
      accent: "Atlassian Sans",
      italic: "Atlassian Sans",
      weights: {
        thin: 200,
        normal: 400,
        medium: 500,
        bold: 600,
        black: 800,
      },
    },
  },

  dark: {
    bg: {
      base: "#1B1C1F",
      surface: "#2C2D30",
      muted: "#3A3B3E",
    },
    text: {
      base: "#FFFFFF",
      title: "#4C9AFF",
      subtitle: "#A5ADBA",
      inverse: "#1B1C1F",
    },
    border: {
      base: "#3A3B3E",
      strong: "#4C9AFF",
    },
    shadow: {
      base: "0 2px 6px rgba(0, 0, 0, 0.5)",
    },
    brand: {
      primary: "#4C9AFF",
      accent: "#2684FF",
      highlight: "#B3D4FF",
      neutral: "#7A869A",
    },
    state: {
      success: "#57D9A3",
      warning: "#FFC400",
      error: "#FF7452",
      disabled: "#6B778C",
    },
    graphics: {
      palette: [
        "#4C9AFF",
        "#2684FF",
        "#57D9A3",
        "#FFC400",
        "#FF7452",
        "#8777D9",
      ],
      axis: "#A5ADBA",
      grid: "#3A3B3E",
      label: "#DFE1E6",
      tooltip: {
        background: "#2C2D30",
        text: "#FFFFFF",
      },
    },
    font: {
      primary: "Atlassian Sans",
      secondary: "Roboto",
      text: "Roboto",
      accent: "Atlassian Sans",
      italic: "Atlassian Sans",
      weights: {
        thin: 200,
        normal: 400,
        medium: 500,
        bold: 600,
        black: 800,
      },
    },
  },
};

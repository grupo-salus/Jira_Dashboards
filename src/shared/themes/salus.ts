export const salusTheme = {
  name: "salus",
  light: {
    bg: {
      base: "#ffffff", // Fundo principal (ex: body)
      surface: "#f5f5f5", // Cards, modais
      muted: "#e5e5e5", // Hover, divisores
    },
    text: {
      base: "#333333",
      title: "#002A3A", // Azul escuro institucional
      subtitle: "#54595F",
      inverse: "#ffffff",
    },
    border: {
      base: "#E5E5E5",
      strong: "#002A3A",
    },
    shadow: {
      base: "0 2px 6px rgba(0,0,0,0.1)",
    },
    brand: {
      primary: "#6EC1E4", // Azul claro institucional
      accent: "#61CE70", // Verde claro
      highlight: "#AEE436", // Verde limão
      neutral: "#23B4AD", // Verde água
    },
    state: {
      success: "#61CE70",
      warning: "#FACC15",
      error: "#EF4444",
      disabled: "#BDBDBD",
    },
    graphics: {
      palette: [
        "#6EC1E4", // Azul institucional
        "#23B4AD", // Verde água
        "#AEE436", // Verde limão
        "#61CE70", // Verde
        "#002A3A", // Azul escuro
        "#E5E5E5", // Cinza claro
      ],
      axis: "#002A3A",
      grid: "#d1d5db",
      label: "#333333",
      tooltip: {
        background: "#002A3A",
        text: "#ffffff",
      },
    },
    font: {
      primary: "Facundo",
      secondary: "Roboto Slab",
      text: "Roboto",
      accent: "Roboto",
      italic: "Facundo",
      weights: {
        thin: 200,
        normal: 400,
        medium: 500,
        bold: 600,
        black: 900,
      },
    },
  },

  dark: {
    bg: {
      base: "#042D2B", // Verde escuro institucional
      surface: "#002A3A", // Azul petróleo
      muted: "#1F2937", // Cinza escuro (hover, divisores)
    },
    text: {
      base: "#f5f5f5",
      title: "#ffffff",
      subtitle: "#9CA3AF",
      inverse: "#042D2B",
    },
    border: {
      base: "#4B5563",
      strong: "#23B4AD",
    },
    shadow: {
      base: "0 2px 6px rgba(0,0,0,0.6)",
    },
    brand: {
      primary: "#6EC1E4",
      accent: "#61CE70",
      highlight: "#AEE436",
      neutral: "#23B4AD",
    },
    state: {
      success: "#61CE70",
      warning: "#FACC15",
      error: "#F87171",
      disabled: "#6B7280",
    },
    graphics: {
      palette: [
        "#6EC1E4",
        "#23B4AD",
        "#AEE436",
        "#61CE70",
        "#ffffff",
        "#9CA3AF",
      ],
      axis: "#E5E5E5",
      grid: "#374151",
      label: "#E5E5E5",
      tooltip: {
        background: "#1F2937",
        text: "#ffffff",
      },
    },
    font: {
      primary: "Facundo",
      secondary: "Roboto Slab",
      text: "Roboto",
      accent: "Roboto",
      italic: "Facundo",
      weights: {
        thin: 200,
        normal: 400,
        medium: 500,
        bold: 600,
        black: 900,
      },
    },
  },
};

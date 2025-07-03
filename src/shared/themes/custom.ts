export const customTheme = {
  name: "custom",
  light: {
    bg: {
      base: "#ffffff",
      surface: "#f8f9fa",
      muted: "#e9ecef",
    },
    text: {
      base: "#212529",
      title: "#0d6efd", // Azul Bootstrap
      subtitle: "#495057",
      inverse: "#ffffff",
    },
    border: {
      base: "#dee2e6",
      strong: "#0d6efd",
    },
    shadow: {
      base: "0 2px 6px rgba(0,0,0,0.08)",
    },
    brand: {
      primary: "#0d6efd", // Azul Bootstrap
      accent: "#6610f2", // Roxo Bootstrap
      highlight: "#20c997", // Verde esmeralda
      neutral: "#adb5bd", // Cinza neutro
    },
    state: {
      success: "#198754",
      warning: "#ffc107",
      error: "#dc3545",
      disabled: "#ced4da",
    },
    graphics: {
      palette: [
        "#0d6efd",
        "#6610f2",
        "#20c997",
        "#ffc107",
        "#dc3545",
        "#adb5bd",
      ],
      axis: "#495057",
      grid: "#dee2e6",
      label: "#212529",
      tooltip: {
        background: "#212529",
        text: "#ffffff",
      },
    },
    font: {
      primary: "Inter",
      secondary: "Roboto",
      text: "Roboto",
      accent: "Inter",
      italic: "Inter",
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
      base: "#1e1e2f",
      surface: "#2c2c3a",
      muted: "#3e3e4e",
    },
    text: {
      base: "#f8f9fa",
      title: "#0dcaf0",
      subtitle: "#adb5bd",
      inverse: "#1e1e2f",
    },
    border: {
      base: "#495057",
      strong: "#0dcaf0",
    },
    shadow: {
      base: "0 2px 6px rgba(0,0,0,0.5)",
    },
    brand: {
      primary: "#0dcaf0", // Azul ciano
      accent: "#6f42c1", // Roxo escuro
      highlight: "#20c997", // Verde esmeralda
      neutral: "#adb5bd",
    },
    state: {
      success: "#198754",
      warning: "#ffc107",
      error: "#f03e3e",
      disabled: "#6c757d",
    },
    graphics: {
      palette: [
        "#0dcaf0",
        "#6f42c1",
        "#20c997",
        "#ffc107",
        "#f03e3e",
        "#adb5bd",
      ],
      axis: "#adb5bd",
      grid: "#3e3e4e",
      label: "#f8f9fa",
      tooltip: {
        background: "#2c2c3a",
        text: "#ffffff",
      },
    },
    font: {
      primary: "Inter",
      secondary: "Roboto",
      text: "Roboto",
      accent: "Inter",
      italic: "Inter",
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

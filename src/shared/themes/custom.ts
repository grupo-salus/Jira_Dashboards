export const customTheme = {
  name: "coca-cola",
  light: {
    bg: {
      base: "#ffffff",
      surface: "#f8f9fa",
      muted: "#e9ecef",
    },
    text: {
      base: "#212529",
      title: "#e60012", // Coca-Cola Red
      subtitle: "#495057",
      inverse: "#ffffff",
    },
    border: {
      base: "#dee2e6",
      strong: "#e60012",
    },
    shadow: {
      base: "0 2px 6px rgba(0,0,0,0.08)",
    },
    brand: {
      primary: "#e60012", // Coca-Cola Red
      accent: "#000000", // Black
      highlight: "#f8f9fa", // Light Gray
      neutral: "#adb5bd",
    },
    state: {
      success: "#198754",
      warning: "#ffc107",
      error: "#dc3545",
      disabled: "#ced4da",
    },
    graphics: {
      palette: [
        "#e60012",
        "#000000",
        "#495057",
        "#adb5bd",
        "#ffc107",
        "#198754",
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
      base: "#1a1a1a", // Dark Charcoal
      surface: "#2c2c2c",
      muted: "#3e3e3e",
    },
    text: {
      base: "#f8f9fa",
      title: "#f03e3e", // Brighter Red for dark mode
      subtitle: "#adb5bd",
      inverse: "#1a1a1a",
    },
    border: {
      base: "#495057",
      strong: "#f03e3e",
    },
    shadow: {
      base: "0 2px 6px rgba(0,0,0,0.5)",
    },
    brand: {
      primary: "#f03e3e", // Brighter Red for dark mode
      accent: "#ffffff", // White
      highlight: "#2c2c2c",
      neutral: "#adb5bd",
    },
    state: {
      success: "#20c997",
      warning: "#ffc107",
      error: "#f06565",
      disabled: "#6c757d",
    },
    graphics: {
      palette: [
        "#f03e3e",
        "#ffffff",
        "#adb5bd",
        "#ffc107",
        "#20c997",
        "#6c757d",
      ],
      axis: "#adb5bd",
      grid: "#3e3e4e",
      label: "#f8f9fa",
      tooltip: {
        background: "#2c2c2c",
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

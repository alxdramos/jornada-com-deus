export const theme = {
  colors: {
    // Cores principais do app (inspirado nas referências)
    background: "#FAF9F6",
    primary: "#F97316",
    accent: "#10B981",
    text: "#1F2937",
    textSecondary: "#6B7280",
    success: "#10B981",
    card: "#FFFFFF",
    border: "#E5E7EB",

    // Badge Plus gradiente laranja-dourado
    plusBadge: {
      start: "#F97316",
      end: "#FB923C",
    },

    // Variações
    primaryHover: "#EA580C",
    accentHover: "#059669",
    borderLight: "#F3F4F6",
    textMuted: "#9CA3AF",
  },

  borderRadius: {
    default: "16px",
    large: "20px",
    small: "12px",
  },

  fonts: {
    family: "Inter, sans-serif",
    size: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
  },

  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },

  shadows: {
    card: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    cardHover: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    button: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  },
} as const;

export type Theme = typeof theme;
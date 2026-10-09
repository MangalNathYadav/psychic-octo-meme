import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "var(--bg)",
          surface: "var(--surface)",
          "surface-subtle": "var(--surface-subtle)",
          "surface-glass": "var(--surface-glass)",
          border: "var(--border)",
          "border-subtle": "var(--border-subtle)",
          "border-glass": "var(--border-glass)",
          "border-hover": "var(--border-hover)",
          text: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          accent: "var(--accent)",
          "accent-subtle": "var(--accent-subtle)",
          "tile-bg": "var(--tile-bg)",
          "tile-border": "var(--tile-border)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace"
        ],
      },
    },
  },
  plugins: [],
};
export default config;

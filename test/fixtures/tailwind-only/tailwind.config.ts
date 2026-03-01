import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#D74000",
          secondary: "#1A2332",
          accent: "#F59E0B",
          muted: "#6B7280",
          background: "#FFFFFF",
          foreground: "#1F2937",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
};

export default config;

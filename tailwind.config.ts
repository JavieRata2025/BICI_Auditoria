import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#0D9488", // Teal 600
          foreground: "#F0FDFA",
        },
        secondary: {
          DEFAULT: "#0F172A", // Slate 900
          foreground: "#F8FAFC",
        },
      },
    },
  },
  plugins: [],
};
export default config;

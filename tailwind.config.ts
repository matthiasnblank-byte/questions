import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        slateLine: "#d8dee6",
        paper: "#f7f5ef",
        panel: "#ffffff",
        accent: "#1f6f78",
        accentDark: "#164e56"
      },
      fontFamily: {
        sans: ["Aptos", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"]
      },
      boxShadow: {
        card: "0 18px 45px rgba(31, 41, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

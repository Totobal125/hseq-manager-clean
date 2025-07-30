import type { Config } from "tailwindcss";
import scrollbar from 'tailwind-scrollbar';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "dark": '#232A3C',
        "medium": '#293245',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    scrollbar, 
  ],
};

export default config;

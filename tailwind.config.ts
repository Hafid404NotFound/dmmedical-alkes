import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "360px", // Mobile (small)
        sm: "480px", // Mobile (large)
        md: "768px", // Tablet
        lg: "1024px", // Laptop
        xl: "1280px", // Desktop
        "2xl": "1536px", // Large desktop
      },
      colors: {
        primary: {
          main: "var(--primary-main)",
          dark: "var(--primary-dark)",
          light: "var(--primary-light)",
        },
        secondary: {
          main: "var(--secondary-main)",
          dark: "var(--secondary-dark)",
          light: "var(--secondary-light)",
        },
      },
    },
  },
  plugins: [],
};

export default config;

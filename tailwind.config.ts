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
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "spin-reverse": "spin-reverse 2s linear infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        "spin-reverse": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(255,255,255,0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(255,255,255,0.8)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        silver: {
          DEFAULT: "#d1d5db",
          dark: "#9ca3af",
        },
        rk: {
          primary: "#0ea5e9",      // Sky blue
          primaryDark: "#0369a1",  // Darker sky
          accent: "#6366f1",       // Indigo
          accentSoft: "#e0f2fe",   // Light sky
        },
      },
      boxShadow: {
        soft: "0 12px 28px rgba(15,23,42,0.08)",
        softDark: "0 12px 28px rgba(15,23,42,0.6)",
      },
    },
  },
  plugins: [],
};
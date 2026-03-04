/** @type {import('tailwindcss').Config} */
export default {
  // ❌ darkMode band
  darkMode: false,
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        silver: {
          DEFAULT: "#e5e7eb",
          dark: "#9ca3af",
        },
        rk: {
          primary: "#facc15",      // gold
          primaryDark: "#a16207",  // dark gold
          accent: "#fef3c7",       // soft gold background
          accentSoft: "#fffbeb",   // very light warm bg
        },
      },
      boxShadow: {
        soft: "0 14px 30px rgba(148,163,184,0.25)",
      },
    },
  },
  plugins: [],
};
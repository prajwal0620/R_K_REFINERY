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
        // Silver text / borders ke liye rakh sakte ho
        silver: {
          DEFAULT: "#e5e7eb", // light silver
          dark: "#9ca3af",
        },
        // GOLD + WHITE THEME
        rk: {
          // main gold
          primary: "#facc15",      // Tailwind amber-400 (bright gold)
          // darker gold (hover / sidebar start)
          primaryDark: "#a16207",  // amber-700
          // soft warm white / light gold (background accents)
          accent: "#fef3c7",       // amber-100
          // very light off-white (header / soft sections)
          accentSoft: "#fffbeb",   // amber-50
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
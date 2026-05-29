/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Roboto", "system-ui", "sans-serif"],
        display: ["Roboto", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(10 37 64 / 0.04), 0 1px 3px 0 rgb(10 37 64 / 0.06)",
        cardHover:
          "0 4px 8px -2px rgb(10 37 64 / 0.08), 0 2px 4px -1px rgb(10 37 64 / 0.06)",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--accent) / 0.35), 0 8px 30px -8px rgb(var(--accent) / 0.45)",
        soft: "0 1px 2px rgb(15 23 42 / 0.04), 0 12px 32px -16px rgb(15 23 42 / 0.18)",
      },
      keyframes: {
        ping: { "75%, 100%": { transform: "scale(2.2)", opacity: "0" } },
      },
    },
  },
  plugins: [],
};

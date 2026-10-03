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
        // Hijau muda #65A27C: stabilo, titik status, sorotan lembut
        mint: "rgb(var(--accent-soft) / <alpha-value>)",
        // Warna teks di atas bidang berwarna aksen (putih di light, gelap di dark)
        onaccent: "rgb(var(--on-accent) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
      },
      fontFamily: {
        // Teks biasa: Cabin · Header & sub header: Fraunces
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 0 rgb(var(--fg) / 0.04), 0 16px 32px -24px rgb(var(--fg) / 0.4)",
      },
    },
  },
  plugins: [],
};

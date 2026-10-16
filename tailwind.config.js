/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        // Kuning hanya untuk penghitung slide (01 / 04). Teks di atasnya selalu tinta gelap.
        mark: "rgb(var(--mark) / <alpha-value>)",
        "on-mark": "rgb(var(--on-mark) / <alpha-value>)",
        // Nama lama yang masih dipakai halaman admin, dipetakan ke token baru.
        card: "rgb(var(--surface) / <alpha-value>)",
        accent: "rgb(var(--fg) / <alpha-value>)",
        onaccent: "rgb(var(--bg) / <alpha-value>)",
      },
      fontFamily: {
        // Archivo: satu keluarga, dipakai lebar (font-wide) untuk judul dan normal untuk teks.
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Hanya untuk modal preview, satu-satunya elemen yang benar-benar melayang di atas halaman.
        soft: "0 24px 60px -30px rgb(0 0 0 / 0.5)",
      },
    },
  },
  plugins: [],
};

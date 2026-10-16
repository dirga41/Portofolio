/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        // Garis yang harus terlihat jelas (batas input, chip): kontras 3:1 ke latar
        edge: "rgb(var(--edge) / <alpha-value>)",
        // Satu warna menyala. Ganti di app/globals.css (--accent) untuk mengganti seluruh situs.
        accent: "rgb(var(--accent) / <alpha-value>)",
        onaccent: "rgb(var(--on-accent) / <alpha-value>)",
        // Nama lama yang masih dipakai halaman admin
        card: "rgb(var(--surface) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Hanya untuk modal preview, satu-satunya lapisan yang melayang di atas halaman
        soft: "0 24px 60px -30px rgb(0 0 0 / 0.7)",
      },
    },
  },
  plugins: [],
};

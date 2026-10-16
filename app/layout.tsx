import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

// Archivo punya sumbu lebar (wdth): judul diperlebar, teks biasa normal.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Programmer portfolio",
};

// Dijalankan sebelum paint agar tidak ada kedipan saat memuat tema.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={archivo.variable}>{children}</body>
    </html>
  );
}

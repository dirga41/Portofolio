"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Tombol terang/gelap dengan label teks, supaya jelas apa yang terjadi saat diklik. */
export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* penyimpanan diblokir: tema tetap berganti untuk sesi ini */
    }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark ?? false}
      className={cn(
        "inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-line px-4 text-sm font-medium text-fg transition-colors hover:border-fg",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-3.5 w-3.5 rounded-full border-2 border-fg",
          dark ? "bg-fg" : "bg-transparent",
        )}
      />
      <span>{dark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}

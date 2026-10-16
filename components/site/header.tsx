import { ThemeToggle } from "@/components/theme-toggle";

/** Header satu baris: handle di kiri, tombol tema di kanan. Tidak ada menu karena halamannya satu layar. */
export function SiteHeader({ handle }: { handle: string }) {
  return (
    <header className="container-page flex min-h-[72px] items-center justify-between gap-4">
      <a href="#main" className="font-wide text-lg font-extrabold">
        {handle}
      </a>
      <ThemeToggle />
    </header>
  );
}

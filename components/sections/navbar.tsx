import { ThemeToggle } from "@/components/theme-toggle";
import { initials } from "@/lib/utils";

const LINKS = [
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Navbar({ name }: { name: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-bg/75 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 font-display text-base font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-mono text-xs font-bold text-white">
            {initials(name)}
          </span>
          <span className="hidden sm:inline">{name || "Portfolio"}</span>
        </a>
        <nav className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm text-muted transition hover:text-fg"
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle className="ml-1" />
        </nav>
      </div>
    </header>
  );
}

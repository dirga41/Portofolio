import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export function Navbar({ name }: { name: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-bg/90 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between border-b border-line">
        <a href="#top" className="font-display text-xl italic tracking-tight">
          {name || "Portfolio"}
        </a>
        <nav className="flex items-center gap-5 sm:gap-7">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="marker hidden text-sm text-fg sm:inline"
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

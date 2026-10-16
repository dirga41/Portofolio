"use client";

import { useState } from "react";

const LINKS = [
  { href: "#works", label: "Works" },
  { href: "#experiments", label: "Experiments" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader({ handle }: { handle: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 border-b border-line bg-bg"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <div className="container-page flex min-h-[72px] items-center justify-between gap-4">
        <a href="#top" className="text-lg font-extrabold">
          {handle}
          <span className="text-accent">.</span>
        </a>

        <nav aria-label="Main" className="hidden gap-8 text-[15px] font-medium md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-accent">
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="btn-ghost min-h-[44px] px-4 text-sm md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="container-page border-t border-line pb-4 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-[52px] items-center text-2xl font-extrabold"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

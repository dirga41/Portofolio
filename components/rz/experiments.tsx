"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Web is fun." Empat eksperimen kecil yang benar-benar bisa dimainkan.
 * Ini contoh: ganti dengan eksperimenmu sendiri (atau hapus kartunya).
 */
export function Experiments() {
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [light, setLight] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function replay() {
    if (timer.current) clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(() => setLoading(false), 1600);
  }

  const card = "flex min-h-[11rem] flex-col rounded border border-line bg-surface p-5 sm:p-6";

  return (
    <section id="experiments" className="section" aria-labelledby="exp-title">
      <div className="container-page">
        <p className="eyebrow">Experiments &amp; open source</p>
        <h2 id="exp-title" className="heading mt-2">
          Web is fun.
        </h2>
        <p className="mt-3 text-muted">Small things you can play with.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-[1.3fr_1fr]">
          <div className={card}>
            <span className="text-sm font-bold text-accent">01</span>
            <h3 className="mt-1 text-xl font-bold">Spin preloader</h3>
            <div className="mt-auto flex items-center gap-4 pt-6">
              <span role="status" aria-live="polite" className="flex items-center">
                {loading ? <span className="spinner" aria-label="Loading" /> : <span className="font-bold">Loaded.</span>}
              </span>
              <button type="button" onClick={replay} className="btn-ghost ml-auto min-h-[44px] px-4">
                Replay
              </button>
            </div>
          </div>

          <div className={card}>
            <span className="text-sm font-bold text-accent">02</span>
            <h3 className="mt-1 text-xl font-bold">Expanding search</h3>
            <label htmlFor="exp-search" className="mt-auto pt-6 text-sm text-muted">
              Click the field
            </label>
            <input
              id="exp-search"
              type="search"
              placeholder="Search"
              className="search-grow mt-2 h-11 rounded border border-edge bg-bg px-3.5 text-base text-fg placeholder:text-muted focus:border-accent"
            />
          </div>

          <div className={card}>
            <span className="text-sm font-bold text-accent">03</span>
            <h3 className="mt-1 text-xl font-bold">Menu open &amp; close</h3>
            <div className="mt-auto flex flex-wrap items-center gap-5 pt-6">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-label="Toggle demo menu"
                className="relative h-12 w-12 rounded border border-fg"
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-3 right-3 top-1/2 h-0.5 bg-fg transition-transform ${menuOpen ? "rotate-45" : "-translate-y-[5px]"}`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute left-3 right-3 top-1/2 h-0.5 bg-fg transition-transform ${menuOpen ? "-rotate-45" : "translate-y-[5px]"}`}
                />
              </button>
              {menuOpen && (
                <ul className="flex flex-wrap gap-4 font-semibold">
                  <li><a href="#works" className="link">Works</a></li>
                  <li><a href="#about" className="link">About</a></li>
                  <li><a href="#contact" className="link">Contact</a></li>
                </ul>
              )}
            </div>
          </div>

          <div
            className={`${card} transition-colors ${light ? "border-fg bg-fg text-bg" : ""}`}
          >
            <span className={`text-sm font-bold ${light ? "text-bg" : "text-accent"}`}>04</span>
            <h3 className="mt-1 text-xl font-bold">Theme flip</h3>
            <button
              type="button"
              onClick={() => setLight((v) => !v)}
              aria-pressed={light}
              className="mt-auto inline-flex min-h-[44px] items-center self-start rounded border border-current px-4 text-[15px] font-bold"
            >
              {light ? "Back to dark" : "Flip to light"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

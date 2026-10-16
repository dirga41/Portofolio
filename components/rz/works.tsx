"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PreviewModal } from "@/components/preview-modal";
import type { Project } from "@/lib/types";
import { ensureUrl, normalizeTag } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Latest works." Daftar projek bernomor 0101, 0202, ...
 * Desktop: screenshot ikut kursor saat baris disorot. Klik baris untuk membuka detail.
 */
export function Works({ projects, failed }: { projects: Project[]; failed: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [finePointer, setFinePointer] = useState(false);
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState<Project | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    setFinePointer(mq.matches);
    const onChange = () => setFinePointer(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = listRef.current;
    if (!el || !finePointer) return;
    const r = el.getBoundingClientRect();
    setPos({ x: Math.min(e.clientX - r.left + 28, r.width - 300), y: e.clientY - r.top - 95 });
  }

  const hovered = projects.find((p) => p.id === hover);
  const showFloat =
    finePointer && hovered && !open && hovered.image_url && !broken[hovered.id];

  return (
    <section id="works" className="section" aria-labelledby="works-title">
      <div className="container-page">
        <p className="eyebrow">Case studies</p>
        <h2 id="works-title" className="heading mt-2">
          Latest works.
        </h2>

        {failed ? (
          <p className="mt-8 text-lg text-muted">Projects could not be loaded right now. Please refresh in a moment.</p>
        ) : projects.length === 0 ? (
          <p className="mt-8 text-lg text-muted">Projects will appear here soon.</p>
        ) : (
          <div
            ref={listRef}
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
            className="relative mt-8 border-t border-line"
          >
            {projects.map((p, i) => {
              const isOpen = open === p.id;
              const live = ensureUrl(p.live_url);
              const repo = ensureUrl(p.repo_url);
              const showImage = Boolean(p.image_url) && !broken[p.id];
              const stack = p.tags.map(normalizeTag).filter(Boolean).join(" · ");
              return (
                <div key={p.id} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : p.id)}
                    onMouseEnter={() => setHover(p.id)}
                    aria-expanded={isOpen}
                    aria-controls={`work-${p.id}`}
                    className="work-row grid w-full grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 py-5 text-left sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] sm:py-7"
                  >
                    <span className="text-sm font-bold text-accent">
                      {pad(i + 1)}
                      {pad(i + 1)}
                    </span>
                    <span className="work-title block text-[clamp(1.6rem,4vw,2.75rem)] font-extrabold leading-tight tracking-[-0.02em] [overflow-wrap:anywhere]">
                      {p.name}
                    </span>
                    <span className="col-start-2 text-sm font-semibold underline underline-offset-4 sm:col-start-3">
                      {isOpen ? "Close" : "Case study"}
                    </span>
                  </button>

                  {isOpen && (
                    <div id={`work-${p.id}`} className="grid gap-6 pb-8 sm:pl-[7.5rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                      {showImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url}
                          alt={`Screenshot of ${p.name}`}
                          onError={() => setBroken((b) => ({ ...b, [p.id]: true }))}
                          className="aspect-[16/10] w-full rounded border border-line object-cover object-top"
                        />
                      ) : (
                        <div className="grid aspect-[16/10] w-full place-items-center rounded border border-line text-sm text-muted">
                          No screenshot yet
                        </div>
                      )}
                      <div>
                        {p.description && <p className="text-lg leading-relaxed">{p.description}</p>}
                        {stack && <p className="mt-3 text-[15px] text-muted">{stack}</p>}
                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                          {(live || showImage) && (
                            <button type="button" onClick={() => setPreview(p)} className="btn-primary">
                              Preview here
                            </button>
                          )}
                          {live && (
                            <a href={live} target="_blank" rel="noreferrer" className="link inline-flex min-h-[44px] items-center font-semibold">
                              Visit site<span className="sr-only"> (opens in a new tab)</span>
                            </a>
                          )}
                          {repo && (
                            <a href={repo} target="_blank" rel="noreferrer" className="link inline-flex min-h-[44px] items-center font-semibold">
                              Source code<span className="sr-only"> (opens in a new tab)</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {showFloat && hovered && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hovered.image_url}
                alt=""
                aria-hidden="true"
                onError={() => setBroken((b) => ({ ...b, [hovered.id]: true }))}
                style={{ left: pos.x, top: pos.y }}
                className="pointer-events-none absolute z-10 hidden h-[180px] w-[280px] -rotate-3 rounded border-2 border-accent object-cover object-top md:block"
              />
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {preview && <PreviewModal project={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </section>
  );
}

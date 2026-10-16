"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { PreviewModal } from "@/components/preview-modal";
import type { Project } from "@/lib/types";
import { ensureUrl, normalizeTag } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Satu projek per layar. Pindah dengan tombol, angka, panah kiri/kanan
 * (saat area projek difokus), atau geser di layar sentuh.
 */
export function ProjectSlider({ projects, failed }: { projects: Project[]; failed: boolean }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [preview, setPreview] = useState<Project | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();

  if (failed) {
    return (
      <section className="area-work" aria-label="Projects">
        <div className="rounded-sm border border-line bg-surface p-6">
          <p className="font-wide text-xl font-bold">Projects could not be loaded right now.</p>
          <p className="mt-2 text-muted">Please refresh the page in a moment.</p>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="area-work" aria-label="Projects">
        <div className="rounded-sm border border-line bg-surface p-6">
          <p className="font-wide text-xl font-bold">Projects will appear here soon.</p>
        </div>
      </section>
    );
  }

  const total = projects.length;
  const i = Math.min(index, total - 1);
  const project = projects[i];
  const nextProject = projects[(i + 1) % total];
  const live = ensureUrl(project.live_url);
  const repo = ensureUrl(project.repo_url);
  const showImage = Boolean(project.image_url) && !brokenImages[project.id];
  const canPreview = Boolean(live || showImage);
  const stack = project.tags.map(normalizeTag).filter(Boolean).join(" · ");

  function go(to: number) {
    const target = ((to % total) + total) % total;
    if (target === i) return;
    setDir(to > i ? 1 : -1);
    setIndex(target);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(i + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(i - 1);
    }
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) go(i + 1);
    else if (info.offset.x > 60) go(i - 1);
  }

  const offset = reduce ? 0 : 36;

  return (
    <section
      className="area-work"
      aria-roledescription="carousel"
      aria-label="Projects. Use the left and right arrow keys to move between them."
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <p className="sr-only" aria-live="polite">
        Project {i + 1} of {total}: {project.name}
      </p>

      <article className="rounded-sm border border-line bg-surface p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="bg-mark px-2.5 py-1 font-wide text-sm font-bold text-on-mark">
            {pad(i + 1)} / {pad(total)}
          </span>
          {total > 1 && (
            <span className="text-sm text-muted">Up next: {nextProject.name}</span>
          )}
        </div>

        <div className="relative mt-4 overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={project.id}
              custom={dir}
              initial={{ opacity: 0, x: dir * offset }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -dir * offset }}
              transition={{ duration: reduce ? 0 : 0.25, ease: [0.2, 0.7, 0.2, 1] }}
              drag={total > 1 && !reduce ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={onDragEnd}
              className="touch-pan-y"
            >
              <div className="aspect-[16/9] overflow-hidden border border-line bg-bg">
                {showImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image_url}
                    alt={`Screenshot of ${project.name}`}
                    draggable={false}
                    onError={() => setBrokenImages((b) => ({ ...b, [project.id]: true }))}
                    className="h-full w-full select-none object-cover object-top"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-sm text-muted">
                    No screenshot yet
                  </div>
                )}
              </div>

              <h2 className="mt-5 font-wide text-[clamp(1.6rem,3.4vw,2.2rem)] font-extrabold leading-tight tracking-[-0.01em]">
                {project.name}
              </h2>
              {project.description && (
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">{project.description}</p>
              )}
              {stack && <p className="mt-2 text-sm text-muted">{stack}</p>}
            </motion.div>
          </AnimatePresence>
        </div>

        {(canPreview || live || repo) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
            {canPreview && (
              <button
                type="button"
                onClick={() => setPreview(project)}
                className="link min-h-[44px] text-[15px] font-semibold"
              >
                Preview here
              </button>
            )}
            {live && (
              <a href={live} target="_blank" rel="noreferrer" className="link inline-flex min-h-[44px] items-center text-[15px]">
                Visit site<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {repo && (
              <a href={repo} target="_blank" rel="noreferrer" className="link inline-flex min-h-[44px] items-center text-[15px]">
                Source code<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        )}

        {total > 1 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <div className="grid flex-1 grid-cols-2 gap-2 sm:flex-none">
              <button type="button" onClick={() => go(i - 1)} className="btn-ghost">
                Previous
              </button>
              <button type="button" onClick={() => go(i + 1)} className="btn-primary">
                Next
              </button>
            </div>
            <div role="group" aria-label="Jump to project" className="flex flex-wrap">
              {projects.map((p, k) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => go(k)}
                  aria-label={`Project ${k + 1}: ${p.name}`}
                  aria-current={k === i ? "true" : undefined}
                  className={`grid h-11 w-11 place-items-center text-sm ${
                    k === i ? "font-extrabold text-fg underline underline-offset-4" : "font-medium text-muted hover:text-fg"
                  }`}
                >
                  {pad(k + 1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </article>

      {total > 1 && (
        <p className="mt-3 hidden text-sm text-muted lg:block">
          Tip: click this area, then use the left and right arrow keys.
        </p>
      )}

      <AnimatePresence>
        {preview && <PreviewModal project={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </section>
  );
}

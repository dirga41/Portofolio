"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Eye, X } from "lucide-react";
import { PreviewModal } from "@/components/preview-modal";
import { TiltCard } from "@/components/tilt-card";
import { SectionHeading } from "./section-heading";
import type { Project, Skill } from "@/lib/types";
import { cn, ensureUrl, hostOf, normalizeTag } from "@/lib/utils";

/**
 * Skills + Projects dalam satu komponen karena keduanya berbagi state:
 * klik sebuah skill → daftar projek tersaring berdasarkan hashtag itu.
 */
export function Showcase({ skills, projects }: { skills: Skill[]; projects: Project[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [preview, setPreview] = useState<Project | null>(null);

  const groups = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const s of skills) {
      const key = s.category.trim() || "General";
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return Array.from(map.entries());
  }, [skills]);

  // Berapa projek yang memakai tiap tag — ditampilkan sebagai angka kecil di samping skill.
  const tagCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) {
      for (const t of new Set(p.tags.map(normalizeTag))) map.set(t, (map.get(t) ?? 0) + 1);
    }
    return map;
  }, [projects]);

  const visible = activeTag
    ? projects.filter((p) => p.tags.some((t) => normalizeTag(t) === activeTag))
    : projects;

  function toggleTag(raw: string) {
    const tag = normalizeTag(raw);
    setActiveTag((cur) => (cur === tag ? null : tag));
  }

  return (
    <>
      {/* ───────────── SKILLS: daftar indeks, bukan kotak-kotak pill ───────────── */}
      <section id="skills" className="py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading index="01" title="Tools & skills">
            Click any tag to filter the work below. The small number shows how many projects use it.
          </SectionHeading>

          {groups.length === 0 ? (
            <p className="text-sm text-muted">No skills yet. Add them from the admin page.</p>
          ) : (
            <div className="border-b border-line">
              {groups.map(([category, items]) => (
                <div
                  key={category}
                  className="grid gap-x-8 gap-y-4 border-t border-line py-7 md:grid-cols-12"
                >
                  <h3 className="font-display text-2xl italic md:col-span-3">{category}</h3>
                  <ul className="flex flex-wrap gap-x-6 gap-y-3 md:col-span-9">
                    {items.map((s) => {
                      const tag = normalizeTag(s.name);
                      const active = activeTag === tag;
                      const count = tagCounts.get(tag);
                      return (
                        <li key={s.id}>
                          <motion.button
                            type="button"
                            onClick={() => toggleTag(s.name)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 420, damping: 20 }}
                            aria-pressed={active}
                            data-active={active}
                            className={cn(
                              "marker text-xl font-medium tracking-tight sm:text-2xl",
                              active ? "text-accent" : "text-fg",
                            )}
                          >
                            <span className="text-muted">#</span>
                            {tag}
                            {count !== undefined && (
                              <sup className="ml-1 text-[0.5em] font-semibold text-accent">{count}</sup>
                            )}
                          </motion.button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───────────── PROJECTS: baris besar berselang-seling ───────────── */}
      <section id="projects" className="bg-card py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading index="02" title="Selected work">
            {activeTag ? (
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className="inline-flex items-center gap-2 rounded-full border border-fg/25 px-4 py-2 text-sm font-medium text-fg transition hover:border-fg"
              >
                Showing #{activeTag} <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              "Open a preview to look around before visiting the live site."
            )}
          </SectionHeading>

          {projects.length === 0 ? (
            <p className="text-sm text-muted">No projects yet. Add them from the admin page.</p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-muted">
              No project tagged <span className="font-medium text-accent">#{activeTag}</span> yet.
            </p>
          ) : (
            <motion.ul layout className="grid gap-20 sm:gap-28">
              <AnimatePresence mode="popLayout">
                {visible.map((p, i) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                  >
                    <ProjectRow
                      project={p}
                      index={i}
                      activeTag={activeTag}
                      onTag={toggleTag}
                      onPreview={() => setPreview(p)}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </section>

      <AnimatePresence>
        {preview && <PreviewModal project={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </>
  );
}

function ProjectRow({
  project,
  index,
  activeTag,
  onTag,
  onPreview,
}: {
  project: Project;
  index: number;
  activeTag: string | null;
  onTag: (tag: string) => void;
  onPreview: () => void;
}) {
  const live = ensureUrl(project.live_url);
  const repo = ensureUrl(project.repo_url);
  const canPreview = Boolean(live || project.image_url);
  const flip = index % 2 === 1;

  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Mockup browser */}
      <div className={cn("lg:col-span-7", flip && "lg:order-2")}>
        <TiltCard className="overflow-hidden rounded-md border border-line bg-bg shadow-soft">
          <button
            type="button"
            onClick={onPreview}
            disabled={!canPreview}
            aria-label={`Preview ${project.name}`}
            className="relative block w-full text-left disabled:cursor-default"
          >
            <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
              <span className="h-2 w-2 rounded-full border border-muted/60" />
              <span className="h-2 w-2 rounded-full border border-muted/60" />
              <span className="h-2 w-2 rounded-full border border-muted/60" />
              <span className="ml-3 truncate text-xs text-muted">
                {live ? hostOf(live) : repo ? hostOf(repo) : "preview"}
              </span>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
              {project.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image_url}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-accent/10">
                  <span className="font-display text-[9rem] italic leading-none text-accent/70">
                    {project.name.slice(0, 1).toUpperCase()}
                  </span>
                </div>
              )}
              {canPreview && (
                <span className="absolute bottom-4 left-4 inline-flex translate-y-3 items-center gap-2 rounded-full bg-fg px-4 py-2 text-xs font-semibold text-bg opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Eye className="h-4 w-4" /> Open preview
                </span>
              )}
            </div>
          </button>
        </TiltCard>
      </div>

      {/* Teks */}
      <div className={cn("lg:col-span-5", flip && "lg:order-1")}>
        <p className="font-display text-lg italic text-accent">
          No. {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 font-display text-4xl leading-[1.02] tracking-[-0.025em] sm:text-5xl">
          {project.name}
        </h3>
        {project.description && (
          <p className="mt-5 text-base leading-relaxed text-muted">{project.description}</p>
        )}

        {project.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
            {project.tags.map((t) => {
              const tag = normalizeTag(t);
              const active = activeTag === tag;
              return (
                <li key={tag}>
                  <button
                    type="button"
                    onClick={() => onTag(tag)}
                    data-active={active}
                    className={cn("marker hashtag", active ? "text-accent" : "text-fg")}
                  >
                    <span className="text-muted">#</span>
                    {tag}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5 text-sm font-medium">
          {canPreview && (
            <button type="button" onClick={onPreview} className="btn-primary px-5 py-2.5">
              <Eye className="h-4 w-4" /> Preview
            </button>
          )}
          {live && (
            <a href={live} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1">
              Visit site <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
          {repo && (
            <a href={repo} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1">
              Source code <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

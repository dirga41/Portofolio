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
      {/* ───────────── SKILLS: daftar ringkas per kategori ───────────── */}
      <section id="skills" className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading title="Skills">
            Click a tag to filter the work below.
          </SectionHeading>

          {groups.length === 0 ? (
            <p className="text-sm text-muted">No skills yet. Add them from the admin page.</p>
          ) : (
            <dl className="grid gap-y-7">
              {groups.map(([category, items]) => (
                <div key={category} className="grid gap-x-8 gap-y-2 sm:grid-cols-[11rem_1fr]">
                  <dt className="pt-1 text-base font-semibold text-muted">{category}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-x-5 gap-y-2">
                      {items.map((s) => {
                        const tag = normalizeTag(s.name);
                        const active = activeTag === tag;
                        const count = tagCounts.get(tag);
                        return (
                          <li key={s.id}>
                            <motion.button
                              type="button"
                              onClick={() => toggleTag(s.name)}
                              whileHover={{ y: -1.5 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 420, damping: 20 }}
                              aria-pressed={active}
                              data-active={active}
                              className={cn(
                                "marker text-lg font-medium sm:text-xl",
                                active ? "text-accent" : "text-fg",
                              )}
                            >
                              <span className="text-muted">#</span>
                              {tag}
                              {count !== undefined && (
                                <sup className="ml-0.5 text-[11px] font-semibold text-accent">{count}</sup>
                              )}
                            </motion.button>
                          </li>
                        );
                      })}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* ───────────── PROJECTS: dua kolom, kolom kanan turun sedikit ───────────── */}
      <section id="projects" className="border-y border-line bg-card py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading title="Selected work">
            {activeTag ? (
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 px-3.5 py-1.5 text-sm font-medium text-accent transition hover:border-accent"
              >
                #{activeTag} <X className="h-3 w-3" />
              </button>
            ) : (
              "Open a preview before visiting the live site."
            )}
          </SectionHeading>

          {projects.length === 0 ? (
            <p className="text-sm text-muted">No projects yet. Add them from the admin page.</p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-muted">
              No project tagged <span className="font-medium text-accent">#{activeTag}</span> yet.
            </p>
          ) : (
            <motion.ul
              layout
              className="grid gap-x-10 gap-y-14 sm:grid-cols-2 sm:[&>li:nth-child(even)]:mt-16"
            >
              <AnimatePresence mode="popLayout">
                {visible.map((p) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                  >
                    <ProjectCard
                      project={p}
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

function ProjectCard({
  project,
  activeTag,
  onTag,
  onPreview,
}: {
  project: Project;
  activeTag: string | null;
  onTag: (tag: string) => void;
  onPreview: () => void;
}) {
  const live = ensureUrl(project.live_url);
  const repo = ensureUrl(project.repo_url);
  const canPreview = Boolean(live || project.image_url);

  return (
    <article>
      {/* Mockup browser */}
      <TiltCard className="overflow-hidden rounded-md border border-line bg-bg shadow-soft">
        <button
          type="button"
          onClick={onPreview}
          disabled={!canPreview}
          aria-label={`Preview ${project.name}`}
          className="relative block w-full text-left disabled:cursor-default"
        >
          <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-line" />
            <span className="h-1.5 w-1.5 rounded-full bg-line" />
            <span className="h-1.5 w-1.5 rounded-full bg-line" />
            <span className="ml-2 truncate text-xs text-muted">
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
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-mint/20">
                <span className="font-display text-7xl italic text-accent">
                  {project.name.slice(0, 1).toUpperCase()}
                </span>
              </div>
            )}
            {canPreview && (
              <span className="absolute bottom-3 left-3 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-fg px-3.5 py-2 text-xs font-semibold text-bg opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <Eye className="h-3.5 w-3.5" /> Open preview
              </span>
            )}
          </div>
        </button>
      </TiltCard>

      {/* Teks */}
      <h3 className="mt-5 font-display text-2xl tracking-[-0.015em] sm:text-[1.75rem]">{project.name}</h3>
      {project.description && (
        <p className="mt-2 text-base leading-relaxed text-muted">{project.description}</p>
      )}

      {project.tags.length > 0 && (
        <ul className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5">
          {project.tags.map((t) => {
            const tag = normalizeTag(t);
            const active = activeTag === tag;
            return (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => onTag(tag)}
                  data-active={active}
                  className={cn("marker hashtag", active ? "text-accent" : "text-fg/80")}
                >
                  <span className="text-muted">#</span>
                  {tag}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] font-medium">
        {canPreview && (
          <button type="button" onClick={onPreview} className="link inline-flex items-center gap-1.5 text-accent">
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
        )}
        {live && (
          <a href={live} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1">
            Visit site <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
        {repo && (
          <a href={repo} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1">
            Source <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}

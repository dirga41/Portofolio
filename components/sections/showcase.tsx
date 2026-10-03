"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Eye, Github, X } from "lucide-react";
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

  const usedTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) for (const t of p.tags) set.add(normalizeTag(t));
    return set;
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
      {/* ───────────── SKILLS ───────────── */}
      <section id="skills" className="border-b border-line py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading index="01" kicker="skills" title="What I work with">
            <p className="max-w-xs text-sm text-muted">
              Click a tag to filter the projects that use it.
            </p>
          </SectionHeading>

          {groups.length === 0 ? (
            <p className="text-sm text-muted">No skills yet. Add them from the admin page.</p>
          ) : (
            <div className="divide-y divide-line border-y border-line">
              {groups.map(([category, items]) => (
                <div key={category} className="grid gap-4 py-6 sm:grid-cols-[200px_1fr] sm:gap-8">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-muted">
                    {category}
                  </h3>
                  <ul className="flex flex-wrap gap-2.5">
                    {items.map((s) => {
                      const tag = normalizeTag(s.name);
                      const active = activeTag === tag;
                      const used = usedTags.has(tag);
                      return (
                        <li key={s.id}>
                          <motion.button
                            type="button"
                            onClick={() => toggleTag(s.name)}
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: "spring", stiffness: 400, damping: 18 }}
                            aria-pressed={active}
                            className={cn(
                              "hashtag rounded-full border px-3.5 py-2 transition-[color,background-color,border-color,box-shadow] duration-200",
                              active
                                ? "border-accent bg-accent text-white shadow-glow"
                                : "border-line bg-card text-fg hover:border-accent hover:text-accent hover:shadow-glow",
                            )}
                          >
                            <span className={active ? "text-white/70" : "text-accent"}>#</span>
                            {tag}
                            {used && !active && (
                              <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
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

      {/* ───────────── PROJECTS ───────────── */}
      <section id="projects" className="border-b border-line py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading index="02" kicker="projects" title="Selected work">
            {activeTag && (
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className="hashtag inline-flex items-center gap-2 rounded-full border border-accent bg-accent/10 px-3.5 py-2 text-accent"
              >
                #{activeTag} <X className="h-3.5 w-3.5" />
              </button>
            )}
          </SectionHeading>

          {projects.length === 0 ? (
            <p className="text-sm text-muted">No projects yet. Add them from the admin page.</p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-muted">
              No project tagged <span className="hashtag text-accent">#{activeTag}</span> yet.
            </p>
          ) : (
            <motion.ul layout className="grid gap-6 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {visible.map((p) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
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
    <TiltCard className="flex flex-col">
      {/* Mockup browser box */}
      <button
        type="button"
        onClick={onPreview}
        disabled={!canPreview}
        aria-label={`Preview ${project.name}`}
        className="relative z-20 m-3 mb-0 block overflow-hidden rounded-xl border border-line bg-bg text-left disabled:cursor-default"
      >
        <div className="flex items-center gap-2 border-b border-line px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="ml-2 truncate font-mono text-[11px] text-muted">
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
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="dots grid h-full w-full place-items-center">
              <span className="font-display text-6xl font-semibold text-accent/80">
                {project.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
          )}
          {canPreview && (
            <span className="absolute inset-0 grid place-items-center bg-black/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900">
                <Eye className="h-4 w-4" /> Live preview
              </span>
            </span>
          )}
        </div>
      </button>

      <div className="relative z-20 flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold tracking-tight">{project.name}</h3>
        {project.description && (
          <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>
        )}

        {project.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((t) => {
              const tag = normalizeTag(t);
              return (
                <li key={tag}>
                  <button
                    type="button"
                    onClick={() => onTag(tag)}
                    className={cn(
                      "hashtag rounded-md px-2 py-1 transition",
                      activeTag === tag
                        ? "bg-accent text-white"
                        : "bg-accent/10 text-accent hover:bg-accent/20",
                    )}
                  >
                    #{tag}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          {canPreview && (
            <button type="button" onClick={onPreview} className="btn-primary px-3.5 py-2 text-xs">
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
          )}
          {live && (
            <a href={live} target="_blank" rel="noreferrer" className="btn-ghost px-3.5 py-2 text-xs">
              <ExternalLink className="h-3.5 w-3.5" /> Live
            </a>
          )}
          {repo && (
            <a href={repo} target="_blank" rel="noreferrer" className="btn-ghost px-3.5 py-2 text-xs">
              <Github className="h-3.5 w-3.5" /> Code
            </a>
          )}
        </div>
      </div>
    </TiltCard>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, Pencil, Plus, Save, X } from "lucide-react";
import { deleteProject, saveProject } from "@/app/admin/actions";
import type { Project } from "@/lib/types";
import { ensureUrl, parseTags } from "@/lib/utils";
import { ConfirmDelete, ImageField, type Notify } from "./ui";

interface Draft {
  id?: string;
  name: string;
  description: string;
  live_url: string;
  repo_url: string;
  image_url: string;
  tagsText: string;
  sort_order: number;
}

const EMPTY: Draft = {
  name: "",
  description: "",
  live_url: "",
  repo_url: "",
  image_url: "",
  tagsText: "",
  sort_order: 0,
};

export function ProjectsManager({ projects, notify }: { projects: Project[]; notify: Notify }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [pending, start] = useTransition();

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  function edit(p: Project) {
    setDraft({
      id: p.id,
      name: p.name,
      description: p.description,
      live_url: p.live_url,
      repo_url: p.repo_url,
      image_url: p.image_url,
      tagsText: p.tags.map((t) => `#${t}`).join(" "),
      sort_order: p.sort_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    start(async () => {
      const { tagsText, ...rest } = draft;
      const res = await saveProject({ ...rest, tags: parseTags(tagsText) });
      if (res.ok) {
        notify("ok", draft.id ? "Projek diperbarui." : "Projek ditambahkan.");
        setDraft(null);
        router.refresh();
      } else {
        notify("error", res.error);
      }
    });
  }

  function remove(id: string) {
    start(async () => {
      const res = await deleteProject(id);
      if (res.ok) {
        notify("ok", "Projek dihapus.");
        if (draft?.id === id) setDraft(null);
        router.refresh();
      } else {
        notify("error", res.error);
      }
    });
  }

  return (
    <div className="grid gap-6">
      {draft ? (
        <form onSubmit={submit} className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">
              {draft.id ? "Edit projek" : "Projek baru"}
            </h2>
            <button
              type="button"
              onClick={() => setDraft(null)}
              aria-label="Batal"
              className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-bg hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="pr-name" className="label">
                Nama projek *
              </label>
              <input
                id="pr-name"
                required
                className="input"
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="pr-order" className="label">
                Urutan (angka kecil tampil lebih dulu)
              </label>
              <input
                id="pr-order"
                type="number"
                className="input"
                value={draft.sort_order}
                onChange={(e) => set("sort_order", Number(e.target.value))}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pr-desc" className="label">
                Tujuan / deskripsi
              </label>
              <textarea
                id="pr-desc"
                rows={3}
                className="input resize-y"
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Masalah apa yang diselesaikan dan untuk siapa."
              />
            </div>
            <div>
              <label htmlFor="pr-live" className="label">
                Link live (dipakai untuk live preview)
              </label>
              <input
                id="pr-live"
                className="input"
                value={draft.live_url}
                onChange={(e) => set("live_url", e.target.value)}
                placeholder="https://projek.vercel.app"
              />
            </div>
            <div>
              <label htmlFor="pr-repo" className="label">
                Link repository
              </label>
              <input
                id="pr-repo"
                className="input"
                value={draft.repo_url}
                onChange={(e) => set("repo_url", e.target.value)}
                placeholder="https://github.com/user/repo"
              />
            </div>
            <div className="sm:col-span-2">
              <ImageField
                id="pr-image"
                label="Gambar preview"
                value={draft.image_url}
                onChange={(url) => set("image_url", url)}
                folder="projects"
                notify={notify}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pr-tags" className="label">
                Hashtag tech stack (pisahkan dengan spasi atau koma)
              </label>
              <input
                id="pr-tags"
                className="input font-mono"
                value={draft.tagsText}
                onChange={(e) => set("tagsText", e.target.value)}
                placeholder="#nextjs #tailwind #supabase"
              />
              {parseTags(draft.tagsText).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {parseTags(draft.tagsText).map((t) => (
                    <span key={t} className="hashtag rounded-md bg-accent/10 px-2 py-1 text-accent">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={() => setDraft(null)} className="btn-ghost">
              Batal
            </button>
            <button type="submit" disabled={pending} className="btn-primary">
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan projek
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-end">
          <button type="button" onClick={() => setDraft({ ...EMPTY })} className="btn-primary">
            <Plus className="h-4 w-4" /> Tambah projek
          </button>
        </div>
      )}

      {projects.length === 0 ? (
        <p className="card p-8 text-center text-sm text-muted">
          Belum ada projek. Klik “Tambah projek” untuk memulai.
        </p>
      ) : (
        <ul className="grid gap-3">
          {projects.map((p) => (
            <li key={p.id} className="card flex flex-wrap items-center gap-4 p-4">
              <div className="dots h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-bg">
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-semibold">{p.name}</p>
                <p className="truncate text-xs text-muted">{p.description || "—"}</p>
                <p className="hashtag mt-1 truncate text-accent">
                  {p.tags.map((t) => `#${t}`).join(" ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {p.live_url && (
                  <a
                    href={ensureUrl(p.live_url)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Buka link live"
                    className="btn border border-line px-3 py-2 text-xs text-muted hover:text-accent"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <button type="button" onClick={() => edit(p)} className="btn-ghost px-3 py-2 text-xs">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <ConfirmDelete disabled={pending} onConfirm={() => remove(p.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

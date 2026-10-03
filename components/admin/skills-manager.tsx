"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, X } from "lucide-react";
import { deleteSkill, saveSkill } from "@/app/admin/actions";
import type { Skill } from "@/lib/types";
import { cn, normalizeTag } from "@/lib/utils";
import { ConfirmDelete, type Notify } from "./ui";

interface Draft {
  id?: string;
  name: string;
  category: string;
  sort_order: number;
}

const EMPTY: Draft = { name: "", category: "", sort_order: 0 };

export function SkillsManager({ skills, notify }: { skills: Skill[]; notify: Notify }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [pending, start] = useTransition();

  const categories = useMemo(
    () => Array.from(new Set(skills.map((s) => s.category.trim()).filter(Boolean))),
    [skills],
  );

  const groups = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const s of skills) {
      const key = s.category.trim() || "Tanpa kategori";
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return Array.from(map.entries());
  }, [skills]);

  const preview = normalizeTag(draft.name);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!preview) return;
    start(async () => {
      const res = await saveSkill(draft);
      if (res.ok) {
        notify("ok", draft.id ? "Skill diperbarui." : `#${preview} ditambahkan.`);
        // Pertahankan kategori agar cepat menambah beberapa skill sekaligus.
        setDraft({ ...EMPTY, category: draft.id ? "" : draft.category });
        router.refresh();
      } else {
        notify("error", res.error);
      }
    });
  }

  function remove(id: string) {
    start(async () => {
      const res = await deleteSkill(id);
      if (res.ok) {
        notify("ok", "Skill dihapus.");
        setDraft(EMPTY);
        router.refresh();
      } else {
        notify("error", res.error);
      }
    });
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={submit} className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {draft.id ? "Edit skill" : "Tambah skill"}
          </h2>
          {draft.id && (
            <button
              type="button"
              onClick={() => setDraft(EMPTY)}
              className="flex items-center gap-1 text-xs text-muted hover:text-fg"
            >
              <X className="h-3.5 w-3.5" /> Batal edit
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_110px]">
          <div>
            <label htmlFor="sk-name" className="label">
              Skill (hashtag)
            </label>
            <input
              id="sk-name"
              required
              className="input font-mono"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="#react"
            />
          </div>
          <div>
            <label htmlFor="sk-cat" className="label">
              Kategori (opsional)
            </label>
            <input
              id="sk-cat"
              list="sk-cats"
              className="input"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              placeholder="Frontend, Design, Tools…"
            />
            <datalist id="sk-cats">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor="sk-order" className="label">
              Urutan
            </label>
            <input
              id="sk-order"
              type="number"
              className="input"
              value={draft.sort_order}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted">
            Tampil sebagai:{" "}
            <span className="hashtag rounded-full border border-line px-2.5 py-1 text-fg">
              <span className="text-accent">#</span>
              {preview || "skill"}
            </span>
          </p>
          <div className="flex gap-2">
            {draft.id && <ConfirmDelete disabled={pending} onConfirm={() => remove(draft.id!)} />}
            <button type="submit" disabled={pending || !preview} className="btn-primary">
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : draft.id ? (
                <Save className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {draft.id ? "Simpan" : "Tambah"}
            </button>
          </div>
        </div>
      </form>

      {skills.length === 0 ? (
        <p className="card p-8 text-center text-sm text-muted">
          Belum ada skill. Tambahkan lewat form di atas.
        </p>
      ) : (
        <div className="card divide-y divide-line">
          {groups.map(([category, items]) => (
            <div key={category} className="grid gap-3 p-5 sm:grid-cols-[160px_1fr]">
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted">{category}</h3>
              <ul className="flex flex-wrap gap-2">
                {items.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          id: s.id,
                          name: s.name,
                          category: s.category,
                          sort_order: s.sort_order,
                        })
                      }
                      title="Klik untuk edit / hapus"
                      className={cn(
                        "hashtag rounded-full border px-3 py-1.5 transition",
                        draft.id === s.id
                          ? "border-accent bg-accent text-white"
                          : "border-line bg-bg hover:border-accent hover:text-accent",
                      )}
                    >
                      #{s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted">Klik sebuah tag untuk mengedit atau menghapusnya.</p>
    </div>
  );
}

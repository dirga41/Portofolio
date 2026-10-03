"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSession, destroySession, isAuthed, isPasswordConfigured, verifyPassword } from "@/lib/auth";
import { getSupabase, STORAGE_BUCKET } from "@/lib/supabase";
import { SOCIALS } from "@/lib/socials";
import type { ActionResult, Profile, ProjectInput, SkillInput } from "@/lib/types";
import { ensureUrl, normalizeTag } from "@/lib/utils";

/* ───────────── AUTH ───────────── */

export async function login(password: string): Promise<ActionResult> {
  if (!isPasswordConfigured()) {
    return { ok: false, error: "ADMIN_PASSWORD belum diisi di environment variable." };
  }
  if (!verifyPassword(String(password ?? ""))) {
    // Perlambat percobaan tebak-tebakan.
    await new Promise((r) => setTimeout(r, 700));
    return { ok: false, error: "Password salah." };
  }
  createSession();
  revalidatePath("/admin");
  return { ok: true };
}

export async function logout(): Promise<ActionResult> {
  destroySession();
  revalidatePath("/admin");
  return { ok: true };
}

/* ───────────── HELPER ───────────── */

async function withDb<T>(fn: (db: SupabaseClient) => Promise<T>): Promise<ActionResult<T>> {
  if (!isAuthed()) return { ok: false, error: "Sesi berakhir. Silakan login ulang." };
  const db = getSupabase();
  if (!db) return { ok: false, error: "Supabase belum dikonfigurasi (cek environment variable)." };
  try {
    const data = await fn(db);
    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Terjadi kesalahan." };
  }
}

function clean(v: unknown, max = 2000): string {
  return String(v ?? "").trim().slice(0, max);
}

/* ───────────── PROFILE ───────────── */

export async function saveProfile(input: Profile): Promise<ActionResult> {
  return withDb(async (db) => {
    const socials: Record<string, string> = {};
    for (const s of SOCIALS) {
      const url = ensureUrl(clean(input.socials?.[s.key], 500));
      if (url) socials[s.key] = url;
    }

    const { error } = await db.from("profile").upsert({
      id: 1,
      name: clean(input.name, 120),
      roles: (input.roles ?? []).map((r) => clean(r, 80)).filter(Boolean).slice(0, 12),
      bio: clean(input.bio),
      avatar_url: ensureUrl(clean(input.avatar_url, 1000)),
      whatsapp: clean(input.whatsapp, 30),
      email: clean(input.email, 200),
      location: clean(input.location, 120),
      available: Boolean(input.available),
      availability_text: clean(input.availability_text, 60),
      socials,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    return undefined;
  });
}

/* ───────────── PROJECTS ───────────── */

export async function saveProject(input: ProjectInput): Promise<ActionResult> {
  return withDb(async (db) => {
    const name = clean(input.name, 160);
    if (!name) throw new Error("Nama projek wajib diisi.");

    const row = {
      name,
      description: clean(input.description),
      live_url: ensureUrl(clean(input.live_url, 1000)),
      repo_url: ensureUrl(clean(input.repo_url, 1000)),
      image_url: ensureUrl(clean(input.image_url, 1000)),
      tags: Array.from(new Set((input.tags ?? []).map(normalizeTag).filter(Boolean))).slice(0, 20),
      sort_order: Number.isFinite(Number(input.sort_order)) ? Math.trunc(Number(input.sort_order)) : 0,
    };

    const { error } = input.id
      ? await db.from("projects").update(row).eq("id", input.id)
      : await db.from("projects").insert(row);
    if (error) throw new Error(error.message);
    return undefined;
  });
}

export async function deleteProject(id: string): Promise<ActionResult> {
  return withDb(async (db) => {
    const { error } = await db.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return undefined;
  });
}

/* ───────────── SKILLS ───────────── */

export async function saveSkill(input: SkillInput): Promise<ActionResult> {
  return withDb(async (db) => {
    const name = normalizeTag(clean(input.name, 60));
    if (!name) throw new Error("Nama skill wajib diisi.");

    const row = {
      name,
      category: clean(input.category, 60),
      sort_order: Number.isFinite(Number(input.sort_order)) ? Math.trunc(Number(input.sort_order)) : 0,
    };

    const { error } = input.id
      ? await db.from("skills").update(row).eq("id", input.id)
      : await db.from("skills").insert(row);
    if (error) throw new Error(error.message);
    return undefined;
  });
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  return withDb(async (db) => {
    const { error } = await db.from("skills").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return undefined;
  });
}

/* ───────────── UPLOAD GAMBAR ───────────── */

const MAX_UPLOAD = 4 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function uploadImage(formData: FormData): Promise<ActionResult<string>> {
  return withDb(async (db) => {
    const file = formData.get("file");
    const folder = clean(formData.get("folder"), 20) === "avatar" ? "avatar" : "projects";
    if (!(file instanceof File) || file.size === 0) throw new Error("File tidak ditemukan.");
    const ext = ALLOWED[file.type];
    if (!ext) throw new Error("Format harus JPG, PNG, WEBP, GIF, atau AVIF.");
    if (file.size > MAX_UPLOAD) throw new Error("Ukuran gambar maksimal 4 MB.");

    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await db.storage
      .from(STORAGE_BUCKET)
      .upload(path, Buffer.from(await file.arrayBuffer()), {
        contentType: file.type,
        cacheControl: "31536000",
      });
    if (error) throw new Error(`Upload gagal: ${error.message}`);

    return db.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  });
}

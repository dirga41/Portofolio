"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { saveProfile } from "@/app/admin/actions";
import { SOCIALS } from "@/lib/socials";
import type { Profile, SocialKey } from "@/lib/types";
import type { Notify } from "./ui";

/**
 * Profil anonim: handle, satu kalimat, kontak. Tidak ada foto profil.
 * Kolom lama di database (foto, peran, lokasi, status) tetap disimpan apa adanya.
 */
export function ProfileForm({ profile, notify }: { profile: Profile; notify: Notify }) {
  const router = useRouter();
  const [form, setForm] = useState<Profile>(profile);
  const [pending, start] = useTransition();

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function setSocial(key: SocialKey, value: string) {
    setForm((f) => ({ ...f, socials: { ...f.socials, [key]: value } }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await saveProfile(form);
      if (res.ok) {
        notify("ok", "Profil tersimpan.");
        router.refresh();
      } else {
        notify("error", res.error);
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <section className="card p-6">
        <h2 className="text-lg font-bold">Identitas</h2>
        <div className="mt-5 grid gap-5">
          <div>
            <label htmlFor="p-name" className="label">
              Handle (nama yang tampil, boleh samaran)
            </label>
            <input
              id="p-name"
              className="input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="contoh: nightbuild"
            />
          </div>
          <div>
            <label htmlFor="p-role" className="label">
              Peran (tampil di bawah handle, contoh: Front-end developer)
            </label>
            <input
              id="p-role"
              className="input"
              value={form.roles[0] ?? ""}
              onChange={(e) => set("roles", [e.target.value])}
              placeholder="Peranmu"
            />
          </div>
          <div>
            <label htmlFor="p-bio" className="label">
              About me: dua kalimat tentang cara kerja dan apa yang kamu suka bangun
            </label>
            <textarea
              id="p-bio"
              rows={2}
              maxLength={320}
              className="input resize-y"
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Dua kalimat saja"
            />
            <p className="mt-1 text-xs text-muted">{form.bio.length} / 320 karakter</p>
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-bold">Kontak</h2>
        <p className="mt-1 text-xs text-muted">Kosongkan yang tidak dipakai. Hanya yang terisi yang tampil.</p>
        <div className="mt-5">
          <label htmlFor="p-invite" className="label">
            Kalimat ajakan di bagian &quot;Let&apos;s talk.&quot; (contoh: jenis pekerjaan yang kamu terima)
          </label>
          <input
            id="p-invite"
            className="input"
            value={form.availability_text}
            onChange={(e) => set("availability_text", e.target.value)}
            placeholder="Satu kalimat"
          />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="p-email" className="label">
              Email
            </label>
            <input
              id="p-email"
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label htmlFor="p-wa" className="label">
              WhatsApp (nomor)
            </label>
            <input
              id="p-wa"
              inputMode="tel"
              className="input"
              value={form.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              placeholder="08xxxxxxxxxx"
            />
          </div>
          {SOCIALS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label htmlFor={`s-${key}`} className="label">
                {label}
              </label>
              <input
                id={`s-${key}`}
                className="input"
                value={form.socials[key] ?? ""}
                onChange={(e) => setSocial(key, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan profil
        </button>
      </div>
    </form>
  );
}

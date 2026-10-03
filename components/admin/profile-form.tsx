"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { saveProfile } from "@/app/admin/actions";
import { EmailIcon, SOCIALS, WhatsAppIcon } from "@/lib/socials";
import type { Profile, SocialKey } from "@/lib/types";
import { ImageField, type Notify } from "./ui";

export function ProfileForm({ profile, notify }: { profile: Profile; notify: Notify }) {
  const router = useRouter();
  const [form, setForm] = useState<Profile>(profile);
  const [rolesText, setRolesText] = useState(profile.roles.join(", "));
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
      const roles = rolesText
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);
      const res = await saveProfile({ ...form, roles });
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
        <h2 className="font-display text-lg font-semibold">Data diri</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="p-name" className="label">
              Nama
            </label>
            <input
              id="p-name"
              className="input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Nama lengkap"
            />
          </div>
          <div>
            <label htmlFor="p-loc" className="label">
              Lokasi
            </label>
            <input
              id="p-loc"
              className="input"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Surabaya, Indonesia"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="p-roles" className="label">
              Peran (pisahkan dengan koma — ditampilkan bergantian di hero)
            </label>
            <input
              id="p-roles"
              className="input"
              value={rolesText}
              onChange={(e) => setRolesText(e.target.value)}
              placeholder="System Analyst, Web Developer, UI/UX Designer"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="p-bio" className="label">
              Bio
            </label>
            <textarea
              id="p-bio"
              rows={4}
              className="input resize-y"
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Ceritakan singkat siapa kamu dan apa yang kamu kerjakan."
            />
          </div>
          <div className="sm:col-span-2">
            <ImageField
              id="p-avatar"
              label="Foto profil"
              value={form.avatar_url}
              onChange={(url) => set("avatar_url", url)}
              folder="avatar"
              shape="square"
              notify={notify}
            />
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-display text-lg font-semibold">Status ketersediaan</h2>
        <div className="mt-5 grid items-end gap-5 sm:grid-cols-[auto_1fr]">
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={form.available}
              onChange={(e) => set("available", e.target.checked)}
            />
            <span className="relative h-6 w-11 rounded-full bg-line transition peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-accent after:absolute after:left-0.5 after:content-[''] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
            {form.available ? "Tersedia" : "Tidak tersedia"}
          </label>
          <div>
            <label htmlFor="p-avail" className="label">
              Teks status
            </label>
            <input
              id="p-avail"
              className="input"
              value={form.availability_text}
              onChange={(e) => set("availability_text", e.target.value)}
              placeholder="Open for work"
            />
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-display text-lg font-semibold">Kontak & sosial media</h2>
        <p className="mt-1 text-xs text-muted">
          Kosongkan yang tidak dipakai — ikon hanya muncul untuk link yang terisi.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="p-wa" className="label flex items-center gap-1.5">
              <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp (nomor)
            </label>
            <input
              id="p-wa"
              inputMode="tel"
              className="input"
              value={form.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              placeholder="0812xxxxxxxx atau 62812xxxxxxxx"
            />
          </div>
          <div>
            <label htmlFor="p-email" className="label flex items-center gap-1.5">
              <EmailIcon className="h-3.5 w-3.5" /> Email
            </label>
            <input
              id="p-email"
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="nama@email.com"
            />
          </div>
          {SOCIALS.map(({ key, label, Icon, placeholder }) => (
            <div key={key}>
              <label htmlFor={`s-${key}`} className="label flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" /> {label}
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
        <button type="submit" disabled={pending} className="btn-primary shadow-soft">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan profil
        </button>
      </div>
    </form>
  );
}

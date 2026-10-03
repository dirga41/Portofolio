"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ExternalLink, FolderKanban, Hash, LogOut, UserRound, XCircle } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Portfolio } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ProfileForm } from "./profile-form";
import { ProjectsManager } from "./projects-manager";
import { SkillsManager } from "./skills-manager";
import type { Notify } from "./ui";

type Tab = "profile" | "projects" | "skills";

export function Dashboard({ configured, error, profile, projects, skills }: Portfolio) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profile");
  const [toast, setToast] = useState<{ kind: "ok" | "error"; message: string; id: number } | null>(null);
  const [pending, start] = useTransition();

  const notify = useCallback<Notify>((kind, message) => {
    setToast({ kind, message, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const tabs: Array<{ key: Tab; label: string; Icon: typeof UserRound; count?: number }> = [
    { key: "profile", label: "Data diri", Icon: UserRound },
    { key: "projects", label: "Projek", Icon: FolderKanban, count: projects.length },
    { key: "skills", label: "Skill", Icon: Hash, count: skills.length },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <p className="font-display text-base font-semibold">
            Admin <span className="font-mono text-xs font-normal text-muted">/ portfolio</span>
          </p>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="btn-ghost px-3 py-2 text-xs">
              <ExternalLink className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Lihat situs</span>
            </a>
            <ThemeToggle />
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  await logout();
                  router.refresh();
                })
              }
              className="btn-ghost px-3 py-2 text-xs"
            >
              <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        {(!configured || error) && (
          <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            {!configured ? (
              <>
                Supabase belum terhubung. Isi <code className="font-mono">SUPABASE_URL</code> dan{" "}
                <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code>, lalu jalankan{" "}
                <code className="font-mono">supabase/schema.sql</code>. Perubahan belum bisa disimpan.
              </>
            ) : (
              <>
                Gagal membaca database: {error}. Pastikan{" "}
                <code className="font-mono">supabase/schema.sql</code> sudah dijalankan.
              </>
            )}
          </div>
        )}

        <div role="tablist" className="mb-6 inline-flex rounded-2xl border border-line bg-card p-1">
          {tabs.map(({ key, label, Icon, count }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
                tab === key ? "text-onaccent" : "text-muted hover:text-fg",
              )}
            >
              {tab === key && (
                <motion.span
                  layoutId="admin-tab"
                  className="absolute inset-0 rounded-xl bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="relative h-4 w-4" />
              <span className="relative">{label}</span>
              {count !== undefined && (
                <span className="relative font-mono text-xs opacity-70">{count}</span>
              )}
            </button>
          ))}
        </div>

        {tab === "profile" && <ProfileForm profile={profile} notify={notify} />}
        {tab === "projects" && <ProjectsManager projects={projects} notify={notify} />}
        {tab === "skills" && <SkillsManager skills={skills} notify={notify} />}
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-line bg-card px-4 py-3 text-sm shadow-soft"
          >
            {toast.kind === "ok" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

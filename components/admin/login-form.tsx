"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { login } from "@/app/admin/actions";
import { ThemeToggle } from "@/components/theme-toggle";

export function LoginForm({ passwordConfigured }: { passwordConfigured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await login(password);
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  }

  return (
    <main className="dots relative grid min-h-screen place-items-center px-5">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>
      <form onSubmit={submit} className="card w-full max-w-sm p-7 shadow-soft">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-muted">Masukkan password untuk mengelola portofolio.</p>

        {!passwordConfigured && (
          <p className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
            <code className="font-mono">ADMIN_PASSWORD</code> belum diisi di environment variable.
          </p>
        )}

        <label htmlFor="pw" className="label mt-6">
          Password
        </label>
        <input
          id="pw"
          type="password"
          autoFocus
          autoComplete="current-password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p role="alert" className="mt-2 text-xs text-red-500">
            {error}
          </p>
        )}

        <button type="submit" disabled={pending || !password} className="btn-primary mt-5 w-full">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />} Masuk
        </button>
        <a
          href="/"
          className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted transition hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke situs
        </a>
      </form>
    </main>
  );
}

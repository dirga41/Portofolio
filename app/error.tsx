"use client";

import { useEffect } from "react";

/** Tampil kalau halaman gagal dirender. Detailnya hanya di console, bukan untuk pengunjung. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container-page grid min-h-[70vh] place-items-center">
      <div className="max-w-md text-center">
        <p className="font-wide text-2xl font-extrabold">This page could not load.</p>
        <p className="mt-2 text-muted">Something went wrong on our side. Try again in a moment.</p>
        <button type="button" onClick={reset} className="btn-primary mt-6">
          Try again
        </button>
      </div>
    </main>
  );
}

/** Tampil sementara data dari Supabase dimuat. */
export default function Loading() {
  return (
    <main className="container-page grid min-h-[70vh] place-items-center">
      <p role="status" className="text-muted">
        Loading projects
      </p>
    </main>
  );
}

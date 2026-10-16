/** Pembuka: handle besar (tiap huruf bisa "dimainkan"), peran, dua tombol. */
export function Hero({ handle, role }: { handle: string; role: string }) {
  const letters = Array.from(handle);

  return (
    <section id="top" className="container-page flex min-h-[calc(100svh-72px)] flex-col py-16 sm:py-24">
      <h1
        aria-label={handle}
        className="text-[clamp(3.25rem,12vw,7rem)] font-extrabold leading-none tracking-[-0.04em] [overflow-wrap:anywhere]"
      >
        {letters.map((ch, i) => (
          <span key={i} aria-hidden="true" className="jump-letter">
            {ch === " " ? " " : ch}
          </span>
        ))}
      </h1>
      {role && <p className="mt-4 text-[clamp(1.15rem,2.4vw,1.6rem)] font-medium text-muted">{role}</p>}

      <div className="mt-9 flex flex-wrap gap-3">
        <a href="#contact" className="btn-primary">
          Let&apos;s talk
        </a>
        <a href="#about" className="btn-ghost">
          About me
        </a>
      </div>

      <p className="mt-auto pt-16 text-sm text-muted">
        <span className="hidden md:inline">Hover the letters above. </span>Scroll for the work.
      </p>
    </section>
  );
}

import type { Skill } from "@/lib/types";

/** Kolom pembuka: handle, satu kalimat, dan daftar alat. Sengaja pendek. */
export function Intro({
  handle,
  sentence,
  skills,
}: {
  handle: string;
  sentence: string;
  skills: Skill[];
}) {
  return (
    <section className="area-intro" aria-labelledby="intro-title">
      <h1
        id="intro-title"
        className="font-wide text-[clamp(2.5rem,6vw,3.5rem)] font-extrabold leading-[0.98] tracking-[-0.02em] [overflow-wrap:anywhere]"
      >
        {handle}
      </h1>
      {sentence && <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{sentence}</p>}

      {skills.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold">Tools</h2>
          <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[15px] text-muted">
            {skills.map((s) => (
              <li key={s.id}>{s.name}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

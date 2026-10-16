import type { Skill } from "@/lib/types";

/** "About me." Peran, dua kalimat, dan daftar skill dari admin. */
export function About({ role, bio, skills }: { role: string; bio: string; skills: Skill[] }) {
  if (!role && !bio && skills.length === 0) return null;

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container-page grid gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 id="about-title" className="heading">
            About me.
          </h2>
          {role && <p className="mt-4 text-xl font-semibold text-accent">{role}</p>}
        </div>
        <div>
          {bio && <p className="text-lg leading-relaxed text-fg/85">{bio}</p>}
          {skills.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Skills">
              {skills.map((s) => (
                <li key={s.id} className="rounded border border-edge px-3.5 py-2 text-[15px] font-semibold">
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

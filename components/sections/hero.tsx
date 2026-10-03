"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Magnetic } from "@/components/magnetic";
import { TiltCard } from "@/components/tilt-card";
import { buildSocialLinks } from "@/lib/socials";
import type { Profile } from "@/lib/types";
import { initials, mailLink, waLink } from "@/lib/utils";

function RotatingRoles({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (roles.length < 2 || reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [roles.length, reduce]);

  if (roles.length === 0) return null;
  const role = roles[i % roles.length];

  return (
    <p className="mt-3 flex h-10 items-center overflow-hidden font-display text-xl italic text-muted sm:text-2xl">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={role}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          className="inline-block"
        >
          {role}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}

/** Tiap kata menyala saat disapu kursor, lalu meredup perlahan. */
function InteractiveBio({ text }: { text: string }) {
  return (
    <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg/80">
      {text.split(/(\s+)/).map((chunk, idx) =>
        chunk.trim() === "" ? (
          chunk
        ) : (
          <span
            key={idx}
            className="transition-colors duration-700 hover:text-accent hover:duration-0"
          >
            {chunk}
          </span>
        ),
      )}
    </p>
  );
}

export function Hero({ profile }: { profile: Profile }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const links = buildSocialLinks(profile);

  // Parallax kecil pada foto: bergerak berlawanan arah kursor.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const photoX = useSpring(px, { stiffness: 90, damping: 18 });
  const photoY = useSpring(py, { stiffness: 90, damping: 18 });

  const words = profile.name.trim().split(/\s+/).filter(Boolean);
  const first = words[0] ?? "Your name";
  const rest = words.slice(1).join(" ");

  const primaryHref =
    waLink(profile.whatsapp, `Hi ${profile.name}, I just saw your portfolio.`) ||
    mailLink(profile.email) ||
    "#contact";

  function onMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    if (reduce) return;
    px.set(((e.clientX - r.left) / r.width - 0.5) * -14);
    py.set(((e.clientY - r.top) / r.height - 0.5) * -10);
  }

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative overflow-hidden border-b border-line pt-16"
    >
      <div className="hero-wash pointer-events-none absolute inset-0" />

      <div className="container-page relative grid items-center gap-12 py-16 sm:py-24 md:grid-cols-12 md:gap-10">
        {/* Teks */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          className="md:col-span-7"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-medium text-fg">
            <span className="relative flex h-2 w-2">
              {profile.available && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-70" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  profile.available ? "bg-accent" : "bg-muted"
                }`}
              />
            </span>
            {profile.availability_text || (profile.available ? "Open for work" : "Not available")}
          </span>

          <h1 className="mt-6 font-display text-[clamp(2.75rem,7vw,5.25rem)] leading-[1] tracking-[-0.03em]">
            {first}
            {rest ? <span className="italic text-accent"> {rest}</span> : <span className="text-accent">.</span>}
          </h1>

          <RotatingRoles roles={profile.roles} />
          {profile.bio && <InteractiveBio text={profile.bio} />}

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Magnetic>
              <a
                href={primaryHref}
                target={primaryHref.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="btn-primary px-6 py-3 text-base"
              >
                Let&apos;s talk
              </a>
            </Magnetic>
            <a href="#projects" className="link inline-flex items-center gap-2 text-base font-medium">
              See selected work <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          {/* Sosial media: deretan link teks kecil berikon */}
          {links.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6">
              {links.map(({ key, label, href, Icon }) => (
                <li key={key}>
                  <Magnetic strength={0.3} className="-m-2 p-2">
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="marker inline-flex items-center gap-2 text-[15px]"
                    >
                      <Icon className="h-4 w-4 text-accent" />
                      {label}
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Foto — cetakan foto kecil yang diletakkan sedikit miring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="md:col-span-5"
        >
          <motion.div
            style={{ x: photoX, y: photoY }}
            className="mx-auto w-full max-w-[18rem] rotate-[-2deg] md:ml-auto md:mr-0"
          >
            <TiltCard max={7} className="rounded-sm bg-card p-2.5 pb-3 shadow-soft">
              <div className="relative aspect-[4/5] overflow-hidden bg-line">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt={`Photo of ${profile.name}`}
                    className="h-full w-full object-cover saturate-[0.95]"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-mint/20">
                    <span className="font-display text-7xl italic text-accent">
                      {initials(profile.name)}
                    </span>
                  </div>
                )}
              </div>
              {profile.location && (
                <p className="mt-2.5 text-center text-sm text-muted">{profile.location}</p>
              )}
            </TiltCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

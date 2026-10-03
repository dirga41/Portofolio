"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
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
    <p className="flex h-10 items-center overflow-hidden font-display text-2xl italic text-muted sm:text-3xl">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={role}
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -22, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
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
    <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg/80 sm:text-xl sm:leading-relaxed">
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
    px.set(((e.clientX - r.left) / r.width - 0.5) * -22);
    py.set(((e.clientY - r.top) / r.height - 0.5) * -16);
  }

  return (
    <section id="top" ref={ref} onMouseMove={onMove} className="relative overflow-hidden pt-16">
      <div className="hero-wash pointer-events-none absolute inset-0" />

      <div className="container-page relative pb-20 pt-8 sm:pb-28">
        {/* Baris "masthead": info kecil seperti kepala halaman majalah */}
        <div className="eyebrow flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-b border-line pb-4">
          <span>Portfolio — {new Date().getFullYear()}</span>
          {profile.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {profile.location}
            </span>
          )}
          <span className="flex items-center gap-2 text-fg">
            <span className="relative flex h-2 w-2">
              {profile.available && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-60" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  profile.available ? "bg-emerald-600" : "bg-muted"
                }`}
              />
            </span>
            {profile.availability_text || (profile.available ? "Open for work" : "Not available")}
          </span>
        </div>

        <div className="mt-10 grid gap-12 sm:mt-14 lg:grid-cols-12 lg:gap-6">
          {/* Kolom teks — sengaja lebih lebar dan tidak simetris dengan foto */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
            className="lg:col-span-8"
          >
            <h1 className="font-display text-[clamp(3.25rem,11vw,8.75rem)] leading-[0.9] tracking-[-0.04em]">
              <span className="block">
                {first}
                {!rest && <span className="text-accent">.</span>}
              </span>
              {rest && <span className="block pl-[0.55em] italic text-accent">{rest}</span>}
            </h1>

            <div className="mt-10 border-l border-line pl-5 sm:ml-[8%] sm:pl-7">
              <RotatingRoles roles={profile.roles} />
              {profile.bio && <InteractiveBio text={profile.bio} />}

              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Magnetic>
                  <a
                    href={primaryHref}
                    target={primaryHref.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="btn-primary px-7 py-3.5 text-base"
                  >
                    Let&apos;s talk
                  </a>
                </Magnetic>
                <a href="#projects" className="link inline-flex items-center gap-2 text-sm font-medium">
                  See selected work <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Foto — seperti cetakan foto yang diletakkan agak miring */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.2, 0.7, 0.2, 1] }}
            className="lg:col-span-4 lg:pt-20"
          >
            <motion.div
              style={{ x: photoX, y: photoY }}
              className="mx-auto w-full max-w-[19rem] rotate-[-2.5deg] lg:ml-auto lg:mr-0"
            >
              <TiltCard max={8} className="bg-card p-3 pb-4 shadow-soft">
                <div className="relative aspect-[4/5] overflow-hidden bg-line">
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt={`Photo of ${profile.name}`}
                      className="h-full w-full object-cover contrast-[1.04] saturate-[0.92] sepia-[0.08]"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-accent/10">
                      <span className="font-display text-8xl italic text-accent">
                        {initials(profile.name)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-center font-display text-sm italic text-muted">
                  {[profile.location, new Date().getFullYear()].filter(Boolean).join(", ")}
                </p>
              </TiltCard>
            </motion.div>
          </motion.div>
        </div>

        {/* Sosial media sebagai deretan link teks, bukan lingkaran ikon */}
        {links.length > 0 && (
          <div className="mt-16 grid gap-4 border-t border-line pt-6 sm:grid-cols-12">
            <p className="eyebrow sm:col-span-2 sm:pt-1">Elsewhere</p>
            <ul className="flex flex-wrap gap-x-7 gap-y-3 sm:col-span-10">
              {links.map(({ key, label, href, Icon }) => (
                <li key={key}>
                  <Magnetic strength={0.3} className="-m-2 p-2">
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="marker inline-flex items-center gap-2 text-sm font-medium"
                    >
                      <Icon className="h-4 w-4 text-muted" />
                      {label}
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

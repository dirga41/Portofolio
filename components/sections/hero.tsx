"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, MapPin } from "lucide-react";
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
    const id = setInterval(() => setI((v) => (v + 1) % roles.length), 2400);
    return () => clearInterval(id);
  }, [roles.length, reduce]);

  if (roles.length === 0) return null;
  const role = roles[i % roles.length];

  return (
    <p className="mt-5 flex h-8 items-center gap-3 font-mono text-sm text-muted sm:text-base">
      <span className="h-px w-8 bg-accent" />
      <span className="relative inline-block overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={role}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="inline-block text-fg"
          >
            {role}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}

/** Tiap kata menyala saat disapu kursor, lalu meredup perlahan. */
function InteractiveBio({ text }: { text: string }) {
  return (
    <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
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
  const links = buildSocialLinks(profile);
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
  }

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative overflow-hidden border-b border-line pt-16"
    >
      <div className="dots pointer-events-none absolute inset-0" />
      <div className="dots-lit pointer-events-none absolute inset-0" />
      <div className="spotlight-lg pointer-events-none absolute inset-0" />

      <div className="container-page relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-3.5 py-1.5 font-mono text-xs text-fg">
            <span className="relative flex h-2 w-2">
              {profile.available && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  profile.available ? "bg-emerald-500" : "bg-muted"
                }`}
              />
            </span>
            {profile.availability_text || (profile.available ? "Open for work" : "Not available")}
          </span>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">
            {profile.name || "Your name"}
            <span className="text-accent">.</span>
          </h1>

          <RotatingRoles roles={profile.roles} />
          {profile.bio && <InteractiveBio text={profile.bio} />}

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href={primaryHref}
                target={primaryHref.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="btn-primary rounded-full px-6 py-3"
              >
                Let&apos;s talk
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#projects" className="btn-ghost rounded-full px-6 py-3">
                See projects <ArrowDownRight className="h-4 w-4" />
              </a>
            </Magnetic>
          </div>

          {links.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2.5">
              {links.map(({ key, label, href, Icon }) => (
                <li key={key}>
                  <Magnetic strength={0.45} className="-m-2 p-2">
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      aria-label={label}
                      title={label}
                      className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-muted transition hover:border-accent hover:text-accent hover:shadow-glow"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mx-auto w-full max-w-xs lg:max-w-none"
        >
          <TiltCard max={9} className="p-2.5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-bg">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={`Photo of ${profile.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="dots grid h-full w-full place-items-center">
                  <span className="font-display text-7xl font-semibold text-accent">
                    {initials(profile.name)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-2 pb-1.5 pt-3 font-mono text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location || "Earth"}
              </span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}

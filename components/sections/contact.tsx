"use client";

import { useState } from "react";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { Magnetic } from "@/components/magnetic";
import { SectionHeading } from "./section-heading";
import type { Profile } from "@/lib/types";
import { mailLink, waLink, waNumber } from "@/lib/utils";

export function Contact({ profile }: { profile: Profile }) {
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");

  const hasWa = Boolean(waNumber(profile.whatsapp));
  const hasMail = Boolean(profile.email.trim());
  const text = `Hi ${profile.name}${sender ? `, this is ${sender}` : ""}.\n\n${message}`.trim();
  const ready = message.trim().length > 0;

  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading index="03" kicker="contact" title="Let's build something" />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4">
            {hasWa && (
              <a
                href={waLink(profile.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="card group flex items-center justify-between p-6 transition hover:border-accent hover:shadow-glow"
              >
                <span className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-mono text-xs text-muted">WhatsApp</span>
                    <span className="block font-display text-lg font-semibold">
                      +{waNumber(profile.whatsapp)}
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </a>
            )}
            {hasMail && (
              <a
                href={mailLink(profile.email)}
                className="card group flex items-center justify-between p-6 transition hover:border-accent hover:shadow-glow"
              >
                <span className="flex min-w-0 items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-xs text-muted">Email</span>
                    <span className="block truncate font-display text-lg font-semibold">
                      {profile.email}
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </a>
            )}
            {!hasWa && !hasMail && (
              <p className="text-sm text-muted">
                Add a WhatsApp number and email from the admin page to enable this section.
              </p>
            )}
          </div>

          {(hasWa || hasMail) && (
            <div className="card p-6">
              <p className="mb-5 text-sm text-muted">
                Write your message here — it opens straight in WhatsApp or your email app.
              </p>
              <label className="label" htmlFor="c-name">
                Name
              </label>
              <input
                id="c-name"
                className="input mb-4"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Your name"
              />
              <label className="label" htmlFor="c-msg">
                Message
              </label>
              <textarea
                id="c-msg"
                rows={5}
                className="input resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me briefly about the role or project…"
              />
              <div className="mt-5 flex flex-wrap gap-4">
                {hasWa && (
                  <Magnetic>
                    <a
                      href={ready ? waLink(profile.whatsapp, text) : undefined}
                      target="_blank"
                      rel="noreferrer"
                      aria-disabled={!ready}
                      className={`btn-primary ${ready ? "" : "pointer-events-none opacity-50"}`}
                    >
                      <MessageCircle className="h-4 w-4" /> Send via WhatsApp
                    </a>
                  </Magnetic>
                )}
                {hasMail && (
                  <Magnetic>
                    <a
                      href={
                        ready
                          ? mailLink(profile.email, `Hello from ${sender || "a portfolio visitor"}`, text)
                          : undefined
                      }
                      aria-disabled={!ready}
                      className={`btn-ghost ${ready ? "" : "pointer-events-none opacity-50"}`}
                    >
                      <Mail className="h-4 w-4" /> Send via Email
                    </a>
                  </Magnetic>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

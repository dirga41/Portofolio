"use client";

import { useState } from "react";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { Magnetic } from "@/components/magnetic";
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
    <section id="contact" className="py-20 sm:py-28">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Kiri: pernyataan besar + kontak langsung */}
        <div className="lg:col-span-7">
          <p className="font-display text-base italic text-accent">(03)</p>
          <h2 className="mt-3 font-display text-5xl leading-[0.98] tracking-[-0.03em] sm:text-7xl">
            Have a role or a project in mind? <em className="text-accent">Let&apos;s talk.</em>
          </h2>

          <div className="mt-12 grid gap-7">
            {hasMail && (
              <div>
                <p className="eyebrow mb-2">Email</p>
                <a
                  href={mailLink(profile.email)}
                  className="link group inline-flex max-w-full items-baseline gap-2 font-display text-2xl sm:text-4xl"
                >
                  <span className="truncate">{profile.email}</span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:h-6 sm:w-6" />
                </a>
              </div>
            )}
            {hasWa && (
              <div>
                <p className="eyebrow mb-2">WhatsApp</p>
                <a
                  href={waLink(profile.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="link group inline-flex items-baseline gap-2 font-display text-2xl sm:text-4xl"
                >
                  +{waNumber(profile.whatsapp)}
                  <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:h-6 sm:w-6" />
                </a>
              </div>
            )}
            {!hasWa && !hasMail && (
              <p className="text-sm text-muted">
                Add a WhatsApp number and email from the admin page to enable this section.
              </p>
            )}
          </div>
        </div>

        {/* Kanan: penyusun pesan bergaris bawah, tanpa kotak-kotak */}
        {(hasWa || hasMail) && (
          <div className="lg:col-span-5 lg:pt-16">
            <p className="mb-6 text-sm leading-relaxed text-muted">
              Or write it here — it opens straight in WhatsApp or your email app, nothing is stored.
            </p>
            <label className="eyebrow" htmlFor="c-name">
              Your name
            </label>
            <input
              id="c-name"
              className="field mb-7"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="Jane from Acme"
            />
            <label className="eyebrow" htmlFor="c-msg">
              Message
            </label>
            <textarea
              id="c-msg"
              rows={4}
              className="field resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me briefly about the role or project…"
            />
            <div className="mt-8 flex flex-wrap gap-4">
              {hasWa && (
                <Magnetic>
                  <a
                    href={ready ? waLink(profile.whatsapp, text) : undefined}
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={!ready}
                    className={`btn-primary ${ready ? "" : "pointer-events-none opacity-40"}`}
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
                    className={`btn-ghost ${ready ? "" : "pointer-events-none opacity-40"}`}
                  >
                    <Mail className="h-4 w-4" /> Send via Email
                  </a>
                </Magnetic>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

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
    <section id="contact" className="py-20 sm:py-24">
      <div className="container-page grid gap-12 md:grid-cols-12 md:gap-12">
        {/* Kiri: ajakan singkat + kontak langsung */}
        <div className="md:col-span-6">
          <h2 className="font-display text-3xl leading-[1.1] tracking-[-0.02em] sm:text-[2.75rem]">
            Have a role or a project in mind? <em className="text-accent">Let&apos;s talk.</em>
          </h2>

          <dl className="mt-9 grid gap-6">
            {hasMail && (
              <div>
                <dt className="eyebrow">Email</dt>
                <dd className="mt-0.5">
                  <a
                    href={mailLink(profile.email)}
                    className="link group inline-flex max-w-full items-center gap-2 font-display text-2xl"
                  >
                    <span className="truncate">{profile.email}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </dd>
              </div>
            )}
            {hasWa && (
              <div>
                <dt className="eyebrow">WhatsApp</dt>
                <dd className="mt-0.5">
                  <a
                    href={waLink(profile.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="link group inline-flex items-center gap-2 font-display text-2xl"
                  >
                    +{waNumber(profile.whatsapp)}
                    <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
          {!hasWa && !hasMail && (
            <p className="mt-6 text-sm text-muted">
              Add a WhatsApp number and email from the admin page to enable this section.
            </p>
          )}
        </div>

        {/* Kanan: penyusun pesan bergaris bawah */}
        {(hasWa || hasMail) && (
          <div className="md:col-span-6">
            <p className="mb-6 text-base text-muted">
              Or write it here — it opens in WhatsApp or your email app. Nothing is stored.
            </p>
            <label className="eyebrow" htmlFor="c-name">
              Your name
            </label>
            <input
              id="c-name"
              className="field mb-6"
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
            <div className="mt-7 flex flex-wrap gap-4">
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

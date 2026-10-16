"use client";

import { useState } from "react";
import type { SocialLink } from "@/lib/socials";
import { mailLink, waLink, waNumber } from "@/lib/utils";

/** Kontak: email (bisa disalin), WhatsApp, lalu link lain sebagai teks biasa. */
export function Contact({
  email,
  whatsapp,
  links,
}: {
  email: string;
  whatsapp: string;
  links: SocialLink[];
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const hasMail = Boolean(email.trim());
  const hasWa = Boolean(waNumber(whatsapp));

  if (!hasMail && !hasWa && links.length === 0) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(email.trim());
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <section className="area-contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="text-sm font-semibold">
        Contact
      </h2>

      {hasMail && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
          <a href={mailLink(email)} className="link break-all text-lg font-medium">
            {email.trim()}
          </a>
          <button type="button" onClick={copy} className="btn-ghost px-3 text-xs">
            {status === "copied" ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <p role="status" className="mt-1 min-h-[1.25rem] text-sm text-muted">
        {status === "failed" ? "Copy did not work here. Select the address instead." : ""}
      </p>

      {(hasWa || links.length > 0) && (
        <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
          {hasWa && (
            <li>
              <a
                href={waLink(whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="link inline-flex min-h-[44px] items-center"
              >
                WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          )}
          {links.map((l) => (
            <li key={l.key}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="link inline-flex min-h-[44px] items-center"
              >
                {l.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

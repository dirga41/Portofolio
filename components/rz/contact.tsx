"use client";

import { useState } from "react";
import { mailLink, waLink, waNumber } from "@/lib/utils";

type Errors = { name?: boolean; email?: boolean; message?: boolean };

/**
 * "Let's talk." Form tanpa server: setelah lolos validasi, pesan dibuka di
 * aplikasi email pengunjung (atau WhatsApp bila email tidak diisi di admin).
 */
export function Contact({
  handle,
  invite,
  email,
  whatsapp,
}: {
  handle: string;
  invite: string;
  email: string;
  whatsapp: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const hasMail = Boolean(email.trim());
  const hasWa = Boolean(waNumber(whatsapp));
  const canSend = hasMail || hasWa;

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSent(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {
      name: !form.name.trim(),
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
      message: form.message.trim().length < 5,
    };
    setErrors(next);
    if (next.name || next.email || next.message) return;

    const body = `${form.message.trim()}\n\n${form.name.trim()} (${form.email.trim()})`;
    const href = hasMail
      ? mailLink(email, `Hello from ${form.name.trim()}`, body)
      : waLink(whatsapp, `Hi ${handle}, ${body}`);
    if (hasMail) window.location.href = href;
    else window.open(href, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  const err = "mt-1.5 text-sm text-accent";

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 id="contact-title" className="heading">
            Let&apos;s talk.
          </h2>
          {invite && <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{invite}</p>}
          {hasMail && (
            <a href={mailLink(email)} className="link mt-6 inline-block break-all text-lg font-semibold">
              {email.trim()}
            </a>
          )}
        </div>

        {canSend ? (
          <form onSubmit={submit} noValidate className="flex flex-col gap-5">
            <div>
              <label htmlFor="c-name" className="text-sm font-semibold text-muted">
                Name
              </label>
              <input
                id="c-name"
                className="field"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                aria-invalid={errors.name || undefined}
                aria-describedby={errors.name ? "c-name-err" : undefined}
                placeholder="Your name"
                autoComplete="name"
              />
              {errors.name && <p id="c-name-err" className={err}>Please add your name.</p>}
            </div>
            <div>
              <label htmlFor="c-email" className="text-sm font-semibold text-muted">
                E-mail
              </label>
              <input
                id="c-email"
                type="email"
                className="field"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={errors.email || undefined}
                aria-describedby={errors.email ? "c-email-err" : undefined}
                placeholder="email@example.com"
                autoComplete="email"
              />
              {errors.email && <p id="c-email-err" className={err}>Please add a valid e-mail.</p>}
            </div>
            <div>
              <label htmlFor="c-msg" className="text-sm font-semibold text-muted">
                Message
              </label>
              <textarea
                id="c-msg"
                rows={4}
                className="field resize-none"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                aria-invalid={errors.message || undefined}
                aria-describedby={errors.message ? "c-msg-err" : undefined}
                placeholder="Drop your message here"
              />
              {errors.message && <p id="c-msg-err" className={err}>Please write a short message.</p>}
            </div>
            <button type="submit" className="btn-primary self-start">
              Send message
            </button>
            <p role="status" className="min-h-[1.5rem] text-[15px] font-semibold">
              {sent ? (hasMail ? "Your e-mail app should open now." : "WhatsApp should open in a new tab.") : ""}
            </p>
          </form>
        ) : (
          <p className="text-lg text-muted">Contact details will appear here soon.</p>
        )}
      </div>
    </section>
  );
}

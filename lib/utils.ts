export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** "#Next JS" → "next-js" */
export function normalizeTag(raw: string): string {
  return raw
    .trim()
    .replace(/^#+/, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9+.\-_]/g, "");
}

/** "#react, nextjs  tailwind" → ["react","nextjs","tailwind"] */
export function parseTags(raw: string): string[] {
  const seen = new Set<string>();
  for (const part of raw.split(/[,\s]+/)) {
    const tag = normalizeTag(part);
    if (tag) seen.add(tag);
  }
  return Array.from(seen);
}

/** Tambahkan https:// bila pengguna lupa menuliskannya. */
export function ensureUrl(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  if (/^(https?:)?\/\//i.test(v) || v.startsWith("/")) return v;
  return `https://${v}`;
}

/** 0812-xxxx / +62 812 xxxx → 62812xxxx (format wa.me) */
export function waNumber(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  return digits;
}

export function waLink(raw: string, text?: string): string {
  const n = waNumber(raw);
  if (!n) return "";
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function mailLink(email: string, subject?: string, body?: string): string {
  if (!email.trim()) return "";
  const q = new URLSearchParams();
  if (subject) q.set("subject", subject);
  if (body) q.set("body", body);
  const qs = q.toString().replace(/\+/g, "%20");
  return `mailto:${email.trim()}${qs ? `?${qs}` : ""}`;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "·";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

import type { Profile, SocialKey } from "./types";
import { ensureUrl } from "./utils";

export interface SocialDef {
  key: SocialKey;
  label: string;
  placeholder: string;
}

// Ditampilkan sebagai link teks, tanpa ikon: lebih jujur daripada ikon pengganti
// yang tidak benar-benar mewakili mereknya.
export const SOCIALS: SocialDef[] = [
  { key: "github", label: "GitHub", placeholder: "https://github.com/username" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
  { key: "x", label: "X", placeholder: "https://x.com/username" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@username" },
  { key: "behance", label: "Behance", placeholder: "https://behance.net/username" },
  { key: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/username" },
];

export interface SocialLink {
  key: string;
  label: string;
  href: string;
}

/** Link sosial media yang sudah diisi (WhatsApp dan email ditangani terpisah). */
export function buildSocialLinks(profile: Profile): SocialLink[] {
  const links: SocialLink[] = [];
  for (const s of SOCIALS) {
    const url = ensureUrl(profile.socials[s.key] ?? "");
    if (url) links.push({ key: s.key, label: s.label, href: url });
  }
  return links;
}

import {
  Dribbble,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Music2,
  PenTool,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import type { Profile, SocialKey } from "./types";
import { ensureUrl, mailLink, waLink } from "./utils";

export interface SocialDef {
  key: SocialKey;
  label: string;
  Icon: LucideIcon;
  placeholder: string;
}

export const SOCIALS: SocialDef[] = [
  { key: "github", label: "GitHub", Icon: Github, placeholder: "https://github.com/username" },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
  { key: "instagram", label: "Instagram", Icon: Instagram, placeholder: "https://instagram.com/username" },
  { key: "x", label: "X / Twitter", Icon: Twitter, placeholder: "https://x.com/username" },
  { key: "youtube", label: "YouTube", Icon: Youtube, placeholder: "https://youtube.com/@channel" },
  { key: "tiktok", label: "TikTok", Icon: Music2, placeholder: "https://tiktok.com/@username" },
  { key: "behance", label: "Behance", Icon: PenTool, placeholder: "https://behance.net/username" },
  { key: "dribbble", label: "Dribbble", Icon: Dribbble, placeholder: "https://dribbble.com/username" },
];

export const WhatsAppIcon = MessageCircle;
export const EmailIcon = Mail;

export interface SocialLink {
  key: string;
  label: string;
  href: string;
  Icon: LucideIcon;
}

/** Semua link yang sudah diisi, urut: WhatsApp, Email, lalu sosial media lain. */
export function buildSocialLinks(profile: Profile): SocialLink[] {
  const links: SocialLink[] = [];
  const wa = waLink(profile.whatsapp);
  if (wa) links.push({ key: "whatsapp", label: "WhatsApp", href: wa, Icon: MessageCircle });
  const mail = mailLink(profile.email);
  if (mail) links.push({ key: "email", label: "Email", href: mail, Icon: Mail });
  for (const s of SOCIALS) {
    const url = ensureUrl(profile.socials[s.key] ?? "");
    if (url) links.push({ key: s.key, label: s.label, href: url, Icon: s.Icon });
  }
  return links;
}

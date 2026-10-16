import type { Metadata } from "next";
import { About } from "@/components/rz/about";
import { Contact } from "@/components/rz/contact";
import { Experiments } from "@/components/rz/experiments";
import { Hero } from "@/components/rz/hero";
import { SiteFooter } from "@/components/rz/site-footer";
import { SiteHeader } from "@/components/rz/site-header";
import { Works } from "@/components/rz/works";
import { getPortfolio } from "@/lib/data";
import { buildSocialLinks } from "@/lib/socials";

// Selalu baca data terbaru dari Supabase (perubahan di /admin langsung tampil).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolio();
  const handle = profile.name.trim();
  return {
    title: handle ? `${handle} · Portfolio` : "Portfolio",
    description: profile.roles[0] || profile.bio.slice(0, 160) || "Programmer portfolio",
  };
}

export default async function HomePage() {
  const { configured, error, profile, projects, skills } = await getPortfolio();

  // Detail teknis hanya ke log server, bukan ke pengunjung.
  if (!configured) console.error("[portfolio] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum diisi.");
  if (error) console.error("[portfolio] Gagal membaca Supabase:", error);

  const handle = profile.name.trim() || "Portfolio";
  const role = (profile.roles[0] ?? "").trim();

  return (
    <>
      <SiteHeader handle={handle} />
      <main>
        <Hero handle={handle} role={role} />
        <Works projects={projects} failed={!configured || Boolean(error)} />
        <Experiments />
        <Contact
          handle={handle}
          invite={profile.availability_text.trim()}
          email={profile.email}
          whatsapp={profile.whatsapp}
        />
        <About role={role} bio={profile.bio.trim()} skills={skills} />
      </main>
      <SiteFooter handle={handle} links={buildSocialLinks(profile)} whatsapp={profile.whatsapp} />
    </>
  );
}

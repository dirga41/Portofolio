import type { Metadata } from "next";
import { Contact } from "@/components/site/contact";
import { SiteHeader } from "@/components/site/header";
import { Intro } from "@/components/site/intro";
import { ProjectSlider } from "@/components/site/project-slider";
import { getPortfolio } from "@/lib/data";
import { buildSocialLinks } from "@/lib/socials";

// Selalu baca data terbaru dari Supabase (perubahan di /admin langsung tampil).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolio();
  const handle = profile.name.trim();
  const title = handle ? `${handle} · Portfolio` : "Portfolio";
  return { title, description: profile.bio.slice(0, 160) || "Programmer portfolio" };
}

export default async function HomePage() {
  const { configured, error, profile, projects, skills } = await getPortfolio();

  // Detail teknis hanya ke log server, bukan ke pengunjung.
  if (!configured) console.error("[portfolio] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum diisi.");
  if (error) console.error("[portfolio] Gagal membaca Supabase:", error);

  const handle = profile.name.trim() || "Portfolio";

  return (
    <>
      <SiteHeader handle={handle} />
      <main id="main" className="container-page page-grid pb-14 pt-6 lg:pt-10">
        <Intro handle={handle} sentence={profile.bio.trim()} skills={skills} />
        <ProjectSlider projects={projects} failed={!configured || Boolean(error)} />
        <Contact email={profile.email} whatsapp={profile.whatsapp} links={buildSocialLinks(profile)} />
      </main>
    </>
  );
}

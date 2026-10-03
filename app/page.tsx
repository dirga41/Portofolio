import type { Metadata } from "next";
import { CursorFollower } from "@/components/cursor-follower";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";
import { Showcase } from "@/components/sections/showcase";
import { getPortfolio } from "@/lib/data";

// Selalu baca data terbaru dari Supabase (perubahan di /admin langsung tampil).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolio();
  const title = profile.name ? `${profile.name} — Portfolio` : "Portfolio";
  const description = profile.bio.slice(0, 160) || "Personal portfolio";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : undefined,
    },
  };
}

export default async function HomePage() {
  const { configured, error, profile, projects, skills } = await getPortfolio();

  return (
    <>
      <CursorFollower />
      <Navbar name={profile.name} />
      <main>
        {(!configured || error) && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-amber-500/40 bg-amber-500/10 px-5 py-3 text-center text-xs text-fg backdrop-blur">
            {!configured
              ? "Supabase belum terhubung. Isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.local, lalu jalankan supabase/schema.sql."
              : `Gagal membaca database: ${error}. Pastikan supabase/schema.sql sudah dijalankan.`}
          </div>
        )}
        <Hero profile={profile} />
        <Showcase skills={skills} projects={projects} />
        <Contact profile={profile} />
      </main>
      <footer className="border-t border-line py-8">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <a href="#top" className="transition hover:text-accent">
            back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}

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
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-accent/40 bg-card px-5 py-3 text-center text-xs text-fg">
            {!configured
              ? "Supabase belum terhubung. Isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.local, lalu jalankan supabase/schema.sql."
              : `Gagal membaca database: ${error}. Pastikan supabase/schema.sql sudah dijalankan.`}
          </div>
        )}
        <Hero profile={profile} />
        <Showcase skills={skills} projects={projects} />
        <Contact profile={profile} />
      </main>
      <footer className="border-t border-line">
        <div className="container-page flex flex-wrap items-baseline justify-between gap-4 py-8">
          <p className="font-display text-2xl italic">{profile.name || "Portfolio"}</p>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} ·{" "}
            <a href="#top" className="link">
              Back to top
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

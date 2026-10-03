import "server-only";
import { getSupabase } from "./supabase";
import type { Profile, Project, Skill } from "./types";

export const EMPTY_PROFILE: Profile = {
  name: "",
  roles: [],
  bio: "",
  avatar_url: "",
  whatsapp: "",
  email: "",
  location: "",
  available: true,
  availability_text: "Open for work",
  socials: {},
};

export interface Portfolio {
  configured: boolean;
  error: string | null;
  profile: Profile;
  projects: Project[];
  skills: Skill[];
}

export async function getPortfolio(): Promise<Portfolio> {
  const db = getSupabase();
  if (!db) {
    return { configured: false, error: null, profile: EMPTY_PROFILE, projects: [], skills: [] };
  }

  const [profileRes, projectsRes, skillsRes] = await Promise.all([
    db.from("profile").select("*").eq("id", 1).maybeSingle(),
    db
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    db
      .from("skills")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  const error =
    profileRes.error?.message ?? projectsRes.error?.message ?? skillsRes.error?.message ?? null;

  const p = profileRes.data as Partial<Profile> | null;
  const profile: Profile = {
    ...EMPTY_PROFILE,
    ...(p ?? {}),
    roles: p?.roles ?? [],
    socials: p?.socials ?? {},
  };

  return {
    configured: true,
    error,
    profile,
    projects: (projectsRes.data ?? []) as Project[],
    skills: (skillsRes.data ?? []) as Skill[],
  };
}

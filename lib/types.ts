export type SocialKey =
  | "github"
  | "linkedin"
  | "instagram"
  | "x"
  | "youtube"
  | "tiktok"
  | "behance"
  | "dribbble";

export interface Profile {
  name: string;
  roles: string[];
  bio: string;
  avatar_url: string;
  whatsapp: string;
  email: string;
  location: string;
  available: boolean;
  availability_text: string;
  socials: Partial<Record<SocialKey, string>>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  live_url: string;
  repo_url: string;
  image_url: string;
  tags: string[];
  sort_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  sort_order: number;
}

export type ProjectInput = Omit<Project, "id"> & { id?: string };
export type SkillInput = Omit<Skill, "id"> & { id?: string };

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

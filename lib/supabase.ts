import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const STORAGE_BUCKET = "portfolio";

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Client server-side (service role). Mengembalikan null bila env belum diisi. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
      // Jangan biarkan fetch-cache Next.js menyimpan hasil query.
      global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
    });
  }
  return client;
}

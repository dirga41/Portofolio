import "server-only";
import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "crypto";

const COOKIE = "pf_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

function secret(): string {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function isPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function verifyPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  return safeEqual(input, pw);
}

export function createSession(): void {
  const exp = String(Date.now() + MAX_AGE * 1000);
  cookies().set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function destroySession(): void {
  cookies().delete(COOKIE);
}

export function isAuthed(): boolean {
  if (!secret()) return false;
  const raw = cookies().get(COOKIE)?.value;
  if (!raw) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig) return false;
  if (!safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now();
}

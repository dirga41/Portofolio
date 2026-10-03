import type { Metadata } from "next";
import { Dashboard } from "@/components/admin/dashboard";
import { LoginForm } from "@/components/admin/login-form";
import { isAuthed, isPasswordConfigured } from "@/lib/auth";
import { getPortfolio } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Portfolio",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!isAuthed()) {
    return <LoginForm passwordConfigured={isPasswordConfigured()} />;
  }
  const data = await getPortfolio();
  return <Dashboard {...data} />;
}

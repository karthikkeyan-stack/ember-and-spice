import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import AdminShell from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return <AdminShell adminName={admin.name}>{children}</AdminShell>;
}

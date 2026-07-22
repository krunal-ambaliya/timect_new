import { redirect } from "next/navigation";
import { getAdminSession } from "@/admin/lib/session";
import ProtectedShell from "./ProtectedShell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <ProtectedShell user={session}>{children}</ProtectedShell>;
}

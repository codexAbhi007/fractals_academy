import { redirect } from "next/navigation";
import { getServerSession, getCurrentUser } from "@/lib/session";
import { DashboardContent } from "./dashboard-content";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const rawUser = await getCurrentUser();

  // Transform user to match expected type (convert null to undefined for role)
  const user = rawUser
    ? {
        ...rawUser,
        role: rawUser.role ?? undefined,
      }
    : null;

  return <DashboardContent user={user} />;
}

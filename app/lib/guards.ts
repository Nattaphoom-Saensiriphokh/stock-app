import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export async function requireRole(roles: string[]) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (!roles.includes(session.user.role)) redirect("/unauthorized");

  return session;
}
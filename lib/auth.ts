import { redirect } from "next/navigation";
import { getSession } from "./session";

export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** hak_akses = 1 */
export async function requireAdmin() {
  const session = await requireUser();
  if (session.role !== "1") redirect("/dashboard");
  return session;
}

/** hak_akses = 2 */
export async function requireCustomer() {
  const session = await requireUser();
  if (session.role !== "2") redirect("/admin");
  return session;
}

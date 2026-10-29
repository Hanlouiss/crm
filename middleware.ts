import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/jwt";
import type { SessionData } from "@/lib/types";

const PUBLIC_PATHS = ["/login", "/register", "/register/profile"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifyToken<SessionData>("session", req.cookies.get(SESSION_COOKIE)?.value);
  const go = (path: string) => NextResponse.redirect(new URL(path, req.url));
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (!session) return isPublic ? NextResponse.next() : go("/login");

  const home = session.role === "1" ? "/admin" : "/dashboard";
  if (isPublic || pathname === "/") return go(home);

  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  if (session.role === "1" && !isAdminArea) return go("/admin");
  if (session.role === "2" && isAdminArea) return go("/dashboard");

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

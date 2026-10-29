import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE, SIGNUP_COOKIE, signToken, verifyToken } from "./jwt";
import type { SessionData } from "./types";

const baseCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function createSession(data: SessionData) {
  const token = await signToken("session", data, SESSION_MAX_AGE);
  cookies().set(SESSION_COOKIE, token, { ...baseCookie, maxAge: SESSION_MAX_AGE });
}

export async function getSession(): Promise<SessionData | null> {
  return verifyToken<SessionData>("session", cookies().get(SESSION_COOKIE)?.value);
}

export function destroySession() {
  cookies().delete(SESSION_COOKIE);
  cookies().delete(SIGNUP_COOKIE);
}

/** Step 1 -> step 2 of registration: remembers which new account is filling in its profile. */
export async function setSignup(uid: number) {
  const token = await signToken("signup", { uid }, 30 * 60);
  cookies().set(SIGNUP_COOKIE, token, { ...baseCookie, maxAge: 30 * 60 });
}

export async function getSignup(): Promise<{ uid: number } | null> {
  return verifyToken<{ uid: number }>("signup", cookies().get(SIGNUP_COOKIE)?.value);
}

export function clearSignup() {
  cookies().delete(SIGNUP_COOKIE);
}

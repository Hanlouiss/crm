// Edge-safe (used by middleware): no next/headers or node:crypto here.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "session";
export const SIGNUP_COOKIE = "signup";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set (see .env.example)");
  return new TextEncoder().encode(secret);
}

/** `typ` keeps a token made for one purpose from being accepted for another. */
export async function signToken(typ: string, data: object, ttlSeconds: number) {
  return new SignJWT({ ...data, typ })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(key());
}

export async function verifyToken<T>(typ: string, token?: string): Promise<T | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    if (payload.typ !== typ) return null;
    return payload as unknown as T;
  } catch {
    return null;
  }
}

import bcrypt from "bcryptjs";

export const MIN_PASSWORD_LENGTH = 8;
export const hashPassword = (plain: string) => bcrypt.hash(plain, 10);
export const isHashed = (stored: string) => stored.startsWith("$2");

/** Supports bcrypt hashes and the plain-text passwords already in the old database. */
export async function verifyPassword(plain: string, stored: string) {
  if (isHashed(stored)) return bcrypt.compare(plain, stored);
  return plain === stored;
}

"use server";

import { redirect } from "next/navigation";
import { execute, query } from "@/lib/db";
import { formField, isEmail } from "@/lib/format";
import { hashPassword, isHashed, MIN_PASSWORD_LENGTH, verifyPassword } from "@/lib/password";
import { clearSignup, createSession, destroySession, getSignup, setSignup } from "@/lib/session";
import type { ActionState, LogRow } from "@/lib/types";

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = formField(formData, "name");
  const password = (formData.get("password") as string | null) ?? "";
  if (!name || !password) return { error: "Nama atau password tidak boleh kosong!" };

  // `name` is not unique in the table, so try every account with that name.
  const candidates = await query<LogRow>("SELECT * FROM log WHERE name = ?", [name]);
  let user: LogRow | null = null;
  for (const c of candidates) {
    if (c.password && (await verifyPassword(password, c.password))) {
      user = c;
      break;
    }
  }
  if (!user || !user.password) return { error: "Nama atau password salah." };

  const role = String(user.hak_akses);
  if (role !== "1" && role !== "2") return { error: "Hak akses akun ini tidak valid." };

  // Old plain-text password -> upgrade to a bcrypt hash.
  if (!isHashed(user.password)) {
    await execute("UPDATE log SET password = ? WHERE id = ?", [await hashPassword(password), user.id]);
  }

  await createSession({ uid: user.id, name: user.name ?? name, role });
  redirect(role === "1" ? "/admin" : "/dashboard");
}

export async function logoutAction() {
  destroySession();
  redirect("/login");
}

/** Registration step 1: create the account. */
export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = formField(formData, "name");
  const email = formField(formData, "email");
  const password = (formData.get("password") as string | null) ?? "";

  if (!name || name.length > 255) return { error: "Nama wajib diisi." };
  if (!isEmail(email)) return { error: "Format email tidak valid." };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password minimal ${MIN_PASSWORD_LENGTH} karakter.` };
  }

  const taken = await query<{ id: number }>("SELECT id FROM log WHERE name = ? LIMIT 1", [name]);
  if (taken.length > 0) return { error: "Nama sudah dipakai, gunakan nama lain." };

  let uid = 0;
  try {
    const result = await execute(
      "INSERT INTO log (name, email, password, hak_akses, membership) VALUES (?, ?, ?, 2, 1)",
      [name, email, await hashPassword(password)]
    );
    uid = result.insertId;
  } catch (e) {
    console.error(e);
    return { error: "Terjadi kesalahan saat membuat akun." };
  }

  await setSignup(uid);
  redirect("/register/profile");
}

/** Registration step 2: personal data for the account created in step 1. */
export async function registerProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const signup = await getSignup();
  if (!signup) redirect("/register");

  const nama = formField(formData, "nama");
  const dob = formField(formData, "dob");
  const address = formField(formData, "address");
  const phone = formField(formData, "phone");

  if (!nama || nama.length > 100) return { error: "Nama wajib diisi (maks. 100 karakter)." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return { error: "Tanggal lahir tidak valid." };
  if (!address || address.length > 255) return { error: "Alamat wajib diisi (maks. 255 karakter)." };
  if (!/^[0-9+\-\s]{6,15}$/.test(phone)) return { error: "Nomor telepon tidak valid (6-15 karakter)." };

  const existing = await query<{ id_pelanggan: number }>(
    "SELECT id_pelanggan FROM data_pelanggan WHERE id = ? LIMIT 1",
    [signup.uid]
  );
  if (existing.length === 0) {
    try {
      await execute(
        "INSERT INTO data_pelanggan (id, nama, tanggal_lahir, tempat_tinggal, no_telp) VALUES (?, ?, ?, ?, ?)",
        [signup.uid, nama, dob, address, phone]
      );
    } catch (e) {
      console.error(e);
      return { error: "Terjadi kesalahan saat menyimpan data pribadi." };
    }
  }

  clearSignup();
  redirect("/login?message=" + encodeURIComponent("Akun berhasil dibuat. Silakan login."));
}

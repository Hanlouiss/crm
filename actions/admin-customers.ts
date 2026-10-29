"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { execute, query } from "@/lib/db";
import { formField, isEmail } from "@/lib/format";
import { hashPassword, MIN_PASSWORD_LENGTH } from "@/lib/password";

const BASE = "/admin/pelanggan";
const withError = (path: string, message: string) => `${path}?error=${encodeURIComponent(message)}`;
const oneOf = (v: string, allowed: string[]) => allowed.includes(v);

export async function createCustomerAction(formData: FormData) {
  await requireAdmin();
  const name = formField(formData, "name");
  const email = formField(formData, "email");
  const password = (formData.get("password") as string | null) ?? "";
  const hakAkses = formField(formData, "hak_akses");
  const membership = formField(formData, "membership");
  const back = `${BASE}/create`;

  if (!name || !isEmail(email) || !oneOf(hakAkses, ["1", "2"]) || !oneOf(membership, ["0", "1"])) {
    redirect(withError(back, "Semua kolom wajib diisi dengan benar."));
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    redirect(withError(back, `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`));
  }
  const taken = await query<{ id: number }>("SELECT id FROM log WHERE name = ? LIMIT 1", [name]);
  if (taken.length > 0) redirect(withError(back, "Nama sudah dipakai."));

  let failed = false;
  try {
    await execute("INSERT INTO log (name, email, password, hak_akses, membership) VALUES (?, ?, ?, ?, ?)", [
      name,
      email,
      await hashPassword(password),
      Number(hakAkses),
      Number(membership),
    ]);
  } catch (e) {
    console.error(e);
    failed = true;
  }
  if (failed) redirect(withError(back, "Data gagal ditambahkan!"));
  redirect(BASE);
}

export async function updateCustomerAction(formData: FormData) {
  const session = await requireAdmin();
  const id = Number(formField(formData, "id"));
  const name = formField(formData, "name");
  const email = formField(formData, "email");
  const password = (formData.get("password") as string | null) ?? "";
  const hakAkses = formField(formData, "hak_akses");
  const membership = formField(formData, "membership");
  const back = `${BASE}/${id}/edit`;

  if (!Number.isInteger(id) || !name || !isEmail(email) || !oneOf(hakAkses, ["1", "2"]) || !oneOf(membership, ["0", "1"])) {
    redirect(withError(back, "Semua kolom wajib diisi dengan benar."));
  }
  if (password && password.length < MIN_PASSWORD_LENGTH) {
    redirect(withError(back, `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`));
  }
  if (id === session.uid && hakAkses !== "1") {
    redirect(withError(back, "Anda tidak dapat menurunkan hak akses akun Anda sendiri."));
  }
  const taken = await query<{ id: number }>("SELECT id FROM log WHERE name = ? AND id <> ? LIMIT 1", [name, id]);
  if (taken.length > 0) redirect(withError(back, "Nama sudah dipakai."));

  let failed = false;
  try {
    if (password) {
      await execute(
        "UPDATE log SET name = ?, email = ?, password = ?, hak_akses = ?, membership = ? WHERE id = ?",
        [name, email, await hashPassword(password), Number(hakAkses), Number(membership), id]
      );
    } else {
      // blank password = keep the current one
      await execute("UPDATE log SET name = ?, email = ?, hak_akses = ?, membership = ? WHERE id = ?", [
        name,
        email,
        Number(hakAkses),
        Number(membership),
        id,
      ]);
    }
  } catch (e) {
    console.error(e);
    failed = true;
  }
  if (failed) redirect(withError(back, "Data gagal diperbarui!"));
  redirect(BASE);
}

export async function deleteCustomerAction(formData: FormData) {
  const session = await requireAdmin();
  const id = Number(formField(formData, "id"));
  if (id === session.uid) redirect(withError(BASE, "Anda tidak dapat menghapus akun Anda sendiri."));

  let failed = false;
  try {
    await execute("DELETE FROM log WHERE id = ?", [id]);
  } catch {
    failed = true; // foreign keys: profile / points / point transactions still reference it
  }
  if (failed) {
    redirect(withError(BASE, "Data gagal dihapus! Pelanggan ini masih punya data terkait (profil, poin, atau transaksi poin)."));
  }
  redirect(BASE);
}

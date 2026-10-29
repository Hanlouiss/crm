"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { execute } from "@/lib/db";
import { formField } from "@/lib/format";

const BASE = "/admin/membership";
const withError = (path: string, message: string) => `${path}?error=${encodeURIComponent(message)}`;

function readReward(formData: FormData) {
  const name = formField(formData, "product_name");
  const cost = Number(formField(formData, "point_cost"));
  const description = formField(formData, "description");
  const valid = name.length > 0 && name.length <= 255 && Number.isInteger(cost) && cost >= 0 && description.length > 0;
  return { name, cost, description, valid };
}

export async function createRewardAction(formData: FormData) {
  await requireAdmin();
  const r = readReward(formData);
  if (!r.valid) redirect(withError(`${BASE}/create`, "Semua kolom wajib diisi dengan benar."));

  let failed = false;
  try {
    await execute("INSERT INTO reward_products (product_name, point_cost, description) VALUES (?, ?, ?)", [
      r.name,
      r.cost,
      r.description,
    ]);
  } catch (e) {
    console.error(e);
    failed = true;
  }
  if (failed) redirect(withError(`${BASE}/create`, "Gagal menambah produk!"));
  redirect(BASE);
}

export async function updateRewardAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formField(formData, "id"));
  const r = readReward(formData);
  const back = `${BASE}/${id}/edit`;
  if (!Number.isInteger(id) || !r.valid) redirect(withError(back, "Semua kolom wajib diisi dengan benar."));

  let failed = false;
  try {
    await execute("UPDATE reward_products SET product_name = ?, point_cost = ?, description = ? WHERE id = ?", [
      r.name,
      r.cost,
      r.description,
      id,
    ]);
  } catch (e) {
    console.error(e);
    failed = true;
  }
  if (failed) redirect(withError(back, "Gagal memperbarui produk!"));
  redirect(BASE);
}

export async function deleteRewardAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formField(formData, "id"));
  let failed = false;
  try {
    await execute("DELETE FROM reward_products WHERE id = ?", [id]);
  } catch {
    failed = true; // already used in transaksipoin
  }
  if (failed) {
    redirect(withError(BASE, "Gagal menghapus produk! Produk ini sudah pernah ditukar oleh pelanggan."));
  }
  redirect(BASE);
}

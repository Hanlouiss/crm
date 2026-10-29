"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { execute } from "@/lib/db";
import { formField } from "@/lib/format";

const BASE = "/admin/produk";
const withError = (path: string, message: string) => `${path}?error=${encodeURIComponent(message)}`;

function readProduct(formData: FormData) {
  const name = formField(formData, "product_name");
  const price = Number(formField(formData, "price"));
  const valid = name.length > 0 && name.length <= 255 && Number.isFinite(price) && price >= 0 && price < 1e8;
  return { name, price: Math.round(price * 100) / 100, valid };
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const p = readProduct(formData);
  if (!p.valid) redirect(withError(`${BASE}/create`, "Nama atau harga tidak valid."));

  let failed = false;
  try {
    await execute("INSERT INTO products (product_name, price) VALUES (?, ?)", [p.name, p.price]);
  } catch (e) {
    console.error(e);
    failed = true;
  }
  if (failed) redirect(withError(`${BASE}/create`, "Produk gagal ditambahkan!"));
  redirect(BASE);
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formField(formData, "id"));
  const p = readProduct(formData);
  const back = `${BASE}/${id}/edit`;
  if (!Number.isInteger(id) || !p.valid) redirect(withError(back, "Nama atau harga tidak valid."));

  let failed = false;
  try {
    await execute("UPDATE products SET product_name = ?, price = ? WHERE id = ?", [p.name, p.price, id]);
  } catch (e) {
    console.error(e);
    failed = true;
  }
  if (failed) redirect(withError(back, "Produk gagal diperbarui!"));
  redirect(BASE);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formField(formData, "id"));
  let failed = false;
  try {
    // NOTE: transaksiproduk.id_produk is ON DELETE CASCADE, so this also removes that product's sales history.
    await execute("DELETE FROM products WHERE id = ?", [id]);
  } catch {
    failed = true;
  }
  if (failed) redirect(withError(BASE, "Produk gagal dihapus!"));
  redirect(BASE);
}

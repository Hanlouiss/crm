"use server";

import { redirect } from "next/navigation";
import { requireCustomer } from "@/lib/auth";
import { query, withTransaction, type RowDataPacket } from "@/lib/db";
import { formField } from "@/lib/format";
import { pointsFor, syncLevel } from "@/lib/membership";
import type { LogRow } from "@/lib/types";

const withError = (path: string, message: string) => `${path}?error=${encodeURIComponent(message)}`;

/** Buy a product: saves the transaction and adds points, atomically. */
export async function buyProductAction(formData: FormData) {
  const session = await requireCustomer();
  const productId = Number(formField(formData, "product_id"));
  const qty = Number(formField(formData, "quantity"));

  if (!Number.isInteger(productId) || !Number.isInteger(qty) || qty < 1) {
    redirect(withError("/beli-produk", "Jumlah pembelian tidak valid."));
  }

  let problem: string | null = null;
  try {
    await withTransaction(async (conn) => {
      // The price always comes from the database, never from the browser.
      const [rows] = await conn.query<RowDataPacket[]>("SELECT price FROM products WHERE id = ?", [productId]);
      if (rows.length === 0) throw new Error("NOT_FOUND");

      const total = Math.round(Number(rows[0].price) * qty * 100) / 100;
      await conn.query(
        "INSERT INTO transaksiproduk (id_produk, id_customer, qty, total_harga) VALUES (?, ?, ?, ?)",
        [productId, session.uid, qty, total]
      );

      const earned = pointsFor(total);
      await conn.query(
        "INSERT INTO customer_points (customer_id, total_points) VALUES (?, ?) ON DUPLICATE KEY UPDATE total_points = total_points + ?",
        [session.uid, earned, earned]
      );
    });
  } catch (e) {
    console.error(e);
    problem = e instanceof Error && e.message === "NOT_FOUND" ? "Produk tidak ditemukan." : "Pembelian gagal. Coba lagi.";
  }
  if (problem) redirect(withError("/beli-produk", problem));

  await syncLevel(session.uid);
  redirect("/beli-produk?notif=ok");
}

/** Redeem points for a reward product. The point cost is read from the database. */
export async function redeemPointsAction(formData: FormData) {
  const session = await requireCustomer();
  const rewardId = Number(formField(formData, "reward_id"));
  const qty = Number(formField(formData, "quantity"));

  if (!Number.isInteger(rewardId) || !Number.isInteger(qty) || qty < 1) {
    redirect(withError("/membership-shop", "Jumlah tidak valid."));
  }

  let problem: string | null = null;
  try {
    await withTransaction(async (conn) => {
      const [reward] = await conn.query<RowDataPacket[]>("SELECT point_cost FROM reward_products WHERE id = ?", [
        rewardId,
      ]);
      if (reward.length === 0) throw new Error("NOT_FOUND");
      const totalPoints = Number(reward[0].point_cost) * qty;

      const [pts] = await conn.query<RowDataPacket[]>(
        "SELECT total_points FROM customer_points WHERE customer_id = ? FOR UPDATE",
        [session.uid]
      );
      const current = Number(pts[0]?.total_points ?? 0);
      if (current < totalPoints) throw new Error("NOT_ENOUGH");

      await conn.query(
        "UPDATE customer_points SET total_points = total_points - ?, last_updated = NOW() WHERE customer_id = ?",
        [totalPoints, session.uid]
      );
      await conn.query(
        "INSERT INTO transaksipoin (id_customer, id_poin, qty, total_poin) VALUES (?, ?, ?, ?)",
        [session.uid, rewardId, qty, totalPoints]
      );
    });
  } catch (e) {
    if (e instanceof Error && e.message === "NOT_ENOUGH") problem = "Poin Anda tidak cukup untuk pembelian ini.";
    else if (e instanceof Error && e.message === "NOT_FOUND") problem = "Produk tidak ditemukan.";
    else {
      console.error(e);
      problem = "Penukaran poin gagal. Coba lagi.";
    }
  }
  if (problem) redirect(withError("/membership-shop", problem));
  redirect("/dashboard?notif=redeemed");
}

/** Join membership. Same as the PHP version: previous points are reset. */
export async function joinMembershipAction() {
  const session = await requireCustomer();
  const [user] = await query<LogRow>("SELECT membership FROM log WHERE id = ?", [session.uid]);
  if (user?.membership === 1) redirect("/dashboard?notif=already");

  let failed = false;
  try {
    await withTransaction(async (conn) => {
      await conn.query("UPDATE log SET membership = 1 WHERE id = ?", [session.uid]);
      await conn.query("DELETE FROM customer_points WHERE customer_id = ?", [session.uid]);
    });
  } catch (e) {
    console.error(e);
    failed = true;
  }
  if (failed) redirect(withError("/membership", "Gagal bergabung membership. Coba lagi."));
  redirect("/dashboard?notif=joined");
}


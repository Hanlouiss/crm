"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { escapeHtml, formatRupiah, formField } from "@/lib/format";
import { sendMail } from "@/lib/mail";

const BASE = "/admin/transaksi-produk";

type Summary = {
  email: string | null;
  nama: string | null;
  total_qty: string | number | null;
  total_point: string | number | null;
  total_spent: string | number | null;
  level: string | null;
};

export async function sendCustomerEmailAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formField(formData, "id_customer"));
  if (!Number.isInteger(id) || id <= 0) {
    redirect(`${BASE}?error=${encodeURIComponent("ID Customer tidak valid.")}`);
  }

  const [row] = await query<Summary>(
    `SELECT log.email, log.name AS nama,
            SUM(transaksiproduk.qty) AS total_qty,
            (FLOOR(SUM(transaksiproduk.total_harga) / 100000) * 10) AS total_point,
            SUM(transaksiproduk.total_harga) AS total_spent,
            log.level AS level
       FROM log
       JOIN transaksiproduk ON log.id = transaksiproduk.id_customer
      WHERE transaksiproduk.id_customer = ?
      GROUP BY log.id, log.email, log.name, log.level`,
    [id]
  );
  if (!row || !row.email) {
    redirect(`${BASE}?error=${encodeURIComponent("Data tidak ditemukan, email gagal dikirim.")}`);
  }

  let failed = false;
  try {
    await sendMail({
      to: row.email,
      subject: "Pengingat Pembelian dan Poin",
      html: `Hi ${escapeHtml(row.nama ?? "")},<br><br>
        Terima kasih telah berbelanja dengan kami. Berikut adalah detail dari transaksi terakhir Anda:<br>
        <b>Total Pengeluaran:</b> ${formatRupiah(row.total_spent, 2)}<br>
        <b>Total Jumlah Produk:</b> ${Number(row.total_qty ?? 0)}<br>
        <b>Total Poin yang Diperoleh:</b> ${Number(row.total_point ?? 0)} poin.<br>
        <b>Level Anda:</b> ${escapeHtml(row.level ?? "0")}<br><br>
        Jangan lupa untuk menggunakan poin Anda dalam pembelian berikutnya!`,
    });
  } catch (e) {
    console.error("Failed to send customer email:", e);
    failed = true;
  }
  if (failed) redirect(`${BASE}?error=${encodeURIComponent("Email gagal dikirim. Periksa pengaturan SMTP.")}`);
  redirect(`${BASE}?notif=sent`);
}

import { sendCustomerEmailAction } from "@/actions/admin-email";
import Notification from "@/components/Notification";
import { ErrorBanner } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { formatRupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

type Row = {
  customer_name: string;
  product_name: string;
  total_qty: string | number;
  total_harga: string | number;
  earned_points: string | number;
  id_customer: number;
  product_id: number;
};

export default async function TransaksiProdukPage({ searchParams }: { searchParams: { notif?: string; error?: string } }) {
  await requireAdmin();
  const rows = await query<Row>(
    `SELECT log.name AS customer_name,
            products.product_name AS product_name,
            products.id AS product_id,
            SUM(transaksiproduk.qty) AS total_qty,
            SUM(transaksiproduk.total_harga) AS total_harga,
            (FLOOR(SUM(transaksiproduk.total_harga) / 100000) * 10) AS earned_points,
            log.id AS id_customer
       FROM transaksiproduk
       JOIN products ON transaksiproduk.id_produk = products.id
       JOIN log ON transaksiproduk.id_customer = log.id
      GROUP BY log.id, log.name, products.id, products.product_name
      ORDER BY log.name, products.product_name`
  );

  return (
    <div className="container">
      <h1>Daftar Transaksi Produk</h1>
      <ErrorBanner message={searchParams.error} />
      <Notification message={searchParams.notif === "sent" ? "Email berhasil dikirim!" : undefined} />

      {rows.length === 0 ? (
        <p>Tidak ada data transaksi yang ditemukan.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama Pelanggan</th>
                <th>Nama Produk</th>
                <th>Total Jumlah (Qty)</th>
                <th>Total Harga (Rp)</th>
                <th>Poin yang Diperoleh</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.id_customer}-${r.product_id}`}>
                  <td>{r.customer_name}</td>
                  <td>{r.product_name}</td>
                  <td>{r.total_qty}</td>
                  <td>{formatRupiah(r.total_harga, 2)}</td>
                  <td>{r.earned_points}</td>
                  <td className="actions">
                    <form action={sendCustomerEmailAction}>
                      <input type="hidden" name="id_customer" value={r.id_customer} />
                      <button type="submit" className="btn">✉️ Kirim Email</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type Row = { id: number; nama_pelanggan: string; nama_produk: string; qty: number; total_poin: number };

export default async function TransaksiPoinPage() {
  await requireAdmin();
  const rows = await query<Row>(
    `SELECT transaksipoin.id,
            log.name AS nama_pelanggan,
            reward_products.product_name AS nama_produk,
            transaksipoin.qty,
            transaksipoin.total_poin
       FROM transaksipoin
       JOIN log ON transaksipoin.id_customer = log.id
       JOIN reward_products ON transaksipoin.id_poin = reward_products.id
      ORDER BY transaksipoin.id DESC`
  );

  return (
    <div className="container">
      <h1>Transaksi Poin Pelanggan</h1>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nama Pelanggan</th>
              <th>Nama Produk Poin</th>
              <th>Qty</th>
              <th>Total Poin</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={4}>Tidak ada data transaksi poin.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.nama_pelanggan}</td>
                  <td>{r.nama_produk}</td>
                  <td>{r.qty}</td>
                  <td>{r.total_poin}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

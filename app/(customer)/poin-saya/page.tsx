import { BackLink } from "@/components/ui";
import { requireCustomer } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type Row = { id: number; qty: number; total_poin: number; product_name: string; point_cost: number };

export default async function PoinSayaPage() {
  const session = await requireCustomer();
  const rows = await query<Row>(
    `SELECT tp.id, tp.qty, tp.total_poin, rp.product_name, rp.point_cost
       FROM transaksipoin tp
       JOIN reward_products rp ON tp.id_poin = rp.id
      WHERE tp.id_customer = ?
      ORDER BY tp.id DESC`,
    [session.uid]
  );

  return (
    <div className="container">
      <h1>Riwayat Transaksi Poin Pelanggan</h1>
      {rows.length === 0 ? (
        <p>Belum ada data poin yang diterima oleh pelanggan ini.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Harga Poin</th>
                <th>Jumlah Barang</th>
                <th>Total Poin</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.product_name}</td>
                  <td>{r.point_cost}</td>
                  <td>{r.qty}</td>
                  <td>{r.total_poin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <BackLink href="/dashboard" label="Kembali ke Dashboard" />
    </div>
  );
}

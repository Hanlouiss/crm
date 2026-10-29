import { BackLink } from "@/components/ui";
import { requireCustomer } from "@/lib/auth";
import { query } from "@/lib/db";
import { formatRupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

type Row = { id: number; id_produk: number; qty: number; total_harga: string; product_name: string };

export default async function TransaksiSayaPage() {
  const session = await requireCustomer();

  const rows = await query<Row>(
    `SELECT tp.id, tp.id_produk, tp.qty, tp.total_harga, p.product_name
       FROM transaksiproduk tp
       JOIN products p ON tp.id_produk = p.id
      WHERE tp.id_customer = ?
      ORDER BY tp.id DESC`,
    [session.uid]
  );
  const [user] = await query<{ membership: number | null }>("SELECT membership FROM log WHERE id = ?", [session.uid]);
  const [pts] = await query<{ total_points: number }>(
    "SELECT total_points FROM customer_points WHERE customer_id = ?",
    [session.uid]
  );

  return (
    <div className="container">
      <h1>Transaksi Saya</h1>

      {rows.length === 0 ? (
        <p>Tidak ada transaksi yang ditemukan.</p>
      ) : (
        <>
          {rows.map((t) => (
            <div className="transaction-card" key={t.id}>
              <h2>{t.product_name}</h2>
              <p>Kuantitas: {t.qty}</p>
              <p>Total Harga: {formatRupiah(t.total_harga)}</p>
            </div>
          ))}
          {user?.membership === 1 && <h2>Total Poin Anda: {pts?.total_points ?? 0} Poin</h2>}
        </>
      )}
      <BackLink href="/dashboard" label="Kembali ke Dashboard" />
    </div>
  );
}

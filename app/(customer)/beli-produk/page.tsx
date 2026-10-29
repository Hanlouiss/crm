import { buyProductAction } from "@/actions/shop";
import Notification from "@/components/Notification";
import { BackLink, ErrorBanner } from "@/components/ui";
import { requireCustomer } from "@/lib/auth";
import { query } from "@/lib/db";
import { formatRupiah } from "@/lib/format";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BeliProdukPage({ searchParams }: { searchParams: { notif?: string; error?: string } }) {
  await requireCustomer();
  const products = await query<Product>("SELECT * FROM products ORDER BY id");

  return (
    <div className="container">
      <h1>Beli Produk</h1>
      <ErrorBanner message={searchParams.error} />
      <Notification message={searchParams.notif === "ok" ? "Pembelian berhasil! Poin Anda telah diperbarui." : undefined} />

      {products.length === 0 ? (
        <p>Produk tidak tersedia.</p>
      ) : (
        <div className="card-grid">
          {products.map((p) => (
            <div className="card" key={p.id}>
              <h3>{p.product_name}</h3>
              <p className="price">{formatRupiah(p.price)}</p>
              <form action={buyProductAction}>
                <input type="hidden" name="product_id" value={p.id} />
                <input type="number" name="quantity" min={1} step={1} defaultValue={1} required aria-label="Jumlah" />
                <button type="submit" className="btn">Beli Sekarang</button>
              </form>
            </div>
          ))}
        </div>
      )}
      <BackLink href="/dashboard" />
    </div>
  );
}

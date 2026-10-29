import Link from "next/link";
import { deleteProductAction } from "@/actions/admin-products";
import DeleteButton from "@/components/DeleteButton";
import { ErrorBanner } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { formatRupiah } from "@/lib/format";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProdukPage({ searchParams }: { searchParams: { error?: string } }) {
  await requireAdmin();
  const rows = await query<Product>("SELECT * FROM products ORDER BY id");

  return (
    <div className="container">
      <h1>Data Produk</h1>
      <div className="toolbar">
        <Link href="/admin/produk/create" className="btn btn-green">➕ Tambah Produk</Link>
      </div>
      <ErrorBanner message={searchParams.error} />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Produk</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={4}>Tidak ada data produk.</td></tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.product_name}</td>
                  <td>{formatRupiah(p.price, 2)}</td>
                  <td className="actions">
                    <Link className="btn" href={`/admin/produk/${p.id}/edit`}>Update</Link>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <DeleteButton message="Menghapus produk ini juga akan menghapus semua riwayat transaksi pembelian produk tersebut. Lanjutkan?" />
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

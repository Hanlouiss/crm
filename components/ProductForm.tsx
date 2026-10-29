import Link from "next/link";
import { ErrorBanner } from "./ui";
import type { Product } from "@/lib/types";

export default function ProductForm({
  action,
  product,
  submitLabel,
  error,
}: {
  action: (formData: FormData) => Promise<void>;
  product?: Product;
  submitLabel: string;
  error?: string;
}) {
  return (
    <form action={action}>
      <ErrorBanner message={error} />
      {product && <input type="hidden" name="id" value={product.id} />}

      <label htmlFor="product_name">Nama Produk:</label>
      <input type="text" name="product_name" id="product_name" defaultValue={product?.product_name ?? ""} required />

      <label htmlFor="price">Harga (Rupiah):</label>
      <input type="number" name="price" id="price" min="0" step="0.01" defaultValue={product?.price ?? ""} required />

      <div className="button-container">
        <button type="submit" className="btn btn-pill">{submitLabel}</button>
        <Link href="/admin/produk" className="btn btn-pill">Kembali</Link>
      </div>
    </form>
  );
}

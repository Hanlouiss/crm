import Link from "next/link";
import { ErrorBanner } from "./ui";
import type { RewardProduct } from "@/lib/types";

export default function RewardForm({
  action,
  reward,
  submitLabel,
  error,
}: {
  action: (formData: FormData) => Promise<void>;
  reward?: RewardProduct;
  submitLabel: string;
  error?: string;
}) {
  return (
    <form action={action}>
      <ErrorBanner message={error} />
      {reward && <input type="hidden" name="id" value={reward.id} />}

      <label htmlFor="product_name">Nama Produk:</label>
      <input type="text" name="product_name" id="product_name" defaultValue={reward?.product_name ?? ""} required />

      <label htmlFor="point_cost">Poin yang Dibutuhkan:</label>
      <input type="number" name="point_cost" id="point_cost" min="0" step="1" defaultValue={reward?.point_cost ?? ""} required />

      <label htmlFor="description">Deskripsi:</label>
      <textarea name="description" id="description" rows={4} defaultValue={reward?.description ?? ""} required />

      <div className="button-container">
        <button type="submit" className="btn btn-pill">{submitLabel}</button>
        <Link href="/admin/membership" className="btn btn-pill">Kembali</Link>
      </div>
    </form>
  );
}

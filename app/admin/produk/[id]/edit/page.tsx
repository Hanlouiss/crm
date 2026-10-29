import { notFound } from "next/navigation";
import { updateProductAction } from "@/actions/admin-products";
import ProductForm from "@/components/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  await requireAdmin();
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const [product] = await query<Product>("SELECT * FROM products WHERE id = ?", [id]);
  if (!product) notFound();

  return (
    <div className="container narrow-form">
      <h1>Update Produk</h1>
      <ProductForm action={updateProductAction} product={product} submitLabel="Update Produk" error={searchParams.error} />
    </div>
  );
}

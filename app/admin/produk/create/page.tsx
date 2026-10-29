import { createProductAction } from "@/actions/admin-products";
import ProductForm from "@/components/ProductForm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CreateProductPage({ searchParams }: { searchParams: { error?: string } }) {
  await requireAdmin();
  return (
    <div className="container narrow-form">
      <h1>Add New Product</h1>
      <ProductForm action={createProductAction} submitLabel="Add Product" error={searchParams.error} />
    </div>
  );
}

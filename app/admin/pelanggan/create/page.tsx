import { createCustomerAction } from "@/actions/admin-customers";
import CustomerForm from "@/components/CustomerForm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CreateCustomerPage({ searchParams }: { searchParams: { error?: string } }) {
  await requireAdmin();
  return (
    <div className="container narrow-form">
      <h1>Tambah Data Pelanggan</h1>
      <CustomerForm action={createCustomerAction} submitLabel="Tambah" error={searchParams.error} />
    </div>
  );
}

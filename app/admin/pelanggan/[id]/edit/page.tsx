import { notFound } from "next/navigation";
import { updateCustomerAction } from "@/actions/admin-customers";
import CustomerForm from "@/components/CustomerForm";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import type { LogRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditCustomerPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  await requireAdmin();
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const [user] = await query<LogRow>("SELECT id, name, email, hak_akses, membership FROM log WHERE id = ?", [id]);
  if (!user) notFound();

  return (
    <div className="container narrow-form">
      <h1>Update Data Pelanggan</h1>
      <CustomerForm action={updateCustomerAction} user={user} submitLabel="Update" error={searchParams.error} />
    </div>
  );
}

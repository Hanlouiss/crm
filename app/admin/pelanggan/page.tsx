import Link from "next/link";
import { deleteCustomerAction } from "@/actions/admin-customers";
import DeleteButton from "@/components/DeleteButton";
import { ErrorBanner } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import type { LogRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPelangganPage({ searchParams }: { searchParams: { error?: string } }) {
  await requireAdmin();
  // Password column is intentionally not selected / shown.
  const rows = await query<LogRow>("SELECT id, name, email, hak_akses, membership FROM log ORDER BY id");

  return (
    <div className="container">
      <h1>Data Pelanggan</h1>
      <div className="toolbar">
        <Link href="/admin/pelanggan/create" className="btn btn-green">➕ Tambah Pelanggan</Link>
      </div>
      <ErrorBanner message={searchParams.error} />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Hak Akses</th>
              <th>Membership</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6}>Tidak ada data pelanggan.</td></tr>
            ) : (
              rows.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.hak_akses}</td>
                  <td>{u.membership}</td>
                  <td className="actions">
                    <Link className="btn" href={`/admin/pelanggan/${u.id}/edit`}>Update</Link>
                    <form action={deleteCustomerAction}>
                      <input type="hidden" name="id" value={u.id} />
                      <DeleteButton />
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

import Link from "next/link";
import { deleteRewardAction } from "@/actions/admin-rewards";
import DeleteButton from "@/components/DeleteButton";
import { ErrorBanner } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import type { RewardProduct } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminMembershipPage({ searchParams }: { searchParams: { error?: string } }) {
  await requireAdmin();
  const rows = await query<RewardProduct>("SELECT * FROM reward_products ORDER BY id");

  return (
    <div className="container">
      <h1>Data Membership</h1>
      <div className="toolbar">
        <Link href="/admin/membership/create" className="btn btn-green">➕ Tambah Membership</Link>
      </div>
      <ErrorBanner message={searchParams.error} />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Membership</th>
              <th>Poin yang Diperlukan</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5}>Tidak ada data membership.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.product_name}</td>
                  <td>{r.point_cost}</td>
                  <td>{r.description}</td>
                  <td className="actions">
                    <Link className="btn" href={`/admin/membership/${r.id}/edit`}>Update</Link>
                    <form action={deleteRewardAction}>
                      <input type="hidden" name="id" value={r.id} />
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

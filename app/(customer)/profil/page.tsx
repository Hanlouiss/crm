import { BackLink } from "@/components/ui";
import { requireCustomer } from "@/lib/auth";
import { query } from "@/lib/db";
import type { DataPelanggan } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const session = await requireCustomer();
  const [p] = await query<DataPelanggan>(
    "SELECT nama, tanggal_lahir, tempat_tinggal, no_telp FROM data_pelanggan WHERE id = ? LIMIT 1",
    [session.uid]
  );

  return (
    <div className="container narrow">
      <h1>Your Profile</h1>
      {p ? (
        <div className="profile-info">
          <p><strong>Name:</strong> {p.nama}</p>
          <p><strong>Date of Birth:</strong> {p.tanggal_lahir}</p>
          <p><strong>Address:</strong> {p.tempat_tinggal}</p>
          <p><strong>Phone:</strong> {p.no_telp}</p>
        </div>
      ) : (
        <p>Data pribadi belum tersedia.</p>
      )}
      <BackLink href="/dashboard" label="Back to Dashboard" />
    </div>
  );
}

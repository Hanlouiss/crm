import ProfileCards from "@/components/ProfileCards";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import type { DataPelanggan } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProfilPelangganPage() {
  await requireAdmin();
  const items = await query<DataPelanggan>("SELECT * FROM data_pelanggan ORDER BY id_pelanggan");

  return (
    <div className="container">
      <h1>Customer Profiles</h1>
      {items.length === 0 ? <p>Belum ada data profil pelanggan.</p> : <ProfileCards items={items} />}
    </div>
  );
}

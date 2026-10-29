import { createRewardAction } from "@/actions/admin-rewards";
import RewardForm from "@/components/RewardForm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CreateRewardPage({ searchParams }: { searchParams: { error?: string } }) {
  await requireAdmin();
  return (
    <div className="container narrow-form">
      <h1>Tambah Produk Penukaran Poin</h1>
      <RewardForm action={createRewardAction} submitLabel="Tambah Produk" error={searchParams.error} />
    </div>
  );
}

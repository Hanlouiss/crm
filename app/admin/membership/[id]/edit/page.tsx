import { notFound } from "next/navigation";
import { updateRewardAction } from "@/actions/admin-rewards";
import RewardForm from "@/components/RewardForm";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import type { RewardProduct } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditRewardPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  await requireAdmin();
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const [reward] = await query<RewardProduct>("SELECT * FROM reward_products WHERE id = ?", [id]);
  if (!reward) notFound();

  return (
    <div className="container narrow-form">
      <h1>Edit Produk Penukaran Poin</h1>
      <RewardForm action={updateRewardAction} reward={reward} submitLabel="Update Produk" error={searchParams.error} />
    </div>
  );
}

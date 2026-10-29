import RedeemButton from "@/components/RedeemButton";
import { BackLink, ErrorBanner } from "@/components/ui";
import { requireCustomer } from "@/lib/auth";
import { query } from "@/lib/db";
import type { RewardProduct } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MembershipShopPage({ searchParams }: { searchParams: { error?: string } }) {
  const session = await requireCustomer();
  const products = await query<RewardProduct>("SELECT * FROM reward_products ORDER BY id");
  const [pts] = await query<{ total_points: number }>(
    "SELECT total_points FROM customer_points WHERE customer_id = ?",
    [session.uid]
  );

  return (
    <div className="container">
      <h1>Membership Products</h1>
      <p>Poin Anda: <strong>{pts?.total_points ?? 0}</strong></p>
      <ErrorBanner message={searchParams.error} />

      <div className="card-grid">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.product_name}</h3>
            <p className="price">Points: {p.point_cost}</p>
            <p>{p.description}</p>
            <RedeemButton id={p.id} name={p.product_name} cost={p.point_cost} />
          </div>
        ))}
      </div>
      <BackLink href="/dashboard" label="Kembali ke Dashboard" />
    </div>
  );
}

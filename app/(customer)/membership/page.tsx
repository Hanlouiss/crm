import { redirect } from "next/navigation";
import { joinMembershipAction } from "@/actions/shop";
import { BackLink, ErrorBanner } from "@/components/ui";
import { requireCustomer } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function JoinMembershipPage({ searchParams }: { searchParams: { error?: string } }) {
  const session = await requireCustomer();
  const [user] = await query<{ membership: number | null }>("SELECT membership FROM log WHERE id = ?", [session.uid]);
  if (user?.membership === 1) redirect("/dashboard?notif=already");

  return (
    <div className="container narrow">
      <h1>Join Membership</h1>
      <p>Become a member to enjoy exclusive benefits!</p>
      <p>As a member, you will receive discounts, special offers, and access to exclusive content.</p>
      <p><strong>Catatan:</strong> poin yang Anda miliki sebelumnya akan direset saat bergabung.</p>
      <ErrorBanner message={searchParams.error} />

      <form action={joinMembershipAction}>
        <button type="submit" className="btn btn-green">Join Membership</button>
      </form>
      <BackLink href="/dashboard" label="Back to Dashboard" />
    </div>
  );
}

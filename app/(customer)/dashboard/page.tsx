import Link from "next/link";
import Notification from "@/components/Notification";
import { LogoutButton } from "@/components/ui";
import { requireCustomer } from "@/lib/auth";
import { query } from "@/lib/db";
import { LEVEL_ICONS, syncLevel } from "@/lib/membership";
import { getMenusForMembership } from "@/lib/menu";
import type { LogRow } from "@/lib/types";

export const dynamic = "force-dynamic";

const NOTIFS: Record<string, string> = {
  joined: "Anda berhasil bergabung sebagai member! Poin sebelumnya telah direset.",
  already: "Anda sudah menjadi member!",
  redeemed: "Penukaran poin berhasil.",
};

export default async function CustomerDashboard({ searchParams }: { searchParams: { notif?: string } }) {
  const session = await requireCustomer();
  const [user] = await query<LogRow>("SELECT id, membership FROM log WHERE id = ?", [session.uid]);

  if (!user) {
    return (
      <div className="container narrow">
        <h1>Dashboard Customer</h1>
        <p className="error">Akun Anda tidak ditemukan.</p>
        <LogoutButton />
      </div>
    );
  }

  const level = await syncLevel(user.id);
  const menus = await getMenusForMembership(user.membership);

  return (
    <div className="container">
      <h1>Dashboard Customer</h1>
      <p>Welcome, {session.name}!</p>
      <p>
        Your Membership Level:{" "}
        <strong>
          {LEVEL_ICONS[level] ?? "👤"} {level}
        </strong>
      </p>

      <Notification message={searchParams.notif ? NOTIFS[searchParams.notif] : undefined} />

      <div className="card-grid">
        {menus.map((m, i) => (
          <div className="card" key={i}>
            <div className="card-icon">👤</div>
            <h3>{m.title}</h3>
            <Link href={m.href} className="btn">Go</Link>
          </div>
        ))}

        {user.membership !== 1 && (
          <div className="card">
            <div className="card-icon">💎</div>
            <h3>Join Membership</h3>
            <Link href="/membership" className="btn btn-green">Join</Link>
          </div>
        )}

        <div className="card">
          <div className="card-icon">🎁</div>
          <h3>Check Transaction Points</h3>
          <Link href="/poin-saya" className="btn">Check</Link>
        </div>

        <div className="card">
          <div className="card-icon">🪪</div>
          <h3>View Profile</h3>
          <Link href="/profil" className="btn">View</Link>
        </div>

        <div className="card">
          <div className="card-icon">🚪</div>
          <h3>Logout</h3>
          <LogoutButton label="Keluar" />
        </div>
      </div>
    </div>
  );
}

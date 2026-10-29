import { query } from "./db";

// Menu paths in the `membership` table were written for the PHP app, e.g.
// "http://localhost/crm_tes2/membershipshop.php". Translate them to the new routes.
const LEGACY: Record<string, string> = {
  "customer_dashboard.php": "/dashboard",
  "membershipshop.php": "/membership-shop",
  "beliproduk.php": "/beli-produk",
  "lihattransaksi.php": "/transaksi-saya",
  "check_poin_pelanggan.php": "/poin-saya",
  "viewprofile.php": "/profil",
  "membership.php": "/membership",
};

const OLD_PROJECT_FOLDER = /^\/?crm_tes2\//;

export function toRoute(path: string | null): string {
  let raw = (path ?? "").trim(); // the seed data has a trailing TAB on some paths

  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") return raw; // real external link
      raw = url.pathname;
    } catch {
      return raw;
    }
  }

  const cleaned = raw
    .replace(/[?#].*$/, "")
    .replace(OLD_PROJECT_FOLDER, "")
    .replace(/^(\.\.?\/)+/, "")
    .replace(/^\//, "");

  if (cleaned in LEGACY) return LEGACY[cleaned];
  return "/" + cleaned.replace(/\.php$/, "").replace(/\/index$/, "").replace(/_/g, "-");
}

export type MenuItem = { title: string; href: string };

export async function getMenusForMembership(membership: number | null): Promise<MenuItem[]> {
  if (membership === null) return [];
  const rows = await query<{ menu: string | null; path: string | null }>(
    "SELECT menu, path FROM membership WHERE membership = ?",
    [membership]
  );
  return rows.map((r) => ({ title: r.menu ?? "", href: toRoute(r.path) }));
}

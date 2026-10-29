import Link from "next/link";
import { LogoutButton } from "./ui";

const LINKS = [
  { href: "/admin", icon: "📊", label: "Dashboard" },
  { href: "/admin/pelanggan", icon: "👥", label: "Data Pelanggan" },
  { href: "/admin/produk", icon: "📦", label: "Data Produk" },
  { href: "/admin/membership", icon: "🎁", label: "Data Produk Membership" },
  { href: "/admin/transaksi-produk", icon: "⭐", label: "Total Transaksi Produk Pelanggan" },
  { href: "/admin/transaksi-poin", icon: "💳", label: "Total Transaksi Poin Pelanggan" },
  { href: "/admin/profil-pelanggan", icon: "👤", label: "Profil Pelanggan" },
];

export default function AdminSidebar() {
  return (
    <aside className="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href}>
            <span aria-hidden>{l.icon}</span> {l.label}
          </Link>
        ))}
      </nav>
      <LogoutButton className="btn btn-danger btn-block" label="🚪 Logout" />
    </aside>
  );
}

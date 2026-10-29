import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const CARDS = [
  { icon: "👥", title: "Data Pelanggan", href: "/admin/pelanggan", label: "Lihat Data" },
  { icon: "💎", title: "Total Transaksi Produk", href: "/admin/transaksi-produk", label: "Lihat Transaksi" },
  { icon: "📦", title: "Data Produk", href: "/admin/produk", label: "Lihat Produk" },
  { icon: "🏷️", title: "Data Produk Membership", href: "/admin/membership", label: "Lihat Membership" },
  { icon: "💳", title: "Total Transaksi Poin", href: "/admin/transaksi-poin", label: "Lihat Transaksi" },
  { icon: "👤", title: "Profil Pelanggan", href: "/admin/profil-pelanggan", label: "Lihat Profil" },
];

export default async function AdminDashboard() {
  const session = await requireAdmin();
  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin {session.name}!</p>
      <div className="card-grid">
        {CARDS.map((c) => (
          <div className="card" key={c.href}>
            <div className="card-icon">{c.icon}</div>
            <h3>{c.title}</h3>
            <Link href={c.href} className="btn">{c.label}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Membership",
  description: "Pembelian produk, poin, dan membership pelanggan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

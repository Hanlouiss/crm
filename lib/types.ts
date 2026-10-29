export type Role = "1" | "2"; // 1 = admin, 2 = pelanggan
export type Level = "0" | "Bronze" | "Silver" | "Gold" | "Platinum";

export type SessionData = { uid: number; name: string; role: Role };
export type ActionState = { error?: string; message?: string } | null;

export type LogRow = {
  id: number;
  name: string | null;
  email: string | null;
  password: string | null;
  hak_akses: number | null;
  membership: number | null;
  level: Level | null;
};

export type DataPelanggan = {
  id_pelanggan: number;
  nama: string;
  tanggal_lahir: string;
  tempat_tinggal: string;
  no_telp: string;
  id: number | null;
};

// DECIMAL columns come back from mysql2 as strings
export type Product = { id: number; product_name: string; price: string };
export type RewardProduct = { id: number; product_name: string; point_cost: number; description: string | null };

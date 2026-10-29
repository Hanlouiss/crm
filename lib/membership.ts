import { execute, query } from "./db";
import type { Level } from "./types";

export function levelFor(totalSpent: number): Level {
  if (totalSpent >= 5_000_000) return "Platinum";
  if (totalSpent >= 3_000_000) return "Gold";
  if (totalSpent >= 2_000_000) return "Silver";
  if (totalSpent >= 1_000_000) return "Bronze";
  return "0";
}

export const LEVEL_ICONS: Record<string, string> = {
  Platinum: "🏆",
  Gold: "⭐",
  Silver: "🏅",
  Bronze: "🎖️",
  "0": "🕵️",
};

/** Recomputes the level from total spending and saves it when it changed. */
export async function syncLevel(uid: number): Promise<Level> {
  const [spent] = await query<{ total: string | null }>(
    "SELECT SUM(total_harga) AS total FROM transaksiproduk WHERE id_customer = ?",
    [uid]
  );
  const level = levelFor(Number(spent?.total ?? 0));
  const [current] = await query<{ level: Level | null }>("SELECT level FROM log WHERE id = ?", [uid]);
  if (current && current.level !== level) {
    await execute("UPDATE log SET level = ? WHERE id = ?", [level, uid]);
  }
  return level;
}

// Points: 10 points for every Rp 100.000 spent.
export const pointsFor = (total: number) => Math.floor(total / 100000) * 10;
